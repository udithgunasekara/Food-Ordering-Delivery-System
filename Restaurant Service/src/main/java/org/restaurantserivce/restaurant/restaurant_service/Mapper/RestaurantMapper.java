package org.restaurantserivce.restaurant.restaurant_service.Mapper;

import org.restaurantserivce.restaurant.restaurant_service.DTO.MenuDTO;
import org.restaurantserivce.restaurant.restaurant_service.DTO.RestaurantDTO;
import org.restaurantserivce.restaurant.restaurant_service.Entity.Restaurant;

public class RestaurantMapper {
    public static Restaurant toEntity(RestaurantDTO dto){
        return new Restaurant(
                dto.getId(),
                dto.getRestaurantName(),
                dto.getRestId(),
                dto.isStatus()
        );
    }

    public static Restaurant toDTO(Restaurant dto){
        return new Restaurant(
                dto.getId(),
                dto.getRestaurantName(),
                dto.getRestId(),
                dto.isStatus()
        );
    }
}
