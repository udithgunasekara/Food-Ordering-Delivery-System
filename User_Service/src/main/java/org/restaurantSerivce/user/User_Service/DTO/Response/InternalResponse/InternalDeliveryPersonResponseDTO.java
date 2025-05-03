package org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternalDeliveryPersonResponseDTO {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String latitude;
    private String longitude;
}
