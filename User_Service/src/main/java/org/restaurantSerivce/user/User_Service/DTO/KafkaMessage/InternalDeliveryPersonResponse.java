package org.restaurantSerivce.user.User_Service.DTO.KafkaMessage;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternalDeliveryPersonResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String latitude;
    private String longitude;
}
