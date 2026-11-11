# Documentación de producto ERP
## ERP-DOC-001

| Campo | Valor |
|-------|--------|
| Suite | **Solo ERP** empresarial (capa privada / comercial) |
| Rama de trabajo | `feat-ERP` |
| Idioma de trabajo | **Español** (nombres técnicos de campos/APIs se conservan en inglés como identificadores) |
| Entradas | DDD-PORT-001 · SA-MS-001 · referentes de mercado solo como benchmark |
| Fuera de este hilo | **GRP** (presupuesto público, CONAC, ciudadano, etc.) y cualquier alcance “tipo SAP suite completa” se trabajan en **ramas/docs aparte** — no mezclar pantallas ni servicios |

## Contenido

1. [Inventario de pantallas ERP](01-ERP-SCREEN-INVENTORY.md) — **ERP-SI-001**
2. [Matriz de campos y reglas](02-ERP-FIELD-MATRIX.md) — **ERP-FM-001**
3. [Revisión ejecutiva de brechas](03-ERP-EXECUTIVE-GAP-REVIEW.md) — **ERP-XR-001**
4. [Revisión UX del preview por roles](04-ERP-PREVIEW-UX-ROLE-REVIEW.md) — **ERP-UX-001**
5. [Congelamiento de alcance MVP](05-ERP-SCOPE-FREEZE-MVP.md) — **ERP-SF-001** *(VoBo 2026-11-07)*
6. [Paquete de control MVP](06-ERP-MVP-CONTROL-PACK.md) — **ERP-CP-001** *(fusionado en FM §19)*
7. [Glosario para desarrollo](07-GLOSARIO-ERP-DESARROLLO.md) — **ERP-GL-001**
8. [Acoplamiento pre-desarrollo](08-ERP-ACOPLAMIENTO-PRE-DESARROLLO.md) — **ERP-AC-001** *(bloqueantes cerrados)*
9. [Mapa de servicios ERP](09-MAPA-SERVICIOS-ERP.md) — **ERP-MS-001**
10. [Eventos ERP MVP](10-EVENTOS-ERP-MVP.md) — **ERP-EV-001**
11. [Workflows ERP MVP](11-WORKFLOWS-ERP-MVP.md) — **ERP-WF-001**
12. [Casos SoD](12-SOD-CASOS-PRUEBA.md) — **ERP-SOD-001**
13. [Config seed ACME](13-CONFIG-SEED-ACME.md) — **ERP-CFG-001**
14. Demo visual HTML: [`../erp-preview/`](../erp-preview/) (rama `feat-ERP`)
15. ADR desacople budget: [ADR-014](../adr/ADR-014-erp-sin-budget-grp.md)
16. OpenAPI ERP: [`shared/openapi/erp/`](../../shared/openapi/erp/)
17. **Dossier técnico (PDF):** [ERP-DOSSIER-001](entregables/ERP-DOSSIER-001-Sistema-ERP.pdf) — descripción, alcance, metas, arquetipo y entregables
18. [Diagrama microservicios por fases](14-DIAGRAMA-MICROSERVICIOS-FASES.md) — **ERP-ARCH-DIAG-001**
19. [Catálogos configurables](15-CATALOGOS-CONFIGURABLES-ERP.md) — **ERP-CAT-001**
20. [Briefing IA — esquema BD modular](16-BRIEFING-AI-ESQUEMA-BD-MODULAR.md) — **ERP-DB-BRIEF-001**

## Cómo leer estos documentos

| Documento | Para qué sirve |
|-----------|----------------|
| SI-001 | Qué pantallas existen y en qué prioridad (MVP / Profesional / Empresarial) |
| FM-001 | Qué campos van en cada pantalla + validaciones |
| XR-001 | Qué faltaba según CFO/Controller/etc. antes de diseñar |
| UX-001 | Hallazgos del HTML demo por rol de usuario |
| SF-001 | Qué entra y qué no en el primer release (congelado) |
| CP-001 | Controles financieros obligatorios (crédito, match, dual control…) |
| GL-001 | Traducción de términos EN↔ES para el equipo |
| AC-001 | Checklist pre-dev; bloqueantes vs ámbar |
| MS/EV/WF/SOD/CFG | Contratos de servicios, eventos, flujos, SoD y seed para implementar |

Los **códigos** (`legal_entity_id`, `PO_APPROVAL`, estados `POSTED`) se dejan en inglés porque serán nombres de API/BD; en UI y en prosa de negocio usamos español.
