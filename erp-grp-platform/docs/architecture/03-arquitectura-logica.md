# Arquitectura Lógica

## 1. Capas lógicas

```mermaid
flowchart TB
  subgraph Presentation["Capa de Presentación"]
    SHELL[Angular Shell MFE Host]
    MFE_ERP[Microfrontends ERP]
    MFE_GRP[Microfrontends GRP]
    PORTAL[Portal Ciudadano]
    BFF[BFF GraphQL/REST]
  end

  subgraph Edge["Capa Edge"]
    WAF[WAF / CDN]
    APIGW[API Gateway Spring Cloud Gateway]
    RATE[Rate Limiter / Quotas]
  end

  subgraph Application["Capa de Aplicación - Microservicios"]
    CORE[Core: IAM Audit Catalog Workflow Notify Report Config Tenant]
    ERP[ERP Domain Services]
    GRP[GRP Domain Services]
  end

  subgraph Integration["Capa de Integración"]
    KAFKA[Kafka Event Bus]
    OUTBOX[Transactional Outbox]
    ACL[Anti-Corruption Layers]
    ADAPTERS[Adapters externos]
  end

  subgraph Data["Capa de Datos"]
    PG[(PostgreSQL clusters)]
    REDIS[(Redis)]
    ES[(Elasticsearch)]
    S3[(Object Storage)]
  end

  subgraph Observability["Capa Observabilidad"]
    OTEL[OpenTelemetry Collector]
    PROM[Prometheus]
    GRAF[Grafana]
    LOKI[Loki]
    TEMPO[Tempo]
  end

  Presentation --> Edge --> Application
  Application --> Integration
  Application --> Data
  Application --> Observability
  Integration --> Data
```

## 2. Patrón hexagonal por microservicio

```mermaid
flowchart LR
  subgraph Hex["Microservicio Genérico"]
    direction TB
    REST[REST Adapter]
    KAFKA_IN[Kafka Consumer Adapter]
    subgraph App["Application"]
      CMD[Command Handlers]
      QRY[Query Handlers]
    end
    subgraph Dom["Domain"]
      AGG[Aggregates]
      DOM_SVC[Domain Services]
      EVT[Domain Events]
      PORT[Ports]
    end
    JPA[JPA Adapter]
    KAFKA_OUT[Kafka Publisher / Outbox]
    REDIS_A[Redis Adapter]
  end

  REST --> CMD
  KAFKA_IN --> CMD
  REST --> QRY
  CMD --> Dom
  QRY --> Dom
  Dom --> JPA
  Dom --> KAFKA_OUT
  QRY --> REDIS_A
```

**Justificación:** Homogeneiza el código entre 30+ servicios (como el “template” de SAP CAP / Spring Modulith extendido a microservicios). Reduce onboarding de equipos.

## 3. CQRS lógico

| Dominio | Write Model | Read Model | Motivo |
|---------|-------------|------------|--------|
| Accounting | `journal_entry` | `trial_balance_view`, ES ledger search | Consultas contables pesadas |
| Budget | `budget_allocation` | `budget_availability_mv` | Availability check en tiempo real |
| Payroll | `payroll_run` | `payslip_read`, report warehouse | Cálculo vs consulta masiva |
| Catalog | CRUD | Redis cache + ES | Alta frecuencia lectura |
| Citizen | Case aggregate | ES full-text expediente | Búsqueda ciudadana |

## 4. Paquete Java estándar (por servicio)

```
mx.gov.erpgrp.<contexto>/
  domain/
    model/          # Aggregates, Entities, VOs
    service/        # Domain services
    event/          # Domain events
    port/           # inbound/outbound interfaces
  application/
    command/
    query/
    handler/
  infrastructure/
    persistence/
    messaging/
    web/
    config/
    security/
  interfaces/
    rest/
    dto/
```

## 5. Cross-cutting concerns

| Concern | Implementación |
|---------|----------------|
| AuthN/AuthZ | JWT OIDC + method security + ABAC policies |
| Tenant resolution | `TenantContext` Filter (header/JWT claim) |
| Auditoría | AOP + Outbox → `audit-service` |
| Idempotencia | `Idempotency-Key` + Redis |
| Tracing | W3C Trace Context vía OTel |
| Resilience | Resilience4j (CB, retry, bulkhead, timelimiter) |
| Validation | Bean Validation + domain invariants |
