package com.order.service.orderService.Mapper;

import com.order.service.orderService.DTO.OrderDTO;
import com.order.service.orderService.model.Order;

public class OrderMapper {

    // This class is responsible for mapping between Order and OrderDTO objects.
    public static OrderDTO mapToOrderDTO(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getCustomerId(),
                order.getRestaurantId(),
                order.getItems(),
                order.getTotalPrice(),
                order.getPaymentStatus(),
                order.getOrderStatus(),
                order.getPlaceAt(),
                order.getUpdatedAt()
        );
    }

    // This method maps an OrderDTO object to an Order object.
    public static Order mapToOrder(OrderDTO orderDTO) {
        return new Order(
                orderDTO.getId(),
                orderDTO.getCustomerId(),
                orderDTO.getRestaurantId(),
                orderDTO.getItems(),
                orderDTO.getTotalPrice(),
                orderDTO.getPaymentStatus(),
                orderDTO.getOrderStatus(),
                orderDTO.getPlaceAt(),
                orderDTO.getUpdatedAt()
        );
    }
}
