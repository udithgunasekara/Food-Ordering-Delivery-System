package org.restaurantSerivce.user.User_Service.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Log4j2
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomeUserDetailsService customeUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        if (path.startsWith("/api/users/auth/register") || path.startsWith("/api/users/auth/login")) {
            filterChain.doFilter(request, response);
            log.info("auth request recieved, skipping authentication");
            return;
        }

        String token = extractTokenFromRequest(request);

        if(token != null && SecurityContextHolder.getContext().getAuthentication() == null ){

            final String username = jwtTokenProvider.getUsernameFromToken(token);
            if(username != null){
                UserDetails userDetails = customeUserDetailsService.loadUserByUsername(username);

                if(jwtTokenProvider.checkTokenValidity(token,userDetails)){
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("⚠️ Successfully authenticated user: {} " , username);
                }else{
                    log.warn("🛑🛑Authentication failed for user : {} " , username);
                }
            }else{
                log.warn("🛑🛑 Username could not be extracted from token");
            }
        } else if (token == null) {
            log.info("🛑 No JWT token found in the request ");
        }

        filterChain.doFilter(request, response);
    }



    private String extractTokenFromRequest(HttpServletRequest request){
        log.info("⚠️ extracting token from request : {} " , request);
        String header = request.getHeader("Authorization");
        if(header != null && header.startsWith("Bearer ")){
            log.info("⚠️found request header and extracting token");
            return header.substring(7);
        }else{
            log.info("🛑 no authorization header found");
            return null;
        }
    }
}
