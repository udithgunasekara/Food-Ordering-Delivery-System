package com.delivery.service.deliveryService.Controller;

import com.delivery.service.deliveryService.DTO.DeliveryDTO;
import com.delivery.service.deliveryService.Service.DeliveryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final DeliveryService deliveryService;

    // Endpoint to create a new delivery
    @PostMapping
    public ResponseEntity<DeliveryDTO> createDelivery(@RequestBody DeliveryDTO deliveryDTO) {
        DeliveryDTO createdDelivery = deliveryService.createDelivery(deliveryDTO);
        return new ResponseEntity<>(createdDelivery, HttpStatus.CREATED);
    }

    // Endpoint to get a delivery by ID
    @GetMapping("/get/{deliveryId}")
    public ResponseEntity<DeliveryDTO> getDeliveryById(@PathVariable("deliveryId") String deliveryId) {
        DeliveryDTO delivery = deliveryService.getDeliveryById(deliveryId);
        return ResponseEntity.ok(delivery);
    }

    // Endpoint to update a delivery by ID
    @PutMapping("/update/{deliveryId}")
    public ResponseEntity<DeliveryDTO> updateDelivery(@PathVariable("deliveryId") String deliveryId,
                                                      @RequestBody DeliveryDTO deliveryDTO) {
        DeliveryDTO updatedDelivery = deliveryService.updateDelivery(deliveryId, deliveryDTO);
        return ResponseEntity.ok(updatedDelivery);
    }

    // Endpoint to delete a delivery by ID
    @DeleteMapping("/delete/{deliveryId}")
    public ResponseEntity<String> deleteDelivery(@PathVariable("deliveryId") String deliveryId) {
        deliveryService.deleteDelivery(deliveryId);
        return ResponseEntity.ok("Deleted delivery!");
    }
}
