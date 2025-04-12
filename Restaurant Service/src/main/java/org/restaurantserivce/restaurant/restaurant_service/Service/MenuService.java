package org.restaurantserivce.restaurant.restaurant_service.Service;

import org.restaurantserivce.restaurant.restaurant_service.DTO.MenuDTO;

public interface MenuService {

    MenuDTO createMenu(MenuDTO menuDTO);
    MenuDTO getAllMenus(String restId);
    String deleteById(String menuId);
}
