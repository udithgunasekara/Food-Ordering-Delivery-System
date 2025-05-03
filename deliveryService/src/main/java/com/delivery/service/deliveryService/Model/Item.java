package com.delivery.service.deliveryService.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Item {
    private String itemId;
    private String name;
    private double price;
    private int quantity;
    private double totalPrice;
}
