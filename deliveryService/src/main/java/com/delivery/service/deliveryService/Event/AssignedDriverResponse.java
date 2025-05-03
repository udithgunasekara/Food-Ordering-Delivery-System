package com.delivery.service.deliveryService.Event;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignedDriverResponse {
    private String id;
    private String customerId;
    private String deliveryId;
}
