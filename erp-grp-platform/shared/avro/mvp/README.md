# Avro — Eventos MVP (EDA-MVP-001)

Schemas Avro 1.x para Kafka. Namespace: `mx.gov.erpgrp.events.mvp`.

Cada record incluye metadata de envelope + `payload` tipado:

- `eventId`, `eventType`, `eventVersion`, `eventTimestamp`
- `tenantId`, `correlationId`, `causationId`, `producer`
- `traceId`, `requestId` (opcionales)

Ver catálogo: `docs/events/mvp/02-EVENT-CATALOG.md`.

Paridad: `shared/json-schema/mvp/`.
