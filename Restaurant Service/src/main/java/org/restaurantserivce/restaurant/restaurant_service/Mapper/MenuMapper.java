package org.restaurantserivce.restaurant.restaurant_service.Mapper;

import org.restaurantserivce.restaurant.restaurant_service.DTO.MenuDTO;
import org.restaurantserivce.restaurant.restaurant_service.DTO.MenuItemDTO;
import org.restaurantserivce.restaurant.restaurant_service.Entity.Menu;
import org.restaurantserivce.restaurant.restaurant_service.Entity.MenuItems;

import java.util.ArrayList;
import java.util.List;

public class MenuMapper {

    public static MenuDTO toDTO(Menu menu) {
      List<MenuItemDTO> itemsDTOs = new ArrayList<>();
      for(MenuItems items: menu.getItems()){
          itemsDTOs.add(new MenuItemDTO(items.getName(), items.getPrice()));
      }
        return new MenuDTO(
                menu.getId(),
                menu.getRestaurantName(),
                menu.getRestId(),
                itemsDTOs,
                menu.getItemCount());
    }


    public static Menu toEntity(MenuDTO dto) {
        List<MenuItems> items = new ArrayList<>();
        for(MenuItemDTO dtoItems: dto.getItems()){
            items.add(new MenuItems(dtoItems.getName(), dtoItems.getPrice()));
        }


        return new Menu(
                dto.getId(),
                dto.getRestaurantName(),
                dto.getRestId(),
                items,
                dto.getItemCount());
    }



}
