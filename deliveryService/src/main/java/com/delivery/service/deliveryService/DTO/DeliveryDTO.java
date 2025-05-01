package com.delivery.service.deliveryService.DTO;

import com.delivery.service.deliveryService.Model.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDTO {
    private String deliveryId;
    private String orderId;
    private String customerId;
    private String restaurantId;
    private String deliveryPersonId;
    private String customerLongitude;
    private String customerLatitude;
    private String restaurantLongitude;
    private String restaurantLatitude;
    private String deliveryPersonLongitude;
    private String deliveryPersonLatitude;
    private DeliveryStatus deliveryStatus;


}