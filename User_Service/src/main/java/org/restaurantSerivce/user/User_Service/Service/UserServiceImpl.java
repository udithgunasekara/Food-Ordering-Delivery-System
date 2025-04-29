package org.restaurantSerivce.user.User_Service.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.restaurantSerivce.user.User_Service.DTO.Request.UserRequestDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse.InternalAdminUserResponseDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse.InternalDeliveryPersonResponseDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.UserResponseDTO;
import org.restaurantSerivce.user.User_Service.Exceptions.ResourceAlreadyExistException;
import org.restaurantSerivce.user.User_Service.Exceptions.ResourceNotFoundException;
import org.restaurantSerivce.user.User_Service.Mapper.UserMapper;
import org.restaurantSerivce.user.User_Service.Model.Enums.RoleType;
import org.restaurantSerivce.user.User_Service.Model.User;
import org.restaurantSerivce.user.User_Service.Repository.UserRepository;
import org.restaurantSerivce.user.User_Service.Service.base.IUserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO registerUser(UserRequestDTO request) {
        User user = UserMapper.userRequestDtoToUser(request);
        User existinguser = userRepository.findByEmail(user.getEmail());
        if (existinguser != null) {
            log.error("❌attempted to register a user with the existing email : {}" , user.getEmail());
            throw new ResourceAlreadyExistException(request.getEmail());
        }
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
//        user.setRoles(assignRole(RoleType.ROLE_CUSTOMER.toString()));
        assignRole(user, RoleType.ROLE_CUSTOMER.toString());

        User savedUser = userRepository.save(user);

        return UserMapper.userToUserResponseDTO(savedUser);
    }

//    private List<RoleType> assignRole(String role){
//        RoleType roleType;
//        try {
//            roleType = RoleType.valueOf(role);
//        } catch (IllegalArgumentException e) {
//            throw new RuntimeException("Invalid role: " + role);
//        }
//        return new ArrayList<>(List.of(roleType));
//    }

    private void assignRole(User user, String role) {
        RoleType roleType;
        try {
            roleType = RoleType.valueOf(role);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role);
        }

        // Initialize roles list if it's null
        if (user.getRoles() == null) {
            user.setRoles(new ArrayList<>());
        }

        // Add the role if not already present
        if (!user.getRoles().contains(roleType)) {
            user.getRoles().add(roleType);
        }
    }

    @Override
    public UserResponseDTO updateUser(String userid, UserRequestDTO updateRequest) {

        User user = userRepository.findById(userid).orElseThrow(() -> new ResourceNotFoundException("User","userid",userid));

        user.setUsername(updateRequest.getUsername());
        user.setPasswordHash(passwordEncoder.encode(updateRequest.getPassword())); // if updating password
        user.setEmail(updateRequest.getEmail());
        user.setFirstName(updateRequest.getFirstName());
        user.setLastName(updateRequest.getLastName());
        user.setPhone(updateRequest.getPhone());
        user.setAddress(updateRequest.getAddress());
        user.setCity(updateRequest.getCity());
        user.setState(updateRequest.getState());
        user.setZip(updateRequest.getZip());
        user.setCountry(updateRequest.getCountry());

        User updatedUser = userRepository.save(user);

        return UserMapper.userToUserResponseDTO(updatedUser);
    }

    @Override
    public UserResponseDTO getUser(String userid) {
        User user = userRepository.findById(userid).orElseThrow(() -> new ResourceNotFoundException("User","userid",userid));
        return UserMapper.userToUserResponseDTO(user);
    }

    @Override
    public String deleteUser(String userid) {
        try{
            User user = userRepository.findById(userid).orElseThrow(() -> new ResourceNotFoundException("User","userid",userid));
            userRepository.delete(user);
            return "User with ID " + userid + " was deleted";
        }catch(ResourceNotFoundException e){
            return e.getMessage();
        }catch(Exception e) {
            return "An error occurred while deleting user " + e.getMessage();
        }
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserMapper::userToUserResponseDTO).toList();
    }

    @Override
    public List<UserResponseDTO> getUserByRole(List<String> roles) {
        List<RoleType> roleTypes = roles.stream()
                .map(roleStr -> {
                    try {
                        return RoleType.valueOf(roleStr);
                    } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Invalid role: " + roleStr);
                    }
                })
                .toList();

        List<User> users = userRepository.findByRolesIn(roleTypes);
        return users.stream()
                .map(UserMapper::userToUserResponseDTO)
                .collect(Collectors.toList());
    }


    @Override
    public UserResponseDTO setUserRoles(String userid, List<String> roles) {
        List<RoleType> roleTypes = roles.stream()
                .map(roleStr -> {
                    try {
                        return RoleType.valueOf(roleStr);
                    } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Invalid role: " + roleStr);
                    }
                })
                .toList();
        User user = userRepository.findById(userid).orElseThrow(() -> new ResourceNotFoundException("User","userid",userid));

        user.setRoles(roleTypes);
        User savedUser = userRepository.save(user);
        return UserMapper.userToUserResponseDTO(savedUser);
    }

    public UserResponseDTO setOneUserRoles(String userid, String role) {
        User user = userRepository.findById(userid).orElseThrow(() -> new ResourceNotFoundException("User","userid",userid));
        RoleType roleType;
        try {
            role = role.replace("\"", "").trim();
            roleType = RoleType.valueOf(role);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role received: " + role);
        }
        if (!user.getRoles().contains(roleType)) {
            log.info(" adding role {} to user {}", roleType,user.getUsername());
            user.getRoles().add(roleType);
        }

        User savedUser = userRepository.save(user);
        return UserMapper.userToUserResponseDTO(savedUser);
    }

    @Override
    public void setUserToSysAdmin(String userid) {
        User user = userRepository.findById(userid).orElseThrow(() -> new ResourceNotFoundException("User","userid",userid));
//        user.setRoles(assignRole(user,RoleType.ROLE_SYSADMIN.toString()));
        assignRole(user,RoleType.ROLE_SYSADMIN.toString());
        userRepository.save(user);
    }

    @Override
    public List<String> getAllRoles() {
        return Arrays.stream(RoleType.values()).map(Enum::name).toList();
    }

    //---------------internal service operations ----------------


    public InternalAdminUserResponseDTO getUserForInternal(String useremail) {
        User user = userRepository.findByEmail(useremail);
        return UserMapper.userToInternalUserDTO(user);
    }

    @Override
    public List<InternalDeliveryPersonResponseDTO> getAllDeliveryPersons() {
        List<User> deliveryAgents = userRepository.findByRoles(RoleType.ROLE_DELIVERY_AGENT);
        return deliveryAgents.stream()
                .map(UserMapper::userToInternalDeliveryPersonDTO)
                .collect(Collectors.toList());
    }
}
