package mx.gov.erpgrp.budget.infrastructure.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import mx.gov.erpgrp.common.domain.DomainEvent;
import mx.gov.erpgrp.common.events.EventEnvelope;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BudgetEventPublisher {
    public static final String TOPIC = "grp.budget.events";
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public BudgetEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publish(List<DomainEvent> events) {
        for (var event : events) {
            try {
                var envelope = EventEnvelope.of(event.eventType(), event.tenantId().toString(),
                        "budget-service", objectMapper.writeValueAsString(event));
                kafkaTemplate.send(TOPIC, event.tenantId().toString(), objectMapper.writeValueAsString(envelope));
            } catch (Exception e) {
                throw new IllegalStateException("Unable to publish " + event.eventType(), e);
            }
        }
    }
}
