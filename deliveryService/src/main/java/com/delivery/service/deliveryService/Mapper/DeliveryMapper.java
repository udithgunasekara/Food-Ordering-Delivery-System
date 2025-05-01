package com.delivery.service.deliveryService.Mapper;

import com.delivery.service.deliveryService.DTO.DeliveryDTO;
import com.delivery.service.deliveryService.Model.Delivery;

public class DeliveryMapper {

    public static DeliveryDTO mapToDeliveryDTO(Delivery delivery) {
        return new DeliveryDTO(delivery.getDeliveryId(),
                delivery.getOrderId(),
                delivery.getCustomerId(),
                delivery.getRestaurantId(),
                delivery.getDeliveryPersonId(),
                delivery.getCustomerLongitude(),
                delivery.getCustomerLatitude(),
                delivery.getRestaurantLongitude(),
                delivery.getRestaurantLatitude(),
                delivery.getDeliveryPersonLongitude(),
                delivery.getDeliveryPersonLatitude(),
                delivery.getDeliveryStatus());
    }

    public static Delivery mapToDelivery(DeliveryDTO deliveryDTO) {
        return new Delivery(deliveryDTO.getDeliveryId(),
                deliveryDTO.getOrderId(),
                deliveryDTO.getCustomerId(),
                deliveryDTO.getRestaurantId(),
                deliveryDTO.getDeliveryPersonId(),
                deliveryDTO.getCustomerLongitude(),
                deliveryDTO.getCustomerLatitude(),
                deliveryDTO.getRestaurantLongitude(),
                deliveryDTO.getRestaurantLatitude(),
                deliveryDTO.getDeliveryPersonLongitude(),
                deliveryDTO.getDeliveryPersonLatitude(),
                deliveryDTO.getDeliveryStatus());
    }
}
