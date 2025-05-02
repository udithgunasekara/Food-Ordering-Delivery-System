package org.restaurantSerivce.user.User_Service.DTO.KafkaMessage;

import lombok.*;
import org.restaurantSerivce.user.User_Service.Model.Enums.RoleType;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeliveryPersonAddedNotification {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String coordinates;
}
