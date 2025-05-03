package org.restaurantserivce.restaurant.restaurant_service.Controller;

import lombok.AllArgsConstructor;
import org.restaurantserivce.restaurant.restaurant_service.DTO.MenuDTO;
import org.restaurantserivce.restaurant.restaurant_service.Service.MenuService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "menu")
@AllArgsConstructor
public class MenuController {

    private MenuService menuService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MenuDTO createMenu(@RequestBody MenuDTO menuDTO) {
        return menuService.createMenu(menuDTO);
    }

    //create get all things
    @GetMapping
    @ResponseStatus(HttpStatus.FOUND)
    public List<MenuDTO> getAllMenus() {
        return menuService.getAllMenus();
    }


    // we will give the restaurant id and that will return all menus
    @GetMapping("/{restId}") // Uses PATH VARIABLE
    @ResponseStatus(HttpStatus.FOUND)
    public List<MenuDTO> getAllMenus(@PathVariable String restId) { // Changed to @PathVariable
        return menuService.getAllMenus(restId);
    }
    //we just need to rest id and menu id for deletion
    @DeleteMapping("/{menuId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void deleteMenu(@PathVariable String menuId) {
        menuService.deleteById(menuId);
    }

    //update
    @PutMapping()
    @ResponseStatus(HttpStatus.ACCEPTED)
    public MenuDTO updateMenu(@RequestBody MenuDTO menuDTO) {
        return menuService.updateMenu(menuDTO);
    }


}
