package org.restaurantserivce.restaurant.restaurant_service.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItems {
    private String name;
    private double price;

}
