# 1. Envelope, topics y metadatos
## EDA-MVP-001

## 1.1 Envelope obligatorio (todo evento)

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `eventId` | UUID string | Sí | Identidad del evento; clave de idempotencia del consumidor |
| `eventType` | string | Sí | Nombre canónico (ej. `BudgetCommitted`) |
| `eventVersion` | int | Sí | Versión del **contrato** del eventType (inicia en `1`) |
| `eventTimestamp` | string (ISO-8601 UTC) | Sí | Momento en que ocurrió el hecho de negocio |
| `tenantId` | UUID string | Sí | Tenant del piloto / plataforma |
| `correlationId` | UUID string | Sí | Correlación de flujo E2E (mismo valor que `X-Correlation-Id` HTTP) |
| `causationId` | UUID string \| null | No | eventId o requestId que causó este evento |
| `producer` | string | Sí | Nombre canónico del servicio (ej. `budget-service`) |
| `payload` | object | Sí | Cuerpo tipado por eventType |

Campos adicionales permitidos en envelope (no breaking si optional):

| Campo | Tipo | Uso |
|-------|------|-----|
| `traceId` | string | Alineación OTel / `X-Trace-Id` |
| `requestId` | UUID string | Request HTTP originario |
| `schemaSubject` | string | Subject del Schema Registry |

## 1.2 Topics

Patrón: `{layer}.{domain}.events`

| Topic | Layer | Domain | Retención sugerida int |
|-------|-------|--------|------------------------|
| `core.iam.events` | core | iam | 7 días |
| `core.audit.events` | core | audit | 30 días (piloto) |
| `core.workflow.events` | core | workflow | 14 días |
| `core.document.events` | core | document | 14 días |
| `erp.procurement.events` | erp | procurement | 14 días |
| `grp.budget.events` | grp | budget | 14 días |

DLQ: `{topic}.dlq` (ej. `grp.budget.events.dlq`).

## 1.3 Key de partición

```text
key = "{tenantId}:{aggregateId}"
```

| eventType | aggregateId |
|-----------|-------------|
| UserCreated, RoleAssigned | `userId` |
| AuditRecordCreated | `entityId` (o `auditRecordId` si se parte por fact) |
| Workflow* | `processInstanceId` |
| Document* | `documentId` (Uploaded) / `documentId` (Linked) |
| PurchaseRequest* | `purchaseRequestId` |
| Budget* | `allocationId` (Commit/Release/Fail) |

## 1.4 Versionado

| Cambio | Acción |
|--------|--------|
| Campo opcional nuevo en payload | `eventVersion` puede permanecer; compat BACKWARD en registry |
| Campo requerido nuevo / remove / rename | `eventVersion++`; dual-publish período de gracia |
| Rename `eventType` | Nuevo tipo; no reutilizar nombre |

Registro: Confluent Schema Registry (o compatible). Subject sugerido:

```text
{topic}-{eventType}-value
ej. grp.budget.events-BudgetCommitted-value
```

## 1.5 Formatos

| Formato | Ubicación | Uso |
|--------|-----------|-----|
| **Avro** | `shared/avro/mvp/*.avsc` | Producción Kafka (preferido) |
| **JSON Schema** | `shared/json-schema/mvp/*.json` | Validación, docs, consumidores no-Avro, contract tests |

Ambos formatos deben mantener **paridad de campos** para el mismo `eventVersion`.

## 1.6 Headers Kafka recomendados

Además del value Avro/JSON:

| Header | Valor |
|--------|-------|
| `eventType` | string |
| `eventVersion` | string int |
| `tenantId` | UUID |
| `correlationId` | UUID |
| `ce_specversion` | `1.0` (opcional CloudEvents) |

## 1.7 Semántica de entrega

- Producción vía **outbox** en la misma TX de negocio.
- Consumo **at-least-once** + inbox dedup por `eventId`.
- Reprocesos seguros: consumidores idempotentes.
