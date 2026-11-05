# Catálogo de Microservicios

> **Fuente de verdad:** [SA-MS-001 — Architecture](architecture/00-INDEX.md)  
> Las fichas planas `docs/microservices/*.md` son **borrador histórico**; no usar para implementación.

## SA-MS-001 (vigente)

| Capa | Servicios | Prioridad piloto |
|------|-----------|------------------|
| **Core** | iam, audit, catalog, workflow, notification, document | MVP |
| **ERP** | procurement (+ finance, accounting, treasury, inventory, hr, payroll) | MVP = procurement; resto F1/OUT-F1 |
| **GRP** | budget (+ transparency, citizen, social-program, tax) | MVP = budget; resto OUT-F1 / F2+ |

### Contratos críticos
- [Principios y límites](architecture/01-PRINCIPIOS-LIMITES.md)
- [Mapa de dependencias](architecture/02-MAPA-DEPENDENCIAS.md)
- [Contratos transversales](architecture/03-CONTRATOS-TRANSVERSALES.md) — incluye **CommitBudget** sync Procurement ↔ Budget

### Naming
| Nombre SA-MS-001 | Significado |
|------------------|-------------|
| `procurement-service` (ERP) | P2P / Purchasing operativo |
| `public-procurement-service` (futuro GRP) | Contrataciones públicas — **no** en este lote |

## Convenciones (heredadas / ratificadas)
- Prefijo API: `/api/v1`
- Health: `/actuator/health/{liveness|readiness}`
- DB-per-service (PostgreSQL)
- Outbox obligatorio para eventos de negocio
- TenantId en JWT + columna/RLS
- Core ↛ ERP/GRP (compile-time)
