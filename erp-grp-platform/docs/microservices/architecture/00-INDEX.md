# Catálogo de Microservicios — Software Architecture
## SA-MS-001

| Campo | Valor |
|-------|--------|
| Documento | SA-MS-001 |
| Rol | Software Architect |
| Entradas | DDD-001, SEC-ARCH-001, BPM-001, EDM-001, ORG-001, EA-DEC-001 |
| Estado | Diseño de servicios y contratos (sin código) |
| Piloto | Core + `procurement-service` + `budget-service` (+ document/workflow) |

## Contenido

1. [Principios y límites](01-PRINCIPIOS-LIMITES.md)
2. [Mapa de servicios y dependencias](02-MAPA-DEPENDENCIAS.md)
3. [Contratos transversales (API & Events)](03-CONTRATOS-TRANSVERSALES.md)
4. Core (MVP)
   - [iam-service](core/iam-service.md)
   - [audit-service](core/audit-service.md)
   - [catalog-service](core/catalog-service.md)
   - [workflow-service](core/workflow-service.md)
   - [notification-service](core/notification-service.md)
   - [document-service](core/document-service.md)
5. ERP
   - [procurement-service](erp/procurement-service.md) — **MVP**
   - [finance-service](erp/finance-service.md) — F2+
   - [accounting-service](erp/accounting-service.md) — F1
   - [treasury-service](erp/treasury-service.md) — F1
   - [inventory-service](erp/inventory-service.md) — F2
   - [hr-service](erp/hr-service.md) — F1 parcial
   - [payroll-service](erp/payroll-service.md) — OUT-F1
6. GRP
   - [budget-service](grp/budget-service.md) — **MVP**
   - [transparency-service](grp/transparency-service.md) — F2
   - [citizen-service](grp/citizen-service.md) — OUT-F1
   - [social-program-service](grp/social-program-service.md) — OUT-F1
   - [tax-service](grp/tax-service.md) — OUT-F1

## Nota de naming

| Nombre en este catálogo | Bounded Context DDD | Nota |
|-------------------------|---------------------|------|
| `procurement-service` (ERP) | Purchasing / P2P | Compras operativas (requisición→OC→recepción→factura) |
| Contrataciones públicas (GRP) | Public Procurement | **No** listado en este lote; F2+ como servicio futuro `public-procurement-service` |

> Los ficheros previos en `docs/microservices/*.md` quedan como borrador; **prevalece SA-MS-001**.
