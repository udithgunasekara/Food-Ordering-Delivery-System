package org.restaurantSerivce.user.User_Service.Repository;


import org.restaurantSerivce.user.User_Service.Model.Enums.RoleType;
import org.restaurantSerivce.user.User_Service.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    //fine user by email
    User findByEmail(String email);

    //find user by username
    Optional<User> findByUsername(String username);

    //check if user exists by username
    Boolean existsByUsername(String username);

    //check if user exists with email
    Boolean existsByEmail(String email);

    List<User> findByRolesIn(List<RoleType> role);

//    List<User> findByRoles(List<RoleType> roles);
}
