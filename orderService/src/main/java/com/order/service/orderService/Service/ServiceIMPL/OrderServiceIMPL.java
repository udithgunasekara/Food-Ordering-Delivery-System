package com.order.service.orderService.Service.ServiceIMPL;

import com.order.service.orderService.DTO.OrderDTO;
import com.order.service.orderService.Event.OrderResponse;
import com.order.service.orderService.Exception.ResourceNotFound;
import com.order.service.orderService.Repository.OrderRepository;
import com.order.service.orderService.Service.OrderService;
import com.order.service.orderService.model.Order;
import com.order.service.orderService.model.Enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.order.service.orderService.Mapper.OrderMapper.mapToOrder;
import static com.order.service.orderService.Mapper.OrderMapper.mapToOrderDTO;

@Slf4j
@Service
@AllArgsConstructor
public class OrderServiceIMPL implements OrderService {
    // Injecting the OrderRepository dependency
    private final OrderRepository orderRepository;
    // Injecting the KafkaTemplate dependency
    private final KafkaTemplate<String, OrderResponse> kafkaTemplate;

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // Convert OrderDTO to Order entity
        Order order = mapToOrder(orderDTO);

        // Set default values for oder Id, order status, placeAt date and updatedAt date
        order.setId(generateUniqueId());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPlaceAt(new Date());
        order.setUpdatedAt(new Date());

        // Save the order to the database
        Order savedOrder = orderRepository.save(order);

        // Convert the saved order back to OrderDTO and return it
        return mapToOrderDTO(savedOrder);
    }

    @Override
    public OrderDTO getOrderById(String orderId) {
        // Find the order by ID
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new ResourceNotFound("Order not found with id: " + orderId)
        );
        return mapToOrderDTO(order);
    }

    @Override
    public OrderDTO updateOrder(String orderId, OrderDTO orderDTO) {

        // Find the order by ID
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new ResourceNotFound("Order not found with id: " + orderId)
        );

        // Update the order details
        order.setCustomerId(orderDTO.getCustomerId());
        order.setRestaurantId(orderDTO.getRestaurantId());
        order.setItems(orderDTO.getItems());
        order.setTotalPrice(orderDTO.getTotalPrice());
        order.setPaymentStatus(orderDTO.getPaymentStatus());
        order.setOrderStatus(orderDTO.getOrderStatus());
        order.setUpdatedAt(new Date());

        // Save the updated order to the database
        orderRepository.save(order);

        //if order is packed send the message to kafka topic
        if(order.getOrderStatus() == OrderStatus.PACKED){
            OrderResponse orderResponse = new OrderResponse(order.getId(),
                    order.getCustomerId(),
                    order.getRestaurantId(),
                    order.getItems(),
                    order.getTotalPrice(),
                    order.getPaymentStatus(),
                    order.getOrderStatus(),
                    order.getPlaceAt(),
                    order.getUpdatedAt());
            log.info("Start - Sending orderPlacedEvent {} to Kafka topic order-placed", orderResponse);
            kafkaTemplate.send("order_placed", orderResponse);
            log.info("End - Sending orderPlacedEvent {} to Kafka topic order-placed", orderResponse);
        }

        // Convert the updated order back to OrderDTO and return it
        return mapToOrderDTO(order);
    }

    @Override
    public void deleteOrder(String orderId) {
        // Find the order by ID
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new ResourceNotFound("Order not found with id: " + orderId)
        );

        // Delete the order from the database
        orderRepository.delete(order);
    }

    @Override
    public List<OrderDTO> getOrdersByCustomerId(String customerId) {
        // Find all orders by customer ID
        List<Order> allCustomerOrders = orderRepository.findByCustomerId(customerId);
        return allCustomerOrders.stream()
                .map((order) -> mapToOrderDTO(order))
                .collect(Collectors.toList());
    }

    public String generateUniqueId() {
        String id;
        do {
            id = UUID.randomUUID().toString();
        } while (orderRepository.existsById(id));
        return id;
    }
}
