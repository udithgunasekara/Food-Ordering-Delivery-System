package org.restaurantSerivce.admin.Admin_Service.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantRegistrationRequestDTO {
    private String restaurantName;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String ownerEmail;
}
