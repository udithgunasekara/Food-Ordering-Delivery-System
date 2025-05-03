package com.delivery.service.deliveryService.Event;

import com.delivery.service.deliveryService.Model.Enums.RestaurantStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantResponse {
    private String id;
    private String restaurantName;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String ownerEmail;
    private String ownerFullName;
    private String ownerContact;
    private String latitude;
    private String longitude;
    private RestaurantStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime modifiedAt;
}
