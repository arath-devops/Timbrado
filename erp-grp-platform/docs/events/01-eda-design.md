# Diseño Event Driven

## Patrones
- **Transactional Outbox** en cada servicio escritor
- **Inbox** en cada consumidor (idempotencia)
- **Domain Events** vs **Integration Events** (ACL traduce)
- **Saga orquestada** vía `workflow-service` para P2P/Nómina/Presupuesto

## Envelope estándar
```json
{
  "eventId": "uuid",
  "eventType": "PurchaseOrderApproved",
  "eventVersion": 1,
  "occurredAt": "2026-11-04T18:00:00Z",
  "tenantId": "uuid",
  "correlationId": "uuid",
  "causationId": "uuid",
  "producer": "purchasing-service",
  "payload": { }
}
```

## Justificación
Equivale a SAP Event Mesh + Oracle Streams + Dynamics Dual-write: desacopla módulos y permite replay para rebuild de read models.
