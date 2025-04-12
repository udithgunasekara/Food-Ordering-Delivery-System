package org.restaurantserivce.restaurant.restaurant_service.Repo;

import org.restaurantserivce.restaurant.restaurant_service.Entity.Menu;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepo extends MongoRepository<Menu, Integer> {


    List<Menu> findByRestId(String restId);
}
