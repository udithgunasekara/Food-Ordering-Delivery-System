package org.restaurantSerivce.admin.Admin_Service.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class FinancialRequestDTO {
    private String storeId;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
}

