# Delivery — Sprint Governance
## DEL-S1-001

| Campo | Valor |
|-------|--------|
| Documento | DEL-S1-001 |
| Roles | CTO · Product Owner · Enterprise Architect · Delivery Manager · Engineering Manager · Tech Lead |
| Entradas | EA-DEC-001, EA-VIS-001, SA-MS-001, SEC-ARCH-001, BPM-001, EDM-001, DDD-001, ORG-001 |
| Estado | **Baseline Sprint 1 + DoD servicios MVP** (sin código) |
| Piloto | Gobierno Municipal — tenant dedicado |
| Fecha de congelamiento | 2026-11-05 |

## Contenido

1. [Scope Freeze Document](01-SCOPE-FREEZE.md) — qué entra, qué no, riesgos, supuestos, restricciones  
2. [Definition of Ready](02-DEFINITION-OF-READY.md) — cuándo un módulo está listo para desarrollo  
3. [Sprint 1 Scope Baseline](03-SPRINT-1-SCOPE-BASELINE.md) — alcance operativo del primer sprint de construcción  
4. [Definition of Done](04-DEFINITION-OF-DONE.md) — cuándo un servicio MVP está terminado (código → deploy)  
5. Contratos OpenAPI 3.1 → [`shared/openapi/`](../../shared/openapi/README.md) · [API-001](../api/00-INDEX.md)  
6. Contratos eventos Kafka → [EDA-MVP-001](../events/mvp/00-INDEX.md) · Avro/JSON Schema en `shared/avro/mvp` y `shared/json-schema/mvp`  
7. Modelo de datos físico → [DA-MVP-001](../data/mvp/00-INDEX.md) · Flyway `database/flyway/*/V1__init_mvp.sql`

## Relación con documentos previos

| Artefacto previo | Uso en Delivery |
|------------------|-----------------|
| EA-DEC-001 | Alcance de negocio y exclusiones OUT-F1 |
| SA-MS-001 | Nombres de servicio, APIs, eventos, DBs |
| SEC-ARCH-001 | Slice IAM del Sprint 1 |
| BPM-001 | Procesos `PO_APPROVAL` / requisición |
| EDM-001 | Slice documental mínimo |
| ORG-001 | OrgUnit / roles municipales del piloto |

> Este paquete **congela** el Sprint 1. Cambios posteriores requieren Change Request formal (PO + EA + CTO).
