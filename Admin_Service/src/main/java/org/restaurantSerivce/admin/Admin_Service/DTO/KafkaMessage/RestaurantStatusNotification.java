package org.restaurantSerivce.admin.Admin_Service.DTO.KafkaMessage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RestaurantStatusNotification {
    private String userId;
    private String restaurantId;
    private String restaurantName;
    private String message;
    private LocalDateTime time;
}
