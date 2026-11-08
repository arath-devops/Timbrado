# Arquetipo técnico MVP
## ARCH-MVP-001

| Campo | Valor |
|-------|--------|
| Stack | Java 21 · Spring Boot 3.3 · PostgreSQL · Kafka · Redis · Docker · Kubernetes |
| Layout | Monorepo Maven multi-module en `backend/` |
| Estado | Arquetipo compilable; lógica de negocio pendiente según BL-S1-CORE backlog |

## Artefactos aprobados consumidos (sin inventar contratos)

| Artefacto | Uso en arquetipo |
|-----------|------------------|
| API-001 OpenAPI | Copiado a `services/*/src/main/resources/openapi/v1.yaml` |
| DA-MVP Flyway | Copiado a `services/*/src/main/resources/db/migration/V1__init_mvp.sql` |
| EDA-MVP | `common-events.EventEnvelope` alineado a envelope aprobado |
| CA-TEN | `TenantContext` + `TenantContextFilter` + JWT `tenant_id` |
| SA-GW | `gateway-service` rutas `/api/v1/{service}/**` |
| DoD-001 | Actuator probes, Micrometer/OTel hooks, Jacoco plugin, non-root Docker |
| BL-S1 / Scope Freeze | Solo módulos MVP en `backend/pom.xml` |

## Módulos Maven

```text
backend/
  libs/common-{domain,security,events,web,persistence}
  gateway-service
  services/
    iam-service
    catalog-service
    audit-service
    workflow-service
    document-service
    procurement-service
    budget-service
```

## Puertos locales

| Servicio | Puerto | DB |
|----------|--------|-----|
| gateway | 8080 | — |
| iam | 8081 | iam_db |
| catalog | 8082 | catalog_db |
| audit | 8083 | audit_db |
| workflow | 8084 | workflow_db |
| document | 8085 | document_db |
| procurement | 8086 | procurement_db |
| budget | 8087 | budget_db |

## Build

```bash
cd erp-grp-platform/backend
mvn -B verify
```

## Docker

```bash
docker build -f infrastructure/docker/Dockerfile.service \
  --build-arg SERVICE=iam-service \
  -t erpgrp/iam-service:local .
```

## Helm

```bash
helm upgrade --install erp-grp infrastructure/helm/erp-grp
```

## Nota de alcance de código

Este arquetipo entrega **estructura, seguridad base, migraciones y contratos embebidos**.  
La implementación de endpoints de negocio del backlog BL-S1-CORE / BL-S1 se realiza sobre este esqueleto **sin cambiar** OpenAPI/Flyway/eventos aprobados.
