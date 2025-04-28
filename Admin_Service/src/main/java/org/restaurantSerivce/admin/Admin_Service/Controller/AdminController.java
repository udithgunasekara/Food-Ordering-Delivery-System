package org.restaurantSerivce.admin.Admin_Service.Controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.restaurantSerivce.admin.Admin_Service.DTO.Request.RestaurantRegistrationRequestDTO;
import org.restaurantSerivce.admin.Admin_Service.DTO.Response.RestaurantRequestResponseDTO;
import org.restaurantSerivce.admin.Admin_Service.Service.Impl.RestaurantRegistrationServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final RestaurantRegistrationServiceImpl restaurantRegistrationServiceImpl;


    //test method to get user details
//    @GetMapping("/{userid}")
//    public ResponseEntity<InternalUserResponseDTO> getuser(@PathVariable("userid") String userid) {
//        log.info("get user method invoked with user id : {} " , userid);
//        ResponseEntity<InternalUserResponseDTO> result = restaurantRegistrationServiceImpl.getUserFromUserService(userid);
//        log.info("recieved user details : {} " , result);
//        return result;
//    }

    @PostMapping("/register")
    public ResponseEntity<RestaurantRequestResponseDTO> registerRestaurant(@RequestBody RestaurantRegistrationRequestDTO request){
        return ResponseEntity.ok(restaurantRegistrationServiceImpl.registerRestaurant(request));
    }

    @DeleteMapping("/{restaurantId}")
    public ResponseEntity<String> deleteRestaurant(@PathVariable String restaurantId){
        return ResponseEntity.ok(restaurantRegistrationServiceImpl.deleteRegistrationRequest(restaurantId));
    }

    @GetMapping("/{restId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<RestaurantRequestResponseDTO> getRestaurantFromId(@PathVariable String restId){
        return ResponseEntity.ok(restaurantRegistrationServiceImpl.getRestaurant(restId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<RestaurantRequestResponseDTO>> getAllRestaurant(){
        return ResponseEntity.ok(restaurantRegistrationServiceImpl.getAllRestaurants());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<RestaurantRequestResponseDTO>> getPendingRestaurant(){
        return ResponseEntity.ok(restaurantRegistrationServiceImpl.getAllPendingRestaurants());
    }

    @GetMapping("/canceled")
    public ResponseEntity<List<RestaurantRequestResponseDTO>> getCancelledRestaurant(){
        return ResponseEntity.ok(restaurantRegistrationServiceImpl.getAllCancelledRestaurants());
    }

    @GetMapping("/accepted")
    public ResponseEntity<List<RestaurantRequestResponseDTO>> getAcceptedRestaurant(){
        return ResponseEntity.ok(restaurantRegistrationServiceImpl.getAllAcceptedRestaurants());
    }

    @PutMapping("{restaurantId}/status")
    public ResponseEntity<String> updateRestaurantStatus(
            @PathVariable String restaurantId,
            @RequestParam String status
    ) {
        log.info("update restaurant status to " + status);
        String responseMessage = restaurantRegistrationServiceImpl.updateRestaurantStatus(restaurantId, status);
        return ResponseEntity.ok(responseMessage);
    }

    @GetMapping("/status")
    public ResponseEntity<List<String>> getStatus(){
        return ResponseEntity.ok(restaurantRegistrationServiceImpl.getAllRestaurantStatus());
    }


}
