package org.restaurantSerivce.user.User_Service.Security;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.restaurantSerivce.user.User_Service.Exceptions.ResourceNotFoundException;
import org.restaurantSerivce.user.User_Service.Model.Enums.RoleType;
import org.restaurantSerivce.user.User_Service.Model.Principle.UserPrinciple;
import org.restaurantSerivce.user.User_Service.Model.User;
import org.restaurantSerivce.user.User_Service.Repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.Set;

@Log4j2
@Service
@RequiredArgsConstructor
public class CustomeUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("load user by email method inititated with useremail : {} ", email);
        User user = userRepository.findByEmail(email);
        log.info("load user by email method completed with user : {} ", user.getEmail());
        return UserPrinciple.create(user);



    }
}


//        String[] roles = user.getRoles().stream().map(RoleType::name).toArray(String[]::new);

//        uncomment if existing become too complex
//        return org.springframework.security.core.userdetails.User.builder()
//                .username(user.getUsername())
//                .password(user.getPasswordHash())
//                .authorities(roles)
//                .build();
//