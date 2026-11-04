package mx.gov.erpgrp.budget.application.command;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record CommitBudgetCommand(
        @NotNull UUID allocationId,
        @NotNull @Positive BigDecimal amount,
        @NotBlank String currency,
        @NotBlank String referenceType,
        @NotNull UUID referenceId
) {}
