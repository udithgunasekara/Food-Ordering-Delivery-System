package com.order.service.orderService.Event;

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
