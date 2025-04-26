package org.restaurantserivce.restaurant.restaurant_service.Entity;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "menu")
@AllArgsConstructor
@Data
@NoArgsConstructor
public class Menu {
    @Id
    private String id;
    private String restaurantName;
    private String restId;
    private List<MenuItems> items;
    private int itemCount;
}
