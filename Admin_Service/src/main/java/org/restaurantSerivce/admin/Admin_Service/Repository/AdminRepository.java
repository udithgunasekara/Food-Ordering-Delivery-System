package org.restaurantSerivce.admin.Admin_Service.Repository;

import org.restaurantSerivce.admin.Admin_Service.Model.Enums.RestaurantStatus;
import org.restaurantSerivce.admin.Admin_Service.Model.RestaurantRegistration;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AdminRepository extends MongoRepository<RestaurantRegistration,String> {
    List<RestaurantRegistration> findAllByStatusContaining(RestaurantStatus status);
}
