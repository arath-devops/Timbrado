# Dossier técnico de proyecto — Sistema ERP
## ERP-DOSSIER-001

| Campo | Valor |
|-------|--------|
| Nombre del proyecto | **Sistema ERP** |
| Documento | ERP-DOSSIER-001 |
| Track | `feat-ERP` |
| Congelamiento | ERP-SF-001 (VoBo 2026-11-07) |
| PDF | [ERP-DOSSIER-001-Sistema-ERP.pdf](ERP-DOSSIER-001-Sistema-ERP.pdf) |
| Generador | `generar-dossier-tecnico-pdf.py` |

> Resumen ejecutivo para stakeholders e ingeniería **antes** de iniciar el desarrollo.  
> Detalle normativo: SF / CP / FM / MS / OpenAPI.

---

## 1. Descripción

Plataforma ERP comercial (México primero) que cubre **P2P + O2C ligero + finanzas + inventario básico + plataforma** (IAM, WF, docs, audit, catálogos).  
**No** incluye GRP/presupuesto público ni suite SAP completa (ADR-014).

## 2. Metas

- Cerrar ciclo P2P y O2C ligero en UAT ACME  
- Controles CP (crédito, match, dual pago, park/post)  
- SoD SOD-T01…T06 en verde  
- Contratos OpenAPI ERP + eventos sin `budget-service`

## 3. Alcance

**IN:** ver ERP-SF-001 §3.  
**OUT:** nómina release-1, WMS/TMS/MFG, GRP/CONAC, budget-service.

## 4. Entregables

Servicios ERP-MS-001, OpenAPI `shared/openapi/erp/`, Angular Object Pages Freeze, seeds ACME, UAT por rol. Preview HTML = especificación UX, no front final.

## 5. Arquetipo

Java 21 · Spring Boot 3.3 · PostgreSQL · Kafka · Redis · Gateway · Docker/K8s/Helm (ARCH-MVP-001), track ERP sin budget.

## 6. Referencias

ERP-SF-001 · ERP-CP-001 · ERP-MS-001 · ERP-EV/WF/SOD/CFG · ADR-014 · `shared/openapi/erp/` · `erp-preview/modulos/`

---

**Fin ERP-DOSSIER-001** (versión corta; el PDF es el entregable completo).
