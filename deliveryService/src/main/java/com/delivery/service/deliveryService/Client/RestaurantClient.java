package com.delivery.service.deliveryService.Client;

import com.delivery.service.deliveryService.Event.RestaurantResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ADMIN-SERVICE")
public interface RestaurantClient {
    @GetMapping("/api/admin/internal/{id}")
    RestaurantResponse getInternalRestaurant(@PathVariable("id") String id);
}
