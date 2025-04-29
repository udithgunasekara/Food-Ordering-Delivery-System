package org.restaurantSerivce.admin.Admin_Service.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private String transactionId;
    private LocalDateTime timestamp;
    private BigDecimal amount;
    private String paymentMethod;
}
