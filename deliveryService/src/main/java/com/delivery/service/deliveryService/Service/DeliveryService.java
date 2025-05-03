package com.delivery.service.deliveryService.Service;

import com.delivery.service.deliveryService.DTO.DeliveryDTO;

public interface DeliveryService {
    DeliveryDTO createDelivery(DeliveryDTO deliveryDTO);
    DeliveryDTO getDeliveryById(String deliveryId);
    DeliveryDTO getDeliveryByOrderId(String orderId);
    DeliveryDTO updateDelivery(String deliveryId, DeliveryDTO deliveryDTO);
    void deleteDelivery(String deliveryId);
}
