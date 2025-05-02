package com.order.service.orderService.Service;

import com.order.service.orderService.DTO.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);

    OrderDTO getOrderById(String orderId);

    OrderDTO updateOrder(String orderId, OrderDTO orderDTO);

    void deleteOrder(String orderId);

    List<OrderDTO> getOrdersByCustomerId(String customerId);
}
