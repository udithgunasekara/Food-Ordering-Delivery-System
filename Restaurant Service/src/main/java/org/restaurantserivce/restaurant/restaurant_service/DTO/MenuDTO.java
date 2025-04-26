package org.restaurantserivce.restaurant.restaurant_service.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.restaurantserivce.restaurant.restaurant_service.Entity.MenuItems;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuDTO {
    private String id;
    private String restaurantName;
    private String restId;
    private List<MenuItemDTO> items;
    private int itemCount;
}
