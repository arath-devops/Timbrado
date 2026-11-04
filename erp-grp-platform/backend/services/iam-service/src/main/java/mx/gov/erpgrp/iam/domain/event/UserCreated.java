package mx.gov.erpgrp.iam.domain.event;

import mx.gov.erpgrp.common.domain.DomainEvent;
import mx.gov.erpgrp.common.domain.TenantId;

import java.time.Instant;
import java.util.UUID;

public record UserCreated(
        UUID eventId,
        Instant occurredAt,
        TenantId tenantId,
        UUID userId,
        String username,
        String email
) implements DomainEvent {
    @Override public String eventType() { return "UserCreated"; }
    @Override public int eventVersion() { return 1; }
}
