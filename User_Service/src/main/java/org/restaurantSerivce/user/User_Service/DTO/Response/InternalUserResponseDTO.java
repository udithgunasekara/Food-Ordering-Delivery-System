package org.restaurantSerivce.user.User_Service.DTO.Response;

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
public class InternalUserResponseDTO {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
}
