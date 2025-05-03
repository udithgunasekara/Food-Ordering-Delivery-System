package org.restaurantSerivce.user.User_Service.DTO.Response;

import lombok.*;
import org.restaurantSerivce.user.User_Service.Model.Enums.RoleType;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDTO {
    private String id;
    private String username;
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
    private List<RoleType> roles;
}
