package org.restaurantserivce.restaurant.restaurant_service.Service.ServiceImpl;

import org.restaurantserivce.restaurant.restaurant_service.Entity.Restaurant;
import org.restaurantserivce.restaurant.restaurant_service.Repo.MenuRepo;
import org.restaurantserivce.restaurant.restaurant_service.Repo.RestaurantRepo;
import org.restaurantserivce.restaurant.restaurant_service.Service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RestaurantServiceImpl implements RestaurantService {

    @Autowired
    private RestaurantRepo restaurantRepo;


    @Override
    public boolean setAvailbality(String status) {
        boolean reststatus = false;

        if(status.equals("ON")){
            reststatus = true;
        }else if(status.equals("OFF")) {
            reststatus = false;
        }
        return restaurantRepo.updateStatus(reststatus);
    }
}
