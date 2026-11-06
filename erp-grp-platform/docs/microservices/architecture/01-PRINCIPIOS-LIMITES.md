# 1. Principios, límites y contratos
## SA-MS-001

## 1.1 Principios de descomposición

| Principio | Regla práctica |
|-----------|----------------|
| **1 BC ≈ 1 servicio** | Un lenguaje ubicuo, un ciclo de vida de deploy |
| **Database per service** | Sin FK cross-service; referencias por ID |
| **API First síncrono** | OpenAPI 3.1 por servicio |
| **Events First asíncrono** | Kafka + schema versionado (Avro/JSON Schema) |
| **Core no depende de ERP/GRP** | IAM/Audit/Catalog/Workflow/Notification/Document son upstream |
| **Sync solo para invariante inmediata** | Ej. `CommitBudget` al aprobar OC |
| **ACL entre lenguajes** | ERP Purchasing ≠ GRP Budget ≠ (futuro) Public Procurement |

## 1.2 Tipos de contrato

| Contrato | Uso | Breaking change |
|----------|-----|-----------------|
| **REST/OpenAPI** | Commands/Queries UX y sync | Major version `/api/v2` |
| **Domain/Integration Events** | Side-effects entre BC | Nuevo eventVersion o topic |
| **ACL Anti-Corruption** | Traducción de modelos | Dentro del adaptador del consumidor |
| **Idempotency-Key** | POST/PUT que crean side-effects | Obligatorio en commits/pagos |

## 1.3 Límites duros (no negociables)

1. Ningún servicio ERP/GRP escribe en la DB de otro.  
2. Ningún servicio lee JWT sin validar `tenant_id`.  
3. Mutaciones de negocio → evento y/o AuditFact.  
4. Binarios solo en `document-service` + object storage.  
5. Aprobaciones humanas solo vía `workflow-service`.  
6. Saldos presupuestales solo en `budget-service`.  
7. Asientos contables solo en `accounting-service`.  
8. Envío de email/SMS solo en `notification-service`.  

## 1.4 Convención de API

```text
Base: /api/v1
Auth: Authorization: Bearer <JWT>
Tenant: claim tenant_id (header X-Tenant-Id solo en perfiles local/dev)
Idempotency: Idempotency-Key en comandos críticos
Error: ApiError { code, message, traceId, details[] }
Health: /actuator/health/{liveness|readiness}
OpenAPI: /v3/api-docs
```

## 1.5 Convención de eventos

```text
Envelope:
  eventId, eventType, eventVersion, occurredAt,
  tenantId, correlationId, causationId, producer, payload
Topic: {layer}.{domain}.events   e.g. core.iam.events, erp.procurement.events, grp.budget.events
Key: tenantId:aggregateId
Delivery: at-least-once + inbox idempotente
```

## 1.6 Prioridad de implementación (piloto)

```text
iam → audit → catalog → workflow → notification → document
 → budget → procurement
 → (F1) accounting/treasury parcial
 → (OUT-F1 / F2+) resto
```
