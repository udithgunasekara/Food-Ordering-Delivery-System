package org.restaurantSerivce.admin.Admin_Service.Mapper;

import org.restaurantSerivce.admin.Admin_Service.DTO.Response.RestaurantRequestResponseDTO;
import org.restaurantSerivce.admin.Admin_Service.Model.RestaurantRegistration;
import org.springframework.stereotype.Component;

@Component
public class RestaurantRegistrationMapper {

    public static RestaurantRequestResponseDTO RestRegistrationToResponseDTO(RestaurantRegistration restaurantReg){
        return RestaurantRequestResponseDTO.builder()
                .id(restaurantReg.getId())
                .restaurantName(restaurantReg.getRestaurantName())
                .contactPhone(restaurantReg.getContactPhone())
                .address(restaurantReg.getAddress())
                .contactEmail(restaurantReg.getContactEmail())
                .ownerFullName(restaurantReg.getOwnerFullName())
                .ownerEmail(restaurantReg.getOwnerEmail())
                .ownerContact(restaurantReg.getOwnerContact())
                .status(restaurantReg.getStatus())
                .requestedAt(restaurantReg.getRequestedAt())
                .modifiedAt(restaurantReg.getModifiedAt())
                .build();
    }
}
