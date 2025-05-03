package org.restaurantSerivce.admin.Admin_Service.Service.Impl;

import feign.FeignException;
import jakarta.ws.rs.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.restaurantSerivce.admin.Admin_Service.DTO.KafkaMessage.RestaurantStatusNotification;
import org.restaurantSerivce.admin.Admin_Service.DTO.Request.RestaurantRegistrationRequestDTO;
import org.restaurantSerivce.admin.Admin_Service.DTO.Response.InternalUserResponseDTO;
import org.restaurantSerivce.admin.Admin_Service.DTO.Response.RestaurantRequestResponseDTO;
import org.restaurantSerivce.admin.Admin_Service.Exception.ResourceNotFoundException;
import org.restaurantSerivce.admin.Admin_Service.Mapper.RestaurantRegistrationMapper;
import org.restaurantSerivce.admin.Admin_Service.Repository.AdminRepository;
import org.restaurantSerivce.admin.Admin_Service.Service.RestaurantRegistrationService;
import org.restaurantSerivce.admin.Admin_Service.Feign.UserServiceClientInterface;
import org.restaurantSerivce.admin.Admin_Service.Model.Enums.RestaurantStatus;
import org.restaurantSerivce.admin.Admin_Service.Model.RestaurantRegistration;
//import org.restaurantSerivce.admin.Admin_Service.Security.InternalTokenGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class RestaurantRegistrationServiceImpl implements RestaurantRegistrationService {

//    private final InternalTokenGenerator internalTokenGenerator;
    private final UserServiceClientInterface userServiceClient;
    private final AdminRepository adminRepository;
    private final KafkaTemplate<String,RestaurantStatusNotification> kafkaTemplate;
    @Override
    public RestaurantRequestResponseDTO registerRestaurant(RestaurantRegistrationRequestDTO requestDTO) {
        log.info("request recieved with restaurant registration request");
        try {
            ResponseEntity<InternalUserResponseDTO> response = userServiceClient.getUserForInternal(
                    requestDTO.getOwnerEmail()
            );
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                InternalUserResponseDTO user = response.getBody();

                RestaurantRegistration registrationRequest = RestaurantRegistration.builder()
                        .restaurantName(requestDTO.getRestaurantName())
                        .contactEmail(requestDTO.getContactEmail())
                        .contactPhone(requestDTO.getContactPhone())
                        .address(requestDTO.getAddress())
                        .latitude(requestDTO.getLatitude())
                        .longitude(requestDTO.getLongitude())
                        .status(RestaurantStatus.PENDING)
                        .ownerId(user.getId())
                        .ownerFullName(user.getFirstName() + " " + user.getLastName())
                        .ownerEmail(user.getEmail())
                        .ownerContact(user.getPhone())
                        .build();

                 RestaurantRegistration savedRestaurant = adminRepository.save(registrationRequest);

                // Map to your response DTO
                return (RestaurantRegistrationMapper.RestRegistrationToResponseDTO(savedRestaurant));
            } else {
                log.warn("User not found or error from USER-SERVICE for email: {}", requestDTO.getOwnerEmail());
                throw new ResourceNotFoundException("User" , requestDTO.getOwnerEmail());
            }
        } catch (FeignException.NotFound e) {
            log.error("User not found in USER-SERVICE: {}", requestDTO.getOwnerEmail(), e);
            throw new ResourceNotFoundException("User" , requestDTO.getOwnerEmail());
        }  catch (Exception e) {
            log.error("Unexpected error during restaurant registration: {}", e.getMessage(), e);
            throw new RuntimeException("An unexpected error occurred during registration.");
        }
    }

   /* //test method to check if the userdetails can be extracted correctly
    public ResponseEntity<InternalUserResponseDTO> getUserFromUserService(String email){
        String token = generateProxyToken();
        return userServiceClient.getUserForInternal(email,token);
    }*/

/*    private String generateProxyToken() {
        String token = internalTokenGenerator.getInternalToken();
        log.info("Proxy token generated to internal communication");
        return "Bearer " + token;
    }*/

    @Override
    public String deleteRegistrationRequest(String restaurantId) {
        RestaurantRegistration restaurant = findRestaurantOrThrow(restaurantId);
        adminRepository.delete(restaurant);
        return "Successfully deleted restaurant";
    }

    @Override
    public RestaurantRequestResponseDTO getRestaurant(String restaurantId) {
        RestaurantRegistration restaurant = findRestaurantOrThrow(restaurantId);
        return RestaurantRegistrationMapper.RestRegistrationToResponseDTO(restaurant);
    }

    @Override
    public List<RestaurantRequestResponseDTO> getAllRestaurants() {
        return adminRepository.findAll()
                .stream()
                .map(RestaurantRegistrationMapper::RestRegistrationToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantRequestResponseDTO> getAllPendingRestaurants() {
        return getRestaurantsByStatus(RestaurantStatus.PENDING);
    }

    @Override
    public List<RestaurantRequestResponseDTO> getAllCancelledRestaurants() {
        return getRestaurantsByStatus(RestaurantStatus.REJECTED);
    }

    @Override
    public List<RestaurantRequestResponseDTO> getAllAcceptedRestaurants() {
        return getRestaurantsByStatus(RestaurantStatus.APPROVED);
    }

    @Override
    public String updateRestaurantStatus(String restaurantId, String status) {
        RestaurantRegistration restaurant = findRestaurantOrThrow(restaurantId);

        RestaurantStatus newStatus = parseStatusOrThrow(status);
        restaurant.setStatus(newStatus);
        adminRepository.save(restaurant);

        return "Successfully updated restaurant status";
    }

    public String approveRestaurantStatus(String restaurantId) {
        RestaurantRegistration restaurant = findRestaurantOrThrow(restaurantId);
        updateRestaurantStatus(restaurantId, "approved");
        kafkaTemplate.send("registration-status",
                RestaurantStatusNotification.builder()
                    .userId(restaurant.getOwnerId())
                    .restaurantId(restaurantId)
                    .restaurantName(restaurant.getRestaurantName())
                    .message("Your restaurant registration request has been APPROVED.")
                    .time(LocalDateTime.now())
                    .build()
        );
        return "Successfully APPEOVED restaurant status";
    }

    public String rejectRestaurantStatus(String restaurantId) {
        RestaurantRegistration restaurant = findRestaurantOrThrow(restaurantId);
        updateRestaurantStatus(restaurantId, "rejected");
        kafkaTemplate.send("registration-status",
                RestaurantStatusNotification.builder()
                        .userId(restaurant.getOwnerId())
                        .restaurantId(restaurantId)
                        .restaurantName(restaurant.getRestaurantName())
                        .message("Your restaurant registration request has been REJECTED.")
                        .time(LocalDateTime.now())
                        .build()
        );

        return "Successfully REJECTED restaurant status";
    }

    @Override
    public RestaurantRequestResponseDTO getRestauratFromOwnerId(String ownerId) {
        RestaurantRegistration restaurant = findRestauratByOwnerORThrow(ownerId);
        return RestaurantRegistrationMapper.RestRegistrationToResponseDTO(restaurant);
    }

    @Override
    public List<String> getAllRestaurantStatus() {
        return Arrays.stream(RestaurantStatus.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

//    ----------helpers -------------------
    private RestaurantRegistration findRestaurantOrThrow(String restaurantId) {
        return adminRepository.findById(restaurantId)
                .orElseThrow(() -> {
                    log.error("Restaurant not found with id: {}", restaurantId);
                    return new ResourceNotFoundException("Restaurant", "Restaurant id", restaurantId);
                });
    }

    private RestaurantRegistration findRestauratByOwnerORThrow(String ownerid) {
        return adminRepository.findByOwnerId(ownerid)
                .orElseThrow(() -> {
                    log.error("Restaurant not found with owner id: {}", ownerid);
                    return new ResourceNotFoundException("Restaurant", "Ownerid id", ownerid);
                });
    }

    private RestaurantStatus parseStatusOrThrow(String status) {
        try {
            return RestaurantStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Invalid restaurant status provided: {}", status);
            throw new BadRequestException("Invalid status value provided: " + status);
        }
    }

    private List<RestaurantRequestResponseDTO> getRestaurantsByStatus(RestaurantStatus status) {
        return adminRepository.findAllByStatusContaining(status)
                .stream()
                .map(RestaurantRegistrationMapper::RestRegistrationToResponseDTO)
                .collect(Collectors.toList());
    }
}
