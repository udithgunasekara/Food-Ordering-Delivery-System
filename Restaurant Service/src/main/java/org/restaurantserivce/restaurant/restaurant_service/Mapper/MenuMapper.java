package org.restaurantserivce.restaurant.restaurant_service.Mapper;

import org.restaurantserivce.restaurant.restaurant_service.DTO.MenuDTO;
import org.restaurantserivce.restaurant.restaurant_service.Entity.Menu;

public class MenuMapper {

    public static MenuDTO toDTO(Menu menu) {
        return new MenuDTO(
                menu.getId(),
                menu.getRestaurantName(),
                menu.getRestId(),
                menu.getItemCount());
    }


    public static Menu toEntity(MenuDTO dto) {
        return new Menu(
                dto.getId(),
                dto.getRestaurantName(),
                dto.getRestId(),
                dto.getItemCount());
    }



}
