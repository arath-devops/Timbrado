package mx.gov.erpgrp.common.domain;

import java.time.Instant;
import java.util.UUID;

public interface DomainEvent {
    UUID eventId();
    String eventType();
    int eventVersion();
    Instant occurredAt();
    TenantId tenantId();
}
