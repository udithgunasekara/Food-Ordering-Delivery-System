package com.delivery.service.deliveryService.Event;

import com.delivery.service.deliveryService.Model.Order;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryResponse {
    private String deliveryId;
    private Order orderDetails;
    private List<InternalDeliveryPersonResponse> DriverDetails;
}
