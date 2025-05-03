package com.delivery.service.deliveryService.Mapper;

import com.delivery.service.deliveryService.Event.OrderResponse;
import com.delivery.service.deliveryService.Model.Order;

public class OrderMapper {
    public static Order mapOrderResponseToOrder(OrderResponse orderResponse){
        return new Order(
                orderResponse.getId(),
                orderResponse.getCustomerId(),
                orderResponse.getRestaurantId(),
                orderResponse.getItems(),
                orderResponse.getTotalPrice(),
                orderResponse.getPaymentStatus(),
                orderResponse.getOrderStatus(),
                orderResponse.getPlaceAt(),
                orderResponse.getUpdatedAt()
        );
    }
}
