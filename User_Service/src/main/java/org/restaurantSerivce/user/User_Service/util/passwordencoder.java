package org.restaurantSerivce.user.User_Service.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class passwordencoder {
    public static void main(String[] args) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();


    }
}