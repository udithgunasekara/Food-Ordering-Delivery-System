package com.delivery.service.deliveryService.Event;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InternalDeliveryPersonResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String Latitude;
    private String Longitude;
}
