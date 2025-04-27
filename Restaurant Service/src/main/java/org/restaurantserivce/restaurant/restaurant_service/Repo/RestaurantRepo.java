package org.restaurantserivce.restaurant.restaurant_service.Repo;

import org.restaurantserivce.restaurant.restaurant_service.Entity.Menu;
import org.restaurantserivce.restaurant.restaurant_service.Entity.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RestaurantRepo extends MongoRepository<Restaurant, Integer> {
    boolean updateStatus(boolean status);
}
