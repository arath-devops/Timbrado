# Arquitectura de Integración

## 1. Patrones de integración

| Patrón | Uso | Ejemplo |
|--------|-----|---------|
| Sync REST/JSON | Queries y comandos UX | Crear OC, consultar saldo |
| Async Events (Kafka) | Side-effects entre dominios | `PurchaseOrderApproved` → Budget + Accounting |
| Outbox / Inbox | Consistencia dual-write | Persistencia + publicación atómica |
| Saga / Process Manager | Flujos largos | P2P, nómina, ejercicio presupuestal |
| ACL | Traducción ERP↔GRP | Partida ↔ Cuenta |
| BFF | Agregación UI | Shell Angular |
| File / Batch | Intercambios masivos | Layouts bancarios, CFDI zip |
| Webhooks | Extensibilidad partners | Notificar ERP externo |

## 2. Bus de eventos

```mermaid
flowchart LR
  SVC_A[purchasing-service] -->|Outbox relay| KAFKA[[Kafka Cluster]]
  KAFKA --> SVC_B[budget-service]
  KAFKA --> SVC_C[accounting-service]
  KAFKA --> SVC_D[inventory-service]
  KAFKA --> SVC_E[audit-service]
  KAFKA --> SVC_F[notification-service]
  SCHEMA[(Schema Registry Avro)]
  SVC_A -.-> SCHEMA
  SVC_B -.-> SCHEMA
```

## 3. Contratos

- **Síncronos:** OpenAPI 3.1 en `shared/openapi/<service>/v1.yaml`
- **Asíncronos:** Avro en `shared/avro/<domain>/*.avsc` + AsyncAPI
- **Versionado:** `major` breaking → topic nuevo o subject strategy `RecordNameStrategy` + compatibilidad BACKWARD

## 4. Integraciones externas

```mermaid
sequenceDiagram
  participant TRE as treasury-service
  participant GW as Integration Adapter
  participant BANK as Banco / SPEI
  participant AUD as audit-service

  TRE->>TRE: PaymentOrderApproved
  TRE->>GW: DispatchPayment command
  GW->>BANK: ISO20022 / SPEI request
  BANK-->>GW: ACK / Settlement
  GW->>TRE: PaymentSettled event
  TRE->>AUD: AuditFact recorded
```

| Sistema | Protocolo | Seguridad |
|---------|-----------|-----------|
| Bancos | SFTP / API REST / MQ | mTLS + IP allowlist |
| SAT / CFDI | SOAP/REST | Certificados FIEL / CSD |
| TESOFE | Archivos / API | VPN + firma |
| IdP institucional | OIDC / SAML 2.0 | Metadata firmada |
| Email/SMS | SMTP / Provider API | API keys en Vault |

## 5. Idempotencia e integración confiable

1. Cada comando externo lleva `Idempotency-Key` (UUID).
2. Consumers Kafka usan `inbox` table `(consumer_id, event_id)`.
3. Reintentos con backoff exponencial + DLQ topic `*.dlq`.
4. Compensaciones explícitas en sagas (no 2PC distribuido).

## 6. Justificación vs ESB clásico

Los ESB monolíticos (Oracle SOA Suite / SAP PI legacy) se convierten en SPOF. Este diseño usa **smart endpoints, dumb pipes** (Kafka) al estilo Dynamics Dual-write + Azure Service Bus, con gobernanza de esquemas vía Schema Registry.
