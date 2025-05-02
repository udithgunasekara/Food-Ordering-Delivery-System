package org.restaurantSerivce.admin.Admin_Service.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.restaurantSerivce.admin.Admin_Service.DTO.KafkaMessage.RestaurantStatusNotification;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {
    private final KafkaTemplate<String, RestaurantStatusNotification> kafkaTemplate;
    private static final String TOPIC = "restaurant-status-notification";

    public void sendRestaurantStatusNotification(RestaurantStatusNotification notification){
        kafkaTemplate.send(TOPIC, notification.getUserId(),notification);
    }
}
