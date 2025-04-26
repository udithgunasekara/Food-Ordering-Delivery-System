package org.restaurantSerivce.user.User_Service.Model.Principle;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.restaurantSerivce.user.User_Service.Model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class UserPrinciple implements UserDetails {
    private final String id;
    private final String username;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrinciple(String id, String username, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserPrinciple create(User user) {
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.name())) // no "ROLE_" prefix added!
                .toList();

        return new UserPrinciple(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPasswordHash(),
                authorities
        );
    }

    public String getUsername(){
        return email;
    }
}
