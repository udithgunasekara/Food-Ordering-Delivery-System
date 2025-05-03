package org.restaurantSerivce.admin.Admin_Service.Service;

import org.restaurantSerivce.admin.Admin_Service.DTO.Request.RestaurantRegistrationRequestDTO;
import org.restaurantSerivce.admin.Admin_Service.DTO.Response.RestaurantRequestResponseDTO;
import org.restaurantSerivce.admin.Admin_Service.Model.Enums.RestaurantStatus;
import org.restaurantSerivce.admin.Admin_Service.Model.RestaurantRegistration;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public interface RestaurantRegistrationService {
    public RestaurantRequestResponseDTO registerRestaurant(RestaurantRegistrationRequestDTO restaurantRegistrationRequestDTO);
    public String deleteRegistrationRequest(String restaurantId);
    public RestaurantRequestResponseDTO getRestaurant(String restaurantId);
    public  List<RestaurantRequestResponseDTO> getAllRestaurants();
    public List<RestaurantRequestResponseDTO> getAllPendingRestaurants();
    public List<RestaurantRequestResponseDTO> getAllCancelledRestaurants();
    public List<RestaurantRequestResponseDTO> getAllAcceptedRestaurants();
    public String updateRestaurantStatus(String restaurantId, String status);
    public List<String> getAllRestaurantStatus();
    public String approveRestaurantStatus(String restaurantId);
    public String rejectRestaurantStatus(String restaurantId);
    public RestaurantRequestResponseDTO getRestauratFromOwnerId(String ownerId);
}
