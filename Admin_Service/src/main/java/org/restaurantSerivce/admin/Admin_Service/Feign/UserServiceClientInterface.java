package org.restaurantSerivce.admin.Admin_Service.Feign;

//import org.restaurantSerivce.admin.Admin_Service.Config.FeignConfig;
import org.restaurantSerivce.admin.Admin_Service.DTO.Response.InternalUserResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "USER-SERVICE" /*, configuration = FeignConfig.class*/)
public interface UserServiceClientInterface {
    @GetMapping(value = "/api/users/internal/{email}")
    ResponseEntity<InternalUserResponseDTO> getUserForInternal(@PathVariable("email") String email);

    @PostMapping(value = "/api/users/internal/restadmin/{userid}")
    ResponseEntity<String> addRestAdminToUser(@PathVariable String userid);
}
