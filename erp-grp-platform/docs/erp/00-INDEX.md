# Documentación de producto ERP
## ERP-DOC-001

| Campo | Valor |
|-------|--------|
| Suite | ERP empresarial (capa privada / compartida del portafolio) |
| Rama de trabajo | `feat-ERP` |
| Idioma de trabajo | **Español** (nombres técnicos de campos/APIs se conservan en inglés como identificadores) |
| Entradas | DDD-PORT-001 · SA-MS-001 · referentes SAP/Oracle/D365/NetSuite/Infor/Odoo |

## Contenido

1. [Inventario de pantallas ERP](01-ERP-SCREEN-INVENTORY.md) — **ERP-SI-001**
2. [Matriz de campos y reglas](02-ERP-FIELD-MATRIX.md) — **ERP-FM-001**
3. [Revisión ejecutiva de brechas](03-ERP-EXECUTIVE-GAP-REVIEW.md) — **ERP-XR-001**
4. [Revisión UX del preview por roles](04-ERP-PREVIEW-UX-ROLE-REVIEW.md) — **ERP-UX-001**
5. [Congelamiento de alcance MVP](05-ERP-SCOPE-FREEZE-MVP.md) — **ERP-SF-001** *(VoBo 2026-11-07)*
6. [Paquete de control MVP](06-ERP-MVP-CONTROL-PACK.md) — **ERP-CP-001** *(fusionado en FM §19)*
7. [Glosario para desarrollo](07-GLOSARIO-ERP-DESARROLLO.md) — **ERP-GL-001**
8. Demo visual HTML: [`../erp-preview/`](../erp-preview/) (rama `feat-ERP`)

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

Los **códigos** (`legal_entity_id`, `PO_APPROVAL`, estados `POSTED`) se dejan en inglés porque serán nombres de API/BD; en UI y en prosa de negocio usamos español.
