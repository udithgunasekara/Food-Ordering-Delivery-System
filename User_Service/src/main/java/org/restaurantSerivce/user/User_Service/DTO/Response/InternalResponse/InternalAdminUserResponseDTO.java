package org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternalAdminUserResponseDTO {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
}
