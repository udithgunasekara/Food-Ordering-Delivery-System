package org.restaurantSerivce.admin.Admin_Service.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.restaurantSerivce.admin.Admin_Service.Model.Enums.RestaurantStatus;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantRequestResponseDTO {
    private String id;
    private String restaurantName;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String ownerEmail;
    private String ownerFullName;
    private String ownerContact;
    private RestaurantStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime modifiedAt;
}
