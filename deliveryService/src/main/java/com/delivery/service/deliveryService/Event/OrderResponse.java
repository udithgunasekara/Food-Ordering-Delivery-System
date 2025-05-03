package com.delivery.service.deliveryService.Event;

import com.delivery.service.deliveryService.Model.Item;
import com.delivery.service.deliveryService.Model.Enums.OrderStatus;
import com.delivery.service.deliveryService.Model.Enums.PaymentStatus;
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
