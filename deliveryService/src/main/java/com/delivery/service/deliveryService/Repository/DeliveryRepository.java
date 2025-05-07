package com.delivery.service.deliveryService.Repository;

import com.delivery.service.deliveryService.Model.Delivery;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DeliveryRepository extends MongoRepository<Delivery, String>{
    Delivery findByOrderDetailsId(String orderId);
}
