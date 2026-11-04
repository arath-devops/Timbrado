package mx.gov.erpgrp.budget.domain.event;

import mx.gov.erpgrp.common.domain.DomainEvent;
import mx.gov.erpgrp.common.domain.TenantId;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record BudgetCommitted(
        UUID eventId,
        Instant occurredAt,
        TenantId tenantId,
        UUID allocationId,
        String clave,
        BigDecimal amount,
        String currency,
        String referenceType,
        UUID referenceId
) implements DomainEvent {
    @Override public String eventType() { return "BudgetCommitted"; }
    @Override public int eventVersion() { return 1; }
}
