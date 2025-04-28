package org.restaurantSerivce.admin.Admin_Service.Security;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.restaurantSerivce.admin.Admin_Service.Model.Principle.UserPrinciple;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@Component
@Getter
@RequiredArgsConstructor
public class InternalTokenGenerator {

    private final JwtTokenProvider jwtTokenProvider;

    private String internalToken;

    @PostConstruct
    public void init() {
        this.internalToken = generateInternalServiceToken();
    }

    private String generateInternalServiceToken() {
        //TODO : CHANGE THIS ROLE TO SOMETHING UNIQUE
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("INTERNAL"));
        UserPrinciple internalUser = new UserPrinciple("internal-service", "internal", "internal@system", "", authorities);
        Authentication auth = new UsernamePasswordAuthenticationToken(internalUser,null,null);
        return jwtTokenProvider.generateToken(auth);
    }
}
