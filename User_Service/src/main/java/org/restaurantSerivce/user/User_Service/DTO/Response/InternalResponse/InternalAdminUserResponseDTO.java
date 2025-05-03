package org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse;

import lombok.*;
import org.restaurantSerivce.user.User_Service.Model.Enums.RoleType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.List;

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
    private String address;
    private String city;
    private String state;
    private String zip;
    private String country;
    private String latitude;
    private String longitude;
}
