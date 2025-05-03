package com.order.service.orderService.DTO;

import com.order.service.orderService.model.Item;
import com.order.service.orderService.model.Enums.OrderStatus;
import com.order.service.orderService.model.Enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private String id;
    private String customerId;
    private String restaurantId;
    private List<Item> items;
    private double totalPrice;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private Date placeAt;
    private Date updatedAt;
}
