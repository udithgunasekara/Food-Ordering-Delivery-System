package org.restaurantSerivce.admin.Admin_Service.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialReportResponseDTO {
    private String restaurantId;
    private String restaurantName;
    private BigDecimal totalEarnings;
    private int totalOrders;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private List<TransactionDTO> transactions;
}
