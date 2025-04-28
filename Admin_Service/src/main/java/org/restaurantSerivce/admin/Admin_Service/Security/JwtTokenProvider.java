package org.restaurantSerivce.admin.Admin_Service.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.restaurantSerivce.admin.Admin_Service.Model.Principle.UserPrinciple;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Log4j2
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

   private Key getSignInKey(){
       return Keys.hmacShaKeyFor(jwtSecret.getBytes());
   }


    public String generateToken(Authentication authentication){
        System.out.println("🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑" + authentication);
        log.info("⚠️token generator initiated");
        String email = ((UserPrinciple) authentication.getPrincipal()).getEmail();
        Date now = new Date();
        Date tokenExpiration = new Date (now.getTime() + jwtExpirationMs);
        log.info("token generated for user : {} " , email);
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(tokenExpiration)
                .signWith(getSignInKey())
                .compact();
    }



    public Claims extractAllClaimsFromToken(String token){
        log.info("⚠️received a token and extracting all claims from the token");
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //this takes 2 arguments
    // 1. string token
    // 2. a function which takes Claims type object as input and return
    public <T> T getSpecificClaimFromToken(String token, Function<Claims,T> claimsResolverFunction){
        final Claims claims = extractAllClaimsFromToken(token);
        return claimsResolverFunction.apply(claims);
    }

    public String getUsernameFromToken(String token){
        log.info("⚠️received a token and getting the username from the token");
        String extractedUsername =  getSpecificClaimFromToken(token, Claims::getSubject);
        log.info("⚠️⚠️extracted username : {}", extractedUsername);
        return extractedUsername;
    }

    public List<String> extractRolesFromToken(String token){
        Claims claims  = extractAllClaimsFromToken(token);
        Object roles = claims.get("roles");
        if (roles instanceof List<?> roleList){
            return roleList.stream().map(Object::toString).toList();
        }
        return List.of();
    }

    public Date extractExpirationDateFromToken(String token){
        log.info("⚠️received a token and extracting expiration date from the token");
        return getSpecificClaimFromToken(token, Claims::getExpiration);
    }

    public boolean isTokenExpired(String token){
        log.info("⚠️checking if token is expired");
        return extractExpirationDateFromToken(token).before(new Date());
    }

//    public boolean checkTokenValidity(String token){
//        log.info("token validation invoked for token : {}", token);
//        try {
//            Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }
    public boolean checkTokenValidity(String token) {
        try {
            Claims claims = extractAllClaimsFromToken(token);
            log.info("recieved token : {}", claims);
            Date expiration = claims.getExpiration();
            System.out.println("expiration : " + expiration);
            if(expiration.before(new Date())){
                log.info("⚠️⚠️⚠️token is expired");
                return false;
            } else{
                log.info("⚠️⚠️⚠️⚠️token is valid");
                return true;
            }
        } catch (Exception ex) {
            log.error("some exception occured while validating the token : "+ex.getMessage());
            return false;
        }
    }
}
