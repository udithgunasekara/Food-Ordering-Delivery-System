package com.delivery.service.deliveryService.Service.ServiceIMPL;


import com.delivery.service.deliveryService.Client.UserClient;
import com.delivery.service.deliveryService.Client.RestaurantClient;
import com.delivery.service.deliveryService.DTO.DeliveryDTO;
import com.delivery.service.deliveryService.Event.*;
import com.delivery.service.deliveryService.Exception.ResourceNotFound;
import com.delivery.service.deliveryService.Model.Delivery;
import com.delivery.service.deliveryService.Model.Enums.DeliveryStatus;
import com.delivery.service.deliveryService.Repository.DeliveryRepository;
import com.delivery.service.deliveryService.Service.DeliveryService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.delivery.service.deliveryService.Mapper.DeliveryMapper.mapToDelivery;
import static com.delivery.service.deliveryService.Mapper.DeliveryMapper.mapToDeliveryDTO;
import static com.delivery.service.deliveryService.Mapper.OrderMapper.mapOrderResponseToOrder;

@Slf4j
@Service
@AllArgsConstructor
public class DeliveryServiceIMPL  implements DeliveryService {

    private final DeliveryRepository deliveryRepository;

    private final RestaurantClient restaurantClient;

    private final UserClient userClient;

    private final Map<String, InternalDeliveryPersonResponse> deliveryPersonsCache = new HashMap<>();

    private final KafkaTemplate<String, DeliveryResponse> kafkaTemplate;


    @PostConstruct
    @CircuitBreaker(name = "driverService", fallbackMethod = "fallbackLoadDeliveryPersons")
    @Retry(name = "driverService")
    public void init() {
        try {
            log.info("Initializing delivery persons cache...");
            loadDeliveryPersons();
        } catch (Exception e) {
            log.error("Failed to load delivery persons on startup: {}", e.getMessage());
        }
    }

    public void loadDeliveryPersons() {
        List<InternalDeliveryPersonResponse> list = userClient.getAllDeliveryRoles();
        deliveryPersonsCache.clear();
        for (InternalDeliveryPersonResponse dto : list) {
            if (dto.getId() != null) {
                deliveryPersonsCache.put(dto.getId(), dto);
            }
        }
        log.info("Loaded {} delivery persons into map cache.", deliveryPersonsCache.size());
    }

    // Fallback method with same signature + Throwable at the end
    public void fallbackLoadDeliveryPersons(Throwable t) {
        log.warn("Fallback triggered for loading delivery persons. Reason: {}", t.getMessage());
        // Optionally keep old data, or notify system admins, or serve cached results
    }

    public InternalDeliveryPersonResponse getDeliveryPersonById(String userId) {
        return deliveryPersonsCache.get(userId);
    }

    public Map<String, InternalDeliveryPersonResponse> getAllDeliveryPersons() {
        return deliveryPersonsCache;
    }

    @KafkaListener(topics = "order_placed")
    public void listenOrder(OrderResponse orderResponse) {
        log.info("Received order: {}", orderResponse);

        // Get coordinates for restaurant and customer via REST clients
        RestaurantResponse restaurantCoords = restaurantClient.getInternalRestaurant(orderResponse.getRestaurantId());
        CustomerResponse customerCoords = userClient.getUserByIdInternal(orderResponse.getCustomerId());


        // Create a new delivery
        DeliveryDTO deliveryDTO = new DeliveryDTO(
                generateUniqueId(),
                mapOrderResponseToOrder(orderResponse),
                null,
                customerCoords.getLongitude(),
                customerCoords.getLatitude(),
                restaurantCoords.getLongitude(),
                restaurantCoords.getLatitude(),
                null,
                null,
                DeliveryStatus.PENDING
        );

        createDelivery(deliveryDTO);

    }

    @KafkaListener(topics = "driver-assigned")
    public void listenForAssignedDriver(AssignedDriverResponse assignedDriverResponse) {
        log.info("Received assigned driver: {}", assignedDriverResponse);
        //get assign driver details
        InternalDeliveryPersonResponse assignedDriverDetails = getDeliveryPersonById(assignedDriverResponse.getId());

        //update delivery
        DeliveryDTO delivery = getDeliveryById(assignedDriverResponse.getDeliveryId());

        delivery.setDeliveryPersonId(assignedDriverResponse.getId());
        delivery.setDeliveryPersonLongitude(assignedDriverDetails.getLongitude());
        delivery.setDeliveryPersonLatitude(assignedDriverDetails.getLatitude());
        delivery.setDeliveryStatus(DeliveryStatus.IN_PROGRESS);

        updateDelivery(delivery.getDeliveryId(), delivery);
    }

    @KafkaListener(topics = "delivery_person_added")
    public void listenForNewDriver(InternalDeliveryPersonResponse internalDeliveryPersonResponse) {
        log.info("Received new driver: {}", internalDeliveryPersonResponse);
        deliveryPersonsCache.put(internalDeliveryPersonResponse.getId(), internalDeliveryPersonResponse);
    }

    @Override
    public DeliveryDTO createDelivery(DeliveryDTO deliveryDTO) {
        Delivery delivery = mapToDelivery(deliveryDTO);
        //Save Delivery data to database
        Delivery savedDelivery = deliveryRepository.save(delivery);
        // Filter nearby drivers
        List<InternalDeliveryPersonResponse> nearbyDrivers = deliveryPersonsCache.values().stream()
                .filter(driver -> driver.getLatitude() != null && driver.getLongitude() != null)
                .filter(driver -> calculateDistance(
                        Double.parseDouble(driver.getLatitude()),
                        Double.parseDouble(driver.getLongitude()),
                        Double.parseDouble(savedDelivery.getRestaurantLatitude()),
                        Double.parseDouble(savedDelivery.getRestaurantLongitude())
                ) <= 5.0).toList();

        log.info("Found {} drivers within 5km radius", nearbyDrivers.size());

        // Send Kafka message if there are nearby drivers
        if (!nearbyDrivers.isEmpty()) {
            DeliveryResponse deliveryResponse = new DeliveryResponse();
            deliveryResponse.setDeliveryId(savedDelivery.getDeliveryId());
            deliveryResponse.setOrderDetails(savedDelivery.getOrderDetails());
            deliveryResponse.setDriverDetails(nearbyDrivers);
            kafkaTemplate.send("nearby_drivers", deliveryResponse);
        }
        // Convert the updated delivery back to DeliveryDTO and return it
        return mapToDeliveryDTO(savedDelivery);
    }

    @Override
    public DeliveryDTO getDeliveryById(String deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElseThrow(
                () -> new ResourceNotFound("Delivery not found with id: " + deliveryId)
        );
        // Convert the updated delivery back to DeliveryDTO and return it
        return mapToDeliveryDTO(delivery);
    }

    @Override
    public DeliveryDTO updateDelivery(String deliveryId, DeliveryDTO deliveryDTO) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElseThrow(
                () -> new ResourceNotFound("Delivery not found with id: " + deliveryId)
        );

        // Update the delivery details
        delivery.setOrderDetails(deliveryDTO.getOrderDetails());
        delivery.setDeliveryPersonId(deliveryDTO.getDeliveryPersonId());
        delivery.setCustomerLongitude(deliveryDTO.getCustomerLongitude());
        delivery.setCustomerLatitude(deliveryDTO.getCustomerLatitude());
        delivery.setRestaurantLongitude(deliveryDTO.getRestaurantLongitude());
        delivery.setRestaurantLatitude(deliveryDTO.getRestaurantLatitude());
        delivery.setDeliveryPersonLongitude(deliveryDTO.getDeliveryPersonLongitude());
        delivery.setDeliveryPersonLatitude(deliveryDTO.getDeliveryPersonLatitude());
        delivery.setDeliveryStatus(deliveryDTO.getDeliveryStatus());

        // Save the updated delivery to the database
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        // Convert the updated delivery back to DeliveryDTO and return it
        return mapToDeliveryDTO(updatedDelivery);
    }

    @Override
    public void deleteDelivery(String deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElseThrow(
                () -> new ResourceNotFound("Delivery not found with id: " + deliveryId)
        );

        // Delete the delivery from the database
        deliveryRepository.delete(delivery);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371; // in km

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    public String generateUniqueId() {
        String id;
        do {
            id = UUID.randomUUID().toString();
        } while (deliveryRepository.existsById(id));
        return id;
    }

}
