# ERP + GRP Enterprise Platform Archetype

Arquetipo productivo de clase Enterprise para una suite integrada **ERP + GRP** orientada a organismos gubernamentales, instituciones públicas, empresas privadas y dependencias federales, estatales y municipales.

## Capacidad objetivo

| Dimensión | Objetivo |
|-----------|----------|
| Usuarios concurrentes | > 100,000 |
| Transacciones anuales | Millones |
| Multiempresa / Multitenant | Sí (aislado por esquema + row-level) |
| Multimoneda / Multiidioma | Sí (ISO 4217 / i18n BCP-47) |
| Disponibilidad | 99.95% (HA activo-activo) |
| Escalabilidad | Horizontal por servicio (K8s HPA/KEDA) |

## Stack tecnológico

- **Backend:** Java 21, Spring Boot 3.3+, Spring Cloud 2023.0+, Spring Security OAuth2/OIDC
- **Datos:** PostgreSQL 16, Redis 7, Elasticsearch 8
- **Mensajería:** Apache Kafka 3.7 + Schema Registry (Avro)
- **Frontend:** Angular 18+ (Microfrontends con Module Federation)
- **Plataforma:** Docker, Kubernetes, Helm, GitHub Actions
- **Observabilidad:** OpenTelemetry, Prometheus, Grafana, Loki, Tempo

## Principios arquitectónicos

Domain Driven Design · Clean Architecture · Hexagonal · SOLID · Event Driven · CQRS · API First · Twelve-Factor · Cloud Native · Secure by Design

## Estructura del monorepo

```
erp-grp-platform/
├── backend/           # Microservicios Spring Boot + libs compartidas
├── frontend/          # Shell Angular + microfrontends + libs
├── infrastructure/    # Docker, K8s, Helm, Terraform
├── database/          # Schemas, migraciones Flyway, ERD
├── docs/              # Arquitectura por fases (1–10)
├── shared/            # Contratos Avro, OpenAPI, Proto
├── scripts/           # Bootstrap local y utilidades
└── .github/workflows/ # CI/CD
```

## Documentación por fases

| Fase | Documento |
|------|-----------|
| 1 | [Arquitectura Empresarial](docs/architecture/00-INDEX.md) |
| 2 | [Dominios y Bounded Contexts](docs/domains/00-INDEX.md) |
| 3 | [Catálogo de Microservicios](docs/microservices/00-INDEX.md) |
| 4 | [Seguridad e IAM](docs/security/00-INDEX.md) |
| 5 | [Arquitectura de Datos](docs/data/00-INDEX.md) |
| 6 | [Event Driven Architecture](docs/events/00-INDEX.md) |
| 7 | [Observabilidad](docs/observability/00-INDEX.md) |
| 8 | [DevOps / CI-CD](docs/devops/00-INDEX.md) |
| 9 | [Estándares y Git Flow](docs/standards/00-INDEX.md) |
| 10 | [Arquetipo y Bootstrap](docs/architecture/10-ARQUETIPO.md) |

## Inicio rápido (local)

```bash
# Prerrequisitos: Docker 24+, JDK 21, Node 20+, Maven 3.9+
./scripts/bootstrap-local.sh
cd backend && mvn -pl services/iam-service -am spring-boot:run
cd frontend/apps/shell && npm start
```

## Justificación de decisiones clave

Inspirado en patrones de **SAP S/4HANA** (módulos activables, ledger universal), **Oracle Fusion Cloud** (multitenant SaaS, SOA/eventos), **Microsoft Dynamics 365** (Dataverse-like catalogs, Power Platform integrations) y sistemas gubernamentales de gran escala (CGFM/SIIF, sistemas tributarios federales):

1. **Modularidad por Bounded Context** → despliegue independiente y feature flags por tenant.
2. **Database-per-service** con PostgreSQL schemas + RLS → aislamiento y compliance.
3. **Kafka como Event Bus** → desacoplamiento ERP↔GRP y eventual consistency controlada.
4. **CQRS selectivo** en finanzas, presupuesto y nómina → lecturas masivas sin bloquear writes.
5. **API Gateway + BFF** → seguridad centralizada y UX multi-canal (portal interno / ciudadano).

## Licencia

Uso interno / arquetipo empresarial. Ajustar según política institucional.
