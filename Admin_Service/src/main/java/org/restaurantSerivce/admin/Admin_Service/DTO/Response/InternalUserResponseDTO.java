package org.restaurantSerivce.admin.Admin_Service.DTO.Response;

import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InternalUserResponseDTO {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zip;
    private String country;
    private String latitude;
    private String longitude;
}
