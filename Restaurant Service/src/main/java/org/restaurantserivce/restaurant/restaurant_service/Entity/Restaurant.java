package org.restaurantserivce.restaurant.restaurant_service.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Restaurant")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Restaurant {
    private String id;
    private String restaurantName;
    private String restId;
    private boolean status;
}
