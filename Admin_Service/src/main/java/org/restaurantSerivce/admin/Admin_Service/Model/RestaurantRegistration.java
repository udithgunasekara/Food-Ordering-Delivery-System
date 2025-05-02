package org.restaurantSerivce.admin.Admin_Service.Model;

import lombok.*;
import org.restaurantSerivce.admin.Admin_Service.Model.Enums.RestaurantStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "restaurant registration")
public class RestaurantRegistration {
    @Id
    private String id;
    private String restaurantName;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private RestaurantStatus status;
    private String ownerId;
    private String ownerFullName;
    private String ownerEmail;
    private String ownerContact;
    private String latitude;
    private String longitude;
    @CreatedDate
    private LocalDateTime requestedAt;
    private LocalDateTime decisionAt;
    private String decisionByAdminId;
}
