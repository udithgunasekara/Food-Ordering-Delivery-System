package com.delivery.service.deliveryService.Repository;

import com.delivery.service.deliveryService.Model.Delivery;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DeliveryRepository extends MongoRepository<Delivery, String>{
}
