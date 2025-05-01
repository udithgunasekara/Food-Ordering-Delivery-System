package com.delivery.service.deliveryService.Event;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderEvent {
    private String orderId;
    private String customerId;
    private String restaurantId;
}
