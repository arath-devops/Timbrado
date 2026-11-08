package mx.gov.erpgrp.common.events;

import java.time.Instant;
import java.util.UUID;

public record OutboxMessage(
        UUID id,
        String aggregateType,
        String aggregateId,
        String eventType,
        String payload,
        String tenantId,
        Instant createdAt,
        Instant publishedAt
) {}
