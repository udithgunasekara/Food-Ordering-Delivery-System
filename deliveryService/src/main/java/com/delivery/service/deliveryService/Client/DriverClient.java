package com.delivery.service.deliveryService.Client;

import com.delivery.service.deliveryService.Event.InternalDeliveryPersonResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "user-service", url = "http://localhost:8082/api/users")
public interface DriverClient {

    @GetMapping("/internal/delivery")
    List<InternalDeliveryPersonResponse> getAllDeliveryRoles();
}