package com.delivery.service.deliveryService.Client;

import com.delivery.service.deliveryService.Event.CustomerResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service",  url = "http://localhost:8082/api/users")
public interface CustomerClient {
    @GetMapping("/{id}")
    CustomerResponse getCustomerCoordinates(@PathVariable("id") String customerId);
}

