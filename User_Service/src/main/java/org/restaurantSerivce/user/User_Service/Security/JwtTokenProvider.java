package org.restaurantSerivce.user.User_Service.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.restaurantSerivce.user.User_Service.Model.Principle.UserPrinciple;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
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

    public Date extractExpirationDateFromToken(String token){
        log.info("⚠️received a token and extracting expiration date from the token");
        return getSpecificClaimFromToken(token, Claims::getExpiration);
    }

    public boolean isTokenExpired(String token){
        log.info("⚠️checking if token is expired");
        return extractExpirationDateFromToken(token).before(new Date());
    }

    public boolean checkTokenValidity(String token, UserDetails userdetails){
        log.info("⚠️checking if token is valid for token '{}' with user : {} ", token, userdetails.getUsername());
        final String username = getUsernameFromToken(token);
        return (username.equals(userdetails.getUsername()) && !isTokenExpired(token));
    }
}
