package org.restaurantserivce.restaurant.restaurant_service.Entity;


import jakarta.annotation.Generated;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "menu")
@AllArgsConstructor
@Data
@NoArgsConstructor
public class Menu {
    @Id
    private String Id;
    private String restaurantName;
    private String restId;
    private int itemCount;
}
