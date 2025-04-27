package org.restaurantserivce.restaurant.restaurant_service.Service;

import org.restaurantserivce.restaurant.restaurant_service.DTO.MenuDTO;

import java.util.List;

public interface MenuService {

    MenuDTO createMenu(MenuDTO menuDTO);
    List<MenuDTO> getAllMenus(String restId);
    void deleteById(String menuId);
    MenuDTO updateMenu(MenuDTO menuDTO);

}
