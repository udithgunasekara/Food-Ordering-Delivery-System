package org.restaurantserivce.restaurant.restaurant_service.Service.ServiceImpl;

import org.restaurantserivce.restaurant.restaurant_service.DTO.MenuDTO;
import org.restaurantserivce.restaurant.restaurant_service.Entity.Menu;
import org.restaurantserivce.restaurant.restaurant_service.Mapper.MenuMapper;
import org.restaurantserivce.restaurant.restaurant_service.Repo.MenuRepo;
import org.restaurantserivce.restaurant.restaurant_service.Service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
    public List<MenuDTO> getAllMenus(String restId) {

        //we use simple for loop and arraylist
        List<Menu> menus = menuRepo.findByRestId(restId);
        List<MenuDTO> menuDTOS = new ArrayList<>();

        if(menus.isEmpty()){
            throw new RuntimeException("menu Id is not found");
        }else {
            //create for loop
            for (Menu menu : menus) {
                menuDTOS.add(MenuMapper.toDTO(menu));
            }
            return menuDTOS;
        }

    }


    @Override
    public void deleteById(String menuId) {
        //create simple delete opt
        //need to find rest menu list and filter needed menu and do the deletion
        //but no need that just find the give menuId and do the deletion
        boolean exists = menuRepo.existsById(menuId);
        if(!exists){
            throw new IllegalArgumentException("Menu with ID " + menuId + " not found.");
        }

        menuRepo.deleteMenuById(menuId);

    }

    @Override
    public MenuDTO updateMenu(MenuDTO menuDTO) {
        //updates doing

        //check exists
        //introduction of the new varible
        Menu menu;
        menu = MenuMapper.toEntity(menuDTO);

        boolean exists = menuRepo.existsById(menu.getRestId());
        if(!exists){
            throw new RuntimeException("Invalid update");
        }
        menu = menuRepo.save(menu);
        return MenuMapper.toDTO(menu);

    }

    @Override
    public List<MenuDTO> getAllMenus() {
        //get all menus
        //create simple for loop
        //create array list
        List<Menu> menus = menuRepo.findAll();
        List<MenuDTO> menuDTOS = new ArrayList<>();
        if(menus.isEmpty()){
            throw new RuntimeException("menu Id is not found");
        }else {
            //create for loop
            for (Menu menu : menus) {
                menuDTOS.add(MenuMapper.toDTO(menu));
            }
            return menuDTOS;
        }
    }


}
