package mx.gov.erpgrp.budget.interfaces.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record AllocationResponse(
        UUID id,
        String clave,
        BigDecimal authorized,
        BigDecimal committed,
        BigDecimal available,
        String currency,
        String status
) {}
