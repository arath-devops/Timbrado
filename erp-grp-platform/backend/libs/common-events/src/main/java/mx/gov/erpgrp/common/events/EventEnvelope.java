package mx.gov.erpgrp.common.events;

import java.time.Instant;
import java.util.UUID;

/**
 * EDA-MVP-001 envelope (aligned with shared/avro/common/EventEnvelope.avsc).
 */
public record EventEnvelope(
        UUID eventId,
        String eventType,
        int eventVersion,
        Instant eventTimestamp,
        String tenantId,
        String correlationId,
        String causationId,
        String producer,
        String traceId,
        String requestId,
        String payloadJson
) {
    public static EventEnvelope of(
            String eventType,
            String tenantId,
            String correlationId,
            String producer,
            String payloadJson
    ) {
        return new EventEnvelope(
                UUID.randomUUID(),
                eventType,
                1,
                Instant.now(),
                tenantId,
                correlationId,
                null,
                producer,
                null,
                null,
                payloadJson
        );
    }
}
