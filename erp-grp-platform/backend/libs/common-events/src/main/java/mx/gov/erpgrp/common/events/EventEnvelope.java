package mx.gov.erpgrp.common.events;

import java.time.Instant;
import java.util.UUID;

public record EventEnvelope(
        UUID eventId,
        String eventType,
        int eventVersion,
        Instant occurredAt,
        String tenantId,
        String correlationId,
        String causationId,
        String producer,
        String payloadJson
) {
    public static EventEnvelope of(String eventType, String tenantId, String producer, String payloadJson) {
        return new EventEnvelope(
                UUID.randomUUID(),
                eventType,
                1,
                Instant.now(),
                tenantId,
                null,
                null,
                producer,
                payloadJson
        );
    }
}
