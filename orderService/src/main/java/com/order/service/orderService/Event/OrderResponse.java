package com.order.service.orderService.Event;

import com.order.service.orderService.model.Item;
import com.order.service.orderService.model.Enums.OrderStatus;
import com.order.service.orderService.model.Enums.PaymentStatus;
import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
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
