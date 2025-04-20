package org.restaurantSerivce.user.User_Service.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.restaurantSerivce.user.User_Service.DTO.Request.LoginRequestDTO;
import org.restaurantSerivce.user.User_Service.DTO.Request.UserRequestDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.JWTResponseDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.UserResponseDTO;
import org.restaurantSerivce.user.User_Service.Model.Principle.UserPrinciple;
import org.restaurantSerivce.user.User_Service.Service.AuthService;
import org.restaurantSerivce.user.User_Service.Service.base.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;
    private final AuthService authService;


    // ----------------- Auth ------------------

    @PostMapping("/auth/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRequestDTO request) {
        return ResponseEntity.ok(userService.registerUser(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<JWTResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(authService.login(loginRequestDTO));
    }

    // ----------------- User Management ------------------

    @PutMapping("/{userid}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable String userid, @RequestBody UserRequestDTO request, @AuthenticationPrincipal UserPrinciple principal) {
        if(!principal.getId().equals(userid) && !principal.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_SYSADMIN"))) {
            log.warn("User with id {} not authorized to update user {}",principal.getId(),userid);
            throw new AccessDeniedException("You do not have permission to update another users info");
        }
        return ResponseEntity.ok(userService.updateUser(userid, request));
    }

    @DeleteMapping("/{userid}")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable String userid) {
        return ResponseEntity.ok(userService.deleteUser(userid));
    }

    @GetMapping("/{userid}")
    @PreAuthorize("isAuthenticated()") // refine later with ownership check
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable String userid, @AuthenticationPrincipal UserPrinciple principal) {
        if(!principal.getId().equals(userid) && !principal.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_SYSADMIN"))) {
            log.warn("User with id {} not authorized to get user {}",principal.getId(),userid);
            throw new AccessDeniedException("You do not have permission to get another users info");
        }
        return ResponseEntity.ok(userService.getUser(userid));
    }

    @GetMapping
    @PreAuthorize("hasRole('SYSADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/by-roles")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getUsersByRole(@RequestParam List<String> roles) {
        return ResponseEntity.ok(userService.getUserByRole(roles));
    }

    @PostMapping("/{userid}/roles")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ResponseEntity<UserResponseDTO> setUserRoles(@PathVariable String userid, @RequestBody List<String> roles) {
        return ResponseEntity.ok(userService.setUserRoles(userid, roles));
    }

    @PostMapping("/{userid}/promote-sysadmin")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ResponseEntity<String> promoteToSysAdmin(@PathVariable String userid) {
        userService.setUserToSysAdmin(userid);
        return ResponseEntity.ok("User promoted to SYSADMIN");
    }

    @GetMapping("/roles")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<String>> getAllRoles() {
        return ResponseEntity.ok(userService.getAllRoles());
    }

}
