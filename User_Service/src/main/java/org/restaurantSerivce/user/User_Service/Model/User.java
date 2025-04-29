package org.restaurantSerivce.user.User_Service.Model;

import lombok.*;
import org.restaurantSerivce.user.User_Service.Model.Enums.RoleType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "user")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class User {
    @Id
    private String id;
    private String username;
    private String passwordHash;


    @Indexed(unique = true)
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zip;
    private String country;
    private String coordinates;
    private List<RoleType> roles;

}
