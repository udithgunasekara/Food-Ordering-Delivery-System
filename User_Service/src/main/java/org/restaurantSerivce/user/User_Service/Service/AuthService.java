package org.restaurantSerivce.user.User_Service.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.restaurantSerivce.user.User_Service.DTO.Request.LoginRequestDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.JWTResponseDTO;
import org.restaurantSerivce.user.User_Service.Security.CustomeUserDetailsService;
import org.restaurantSerivce.user.User_Service.Security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public JWTResponseDTO login(LoginRequestDTO loginRequestDTO) {
        try {
            log.info("user login inititated");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword())
            );
            log.info("generating JWT token");
            String token = jwtTokenProvider.generateToken(authentication);
            return new JWTResponseDTO(token);
        }catch (BadCredentialsException e){
            log.error("❌Entered details do not match to create auth");
            return new JWTResponseDTO("❌Entered details do not match to create auth");
        }catch(Exception e){
            log.error(e);
            return new JWTResponseDTO("❌no auth found");
        }
    }

}
