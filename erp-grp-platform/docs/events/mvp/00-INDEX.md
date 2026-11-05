# EDA MVP — Contratos de Eventos
## EDA-MVP-001

| Campo | Valor |
|-------|--------|
| Documento | EDA-MVP-001 |
| Rol | Event Driven Architect |
| Mensajería | **Apache Kafka** |
| Formatos | **Avro** + **JSON Schema** |
| Estado | Contratos listos para implementación (sin código de productores/consumidores) |
| Entradas | SA-MS-001, BL-S1-001, API-001, DoD-001 |

## Contenido

1. [Convenciones de envelope, topics y claves](01-ENVELOPE-CONVENTIONS.md)
2. [Catálogo de eventos MVP](02-EVENT-CATALOG.md)
3. Artefactos de esquema:
   - Avro: `shared/avro/mvp/`
   - JSON Schema: `shared/json-schema/mvp/`
   - Envelope común: `shared/avro/common/EventEnvelope.avsc` · `shared/json-schema/common/event-envelope.json`

## Principio

> Todo evento de negocio del MVP viaja en Kafka con envelope tipado, clave `tenantId:aggregateId`, entrega at-least-once e inbox idempotente por `eventId`.

## Alias vs Baseline / SA-MS

| Evento contrato EDA-MVP | Alias / equivalente documental previo |
|-------------------------|----------------------------------------|
| `UserCreated` | `UserRegistered` |
| `BudgetReleased` | `BudgetCommitmentReleased` |
| `PurchaseRequestCreated` | `PurchaseRequisitionCreated` |
| `PurchaseRequestApproved` | `PurchaseRequisitionApproved` |
| `WorkflowStarted` | `ProcessStarted` |
| `WorkflowApproved` | `ProcessCompleted` (outcome APPROVE) |
| `WorkflowRejected` | `ProcessRejected` |
| `AuditRecordCreated` | `AuditFact` ingest / `AuditFactRecorded` |

Los **nombres canónicos de contrato Kafka** para implementación MVP son los de esta carpeta (`EDA-MVP-001`).
