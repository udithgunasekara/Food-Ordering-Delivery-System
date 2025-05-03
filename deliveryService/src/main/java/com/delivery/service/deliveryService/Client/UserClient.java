package com.delivery.service.deliveryService.Client;

import com.delivery.service.deliveryService.Event.CustomerResponse;
import com.delivery.service.deliveryService.Event.InternalDeliveryPersonResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {
    @GetMapping("api/users/internal/getuid/{userid}")
    CustomerResponse getUserByIdInternal(@PathVariable("userid") String userid);
    @GetMapping("api/users/internal/delivery")
    List<InternalDeliveryPersonResponse> getAllDeliveryRoles();
}

