package org.restaurantSerivce.user.User_Service.Service.base;

import org.restaurantSerivce.user.User_Service.DTO.Request.UserRequestDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse.InternalAdminUserResponseDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.InternalResponse.InternalDeliveryPersonResponseDTO;
import org.restaurantSerivce.user.User_Service.DTO.Response.UserResponseDTO;

import java.util.List;

public interface IUserService {
    public UserResponseDTO registerUser(UserRequestDTO request);
    public UserResponseDTO updateUser(String userid, UserRequestDTO updateRequest);
    public UserResponseDTO getUser(String userid);
    public String deleteUser(String userid);
    public List<UserResponseDTO> getAllUsers();
    public List<UserResponseDTO> getUserByRole(List<String> role);
    public UserResponseDTO setUserRoles(String userid, List<String> roles);
    public void setUserToSysAdmin(String userid);
    public List<String> getAllRoles();
    public InternalAdminUserResponseDTO getUserForInternal(String userid);
    public List<InternalDeliveryPersonResponseDTO> getAllDeliveryPersons();

    public InternalAdminUserResponseDTO getUserById(String userid);
}
