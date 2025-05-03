package com.order.service.orderService.Controller;

import com.order.service.orderService.DTO.OrderDTO;
import com.order.service.orderService.Service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;

    // Endpoint to create a new order
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        OrderDTO createdOrder = orderService.createOrder(orderDTO);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    // Endpoint to get an order by ID
    @GetMapping("/get/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable("orderId") String orderId) {
        OrderDTO order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    // Endpoint to update an order by ID
    @PutMapping("/update/{orderId}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable("orderId") String orderId,
                                                @RequestBody OrderDTO orderDTO) {
        OrderDTO updatedOrder = orderService.updateOrder(orderId, orderDTO);
        return ResponseEntity.ok(updatedOrder);
    }

    // Endpoint to delete an order by ID
    @DeleteMapping("/delete/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable("orderId") String orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok("Deleted order!");
    }

    // Endpoint to get all orders by customer ID
    @GetMapping("/getAll/{customerId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByCustomerId(@PathVariable("customerId") String customerId) {
        List<OrderDTO> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }

    // Endpoint to get all orders by restaurant ID
    @GetMapping("/getAll/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByRestaurantId(@PathVariable("restaurantId") String restaurantId) {
        List<OrderDTO> orders = orderService.getOrdersByResturantId(restaurantId);
        return ResponseEntity.ok(orders);
    }
}
