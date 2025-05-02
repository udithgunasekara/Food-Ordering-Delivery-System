package com.delivery.service.deliveryService.Client;

import com.delivery.service.deliveryService.Event.RestaurantResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "restaurant-service",  url = "http://localhost:8082/api/restaurants")
public interface RestaurantClient {
    @GetMapping("/{id}")
    RestaurantResponse getRestaurantCoordinates(@PathVariable("id") String restaurantId);
}
