package mx.gov.erpgrp.iam.infrastructure.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import mx.gov.erpgrp.common.domain.DomainEvent;
import mx.gov.erpgrp.common.events.EventEnvelope;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DomainEventPublisher {
    public static final String TOPIC = "core.iam.events";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public DomainEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publish(List<DomainEvent> events) {
        for (DomainEvent event : events) {
            try {
                var envelope = EventEnvelope.of(
                        event.eventType(),
                        event.tenantId().toString(),
                        "iam-service",
                        objectMapper.writeValueAsString(event)
                );
                kafkaTemplate.send(TOPIC, event.tenantId().toString(), objectMapper.writeValueAsString(envelope));
            } catch (Exception ex) {
                throw new IllegalStateException("Failed to publish event " + event.eventType(), ex);
            }
        }
    }
}
