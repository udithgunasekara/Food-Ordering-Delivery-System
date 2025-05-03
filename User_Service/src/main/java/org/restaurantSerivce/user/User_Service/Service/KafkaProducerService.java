package org.restaurantSerivce.user.User_Service.Service;

import lombok.RequiredArgsConstructor;
import org.restaurantSerivce.user.User_Service.DTO.KafkaMessage.DeliveryPersonAddedNotification;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {
    private final KafkaTemplate<String, DeliveryPersonAddedNotification> kafkaTemplate;
    private static final String TOPIC = "delivery_person_added";

    public void setDeliveryPersonAddedMessage(DeliveryPersonAddedNotification object){
        kafkaTemplate.send(TOPIC, object.getId(),object);
    }
}
