package com.order.service.orderService.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
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
