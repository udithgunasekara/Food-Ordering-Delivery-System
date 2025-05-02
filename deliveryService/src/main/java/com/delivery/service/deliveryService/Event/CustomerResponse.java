package com.delivery.service.deliveryService.Event;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String Latitude;
    private String Longitude;
}
