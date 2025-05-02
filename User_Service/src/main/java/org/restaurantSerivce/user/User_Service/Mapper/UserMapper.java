package org.restaurantSerivce.user.User_Service.Mapper;

import org.restaurantSerivce.user.User_Service.DTO.Request.UserRequestDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse.InternalAdminUserResponseDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse.InternalDeliveryPersonResponseDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.UserResponseDTO;
import org.restaurantSerivce.user.User_Service.Model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public static User userRequestDtoToUser(UserRequestDTO requestDTO){
        return User.builder()
                .username(requestDTO.getUsername())
                .passwordHash(requestDTO.getPassword())
                .email(requestDTO.getEmail())
                .firstName(requestDTO.getFirstName())
                .lastName(requestDTO.getLastName())
                .phone(requestDTO.getPhone())
                .address(requestDTO.getAddress())
                .city(requestDTO.getCity())
                .state(requestDTO.getState())
                .zip(requestDTO.getZip())
                .country(requestDTO.getCountry())
                .latitude(requestDTO.getLatitude())
                .longitude(requestDTO.getLongitude())
                .build();
    }


    public static UserResponseDTO userToUserResponseDTO(User user){
        return UserResponseDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .zip(user.getZip())
                .country(user.getCountry())
                .roles(user.getRoles())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .build();
    }

    public static InternalAdminUserResponseDTO userToInternalUserDTO(User user){
        return InternalAdminUserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .build();
    }

    public static InternalDeliveryPersonResponseDTO userToInternalDeliveryPersonDTO(User user){
        return InternalDeliveryPersonResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .build();
    }
}