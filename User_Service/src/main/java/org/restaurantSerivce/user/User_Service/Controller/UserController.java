package org.restaurantSerivce.user.User_Service.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.restaurantSerivce.user.User_Service.DTO.Request.LoginRequestDTO;
import org.restaurantSerivce.user.User_Service.DTO.Request.UserRequestDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse.InternalAdminUserResponseDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse.InternalDeliveryPersonResponseDTO;
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

    //update user method for user
    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDTO> updateUser(@RequestBody UserRequestDTO request, @AuthenticationPrincipal UserPrinciple principal) {
        log.info("updating user detials for user : {} ", principal.getUsername());
        return ResponseEntity.ok(userService.updateUser(principal.getId(), request));
    }

    //get user method for user
    @GetMapping("/getuser")
    @PreAuthorize("isAuthenticated()") // refine later with ownership check
    public ResponseEntity<UserResponseDTO> getUser(@AuthenticationPrincipal UserPrinciple principal) {
        log.info("get user by userid method invoked with id {} ",principal.getId());
        UserResponseDTO userdetails = userService.getUser(principal.getId());
        log.info("user details recieved for user : {} and useranme as  {} ",principal.getId(),userdetails.getUsername());
        return ResponseEntity.ok(userdetails);
    }

    //delete user method for admins and only admins
    @DeleteMapping("/{userid}")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable String userid) {
        return ResponseEntity.ok(userService.deleteUser(userid));
    }

    //get all users method for admins and only admins
    @GetMapping
    @PreAuthorize("hasRole('SYSADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    //get users by user roles for admins and only admins
    @GetMapping("/byroles")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getUsersByRole(@RequestParam List<String> roles) {
        return ResponseEntity.ok(userService.getUserByRole(roles));
    }

    //set user roles
    @PostMapping("/{userid}/roles")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ResponseEntity<UserResponseDTO> setUserRoles(@PathVariable String userid, @RequestBody List<String> roles) {
        return ResponseEntity.ok(userService.setUserRoles(userid, roles));
    }

    //promote to system admin
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


//---------------------for internal communication---------------------------
    @GetMapping("/internal/{email}")
    public ResponseEntity<InternalAdminUserResponseDTO> getUserForInternal(@PathVariable String email/*, @AuthenticationPrincipal UserPrinciple principal*/) {
        log.info("get user by email method invoked with email {}  for internal use",email);
        /*if(!principal.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_SYSADMIN"))) {
            log.warn("User with id {} not authorized to get user {}",principal.getId(),email);
            throw new AccessDeniedException("You do not have permission to get another users info");
        }*/
        InternalAdminUserResponseDTO userdetails = userService.getUserForInternal(email);
        log.info("user details recieved for user : {} and useranme as  {} for internal ",email,userdetails.getFirstName() + userdetails.getLastName());
        return ResponseEntity.ok(userdetails);
    }

    @GetMapping("/internal/getuid/{userid}")
    public ResponseEntity<InternalAdminUserResponseDTO> getUserByIdInternal(@PathVariable String userid) {
        log.info("get user by userid method invoked with id {}  for internal use",userid);
        InternalAdminUserResponseDTO userdetails = userService.getUserById(userid);
        log.info("user details recieved for userid : {} and useranme as  {} for internal ",userid,userdetails.getFirstName() + userdetails.getLastName());
        return ResponseEntity.ok(userdetails);
    }



    @GetMapping("/internal/delivery")
    public ResponseEntity<List<InternalDeliveryPersonResponseDTO>> getAllDevliveryRoles() {
        log.info("get all devliy roles for internal comminication");
        return ResponseEntity.ok(userService.getAllDeliveryPersons());
    }

    @PostMapping("/internal/restadmin/{userid}")
    public ResponseEntity<String> addRestAdminToUser(@PathVariable String userid) {
        log.info("⚠️⚠️add restadmin to user : {} ", userid);
        userService.setUserToRestaurantAdmin(userid);
        return ResponseEntity.ok("User promoted to RESTAURANT ADMIN");
    }

}
