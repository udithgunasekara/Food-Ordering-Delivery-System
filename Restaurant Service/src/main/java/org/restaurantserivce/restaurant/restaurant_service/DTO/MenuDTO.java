package org.restaurantserivce.restaurant.restaurant_service.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuDTO {
    private String id;
    private String restaurantName;
    private String restId;
    private int itemCount;
}
