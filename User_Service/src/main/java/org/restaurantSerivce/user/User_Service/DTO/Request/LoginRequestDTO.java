package org.restaurantSerivce.user.User_Service.DTO.Request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginRequestDTO {
    private String username;
    private String password;
}
