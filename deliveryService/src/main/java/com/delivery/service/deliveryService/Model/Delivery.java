package com.delivery.service.deliveryService.Model;

import com.delivery.service.deliveryService.Model.Enums.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "delivery")
public class Delivery {
    @Id
    private String deliveryId;
    private Order orderDetails;
    private String deliveryPersonId;
    private String customerLongitude;
    private String customerLatitude;
    private String restaurantLongitude;
    private String restaurantLatitude;
    private String deliveryPersonLongitude;
    private String deliveryPersonLatitude;
    private DeliveryStatus deliveryStatus;
}
