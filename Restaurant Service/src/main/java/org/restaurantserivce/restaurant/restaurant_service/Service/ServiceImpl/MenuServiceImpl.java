package org.restaurantserivce.restaurant.restaurant_service.Service.ServiceImpl;

import org.restaurantserivce.restaurant.restaurant_service.DTO.MenuDTO;
import org.restaurantserivce.restaurant.restaurant_service.Entity.Menu;
import org.restaurantserivce.restaurant.restaurant_service.Mapper.MenuMapper;
import org.restaurantserivce.restaurant.restaurant_service.Repo.MenuRepo;
import org.restaurantserivce.restaurant.restaurant_service.Service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuRepo menuRepo;

    @Override
    public MenuDTO createMenu(MenuDTO menuDTO) {
        Menu menu = MenuMapper.toEntity(menuDTO);
        return MenuMapper.toDTO(menuRepo.save(menu));
    }

    @Override
    public MenuDTO getAllMenus(String restId) {

        menuRepo.findByRestId(restId);




        return null;
    }

    @Override
    public String deleteById(String menuId) {
      //  menuRepo.findById(menuId);
        return "";
    }
}
