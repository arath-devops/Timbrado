# Fase 3 — Catálogo de Microservicios

Total: **32** unidades desplegables.

| Servicio | Capa | Responsabilidad | DB |
|----------|------|-----------------|----|
| `iam-service` | core | Autenticación OIDC/OAuth2, usuarios, roles, MFA, SSO, emisión JWT | `iam_db` |
| `audit-service` | core | Ingesta inmutable de hechos auditables y consulta de trails | `audit_db` |
| `catalog-service` | core | Catálogos maestros multiidioma versionados | `catalog_db` |
| `workflow-service` | core | Motor de aprobaciones y procesos BPMN/DSL | `workflow_db` |
| `notification-service` | core | Email/SMS/Push/In-app multi-canal | `notification_db` |
| `report-service` | core | Generación de reportes, export y datasets BI | `report_db` |
| `configuration-service` | core | Feature flags, parámetros por tenant | `configuration_db` |
| `tenant-service` | core | Ciclo de vida de tenants, licencias y onboarding | `tenant_db` |
| `finance-service` | erp | Centros de costo, periodos, tipos de cambio, control financiero | `finance_db` |
| `accounting-service` | erp | Plan de cuentas, asientos, balanzas, periodos fiscales | `accounting_db` |
| `treasury-service` | erp | Cuentas bancarias, pagos, cobros, conciliación | `treasury_db` |
| `purchasing-service` | erp | Requisiciones, OC, recepciones, 3-way match | `purchasing_db` |
| `supplier-service` | erp | Maestro de proveedores y evaluación | `supplier_db` |
| `sales-service` | erp | Cotizaciones, pedidos y facturación comercial | `sales_db` |
| `inventory-service` | erp | Existencias, movimientos, valuación | `inventory_db` |
| `logistics-service` | erp | Embarques, rutas y entregas | `logistics_db` |
| `hr-service` | erp | Empleados, plazas, contratos, organigrama | `hr_db` |
| `payroll-service` | erp | Cálculo, aprobación y cierre de nómina | `payroll_db` |
| `fixed-assets-service` | erp | Alta, depreciación y baja de activos | `fixed_assets_db` |
| `crm-service` | erp | Leads, oportunidades y cuentas comerciales | `crm_db` |
| `project-service` | erp | Proyectos, WBS, avance y costos | `project_db` |
| `budget-service` | grp | Ciclo presupuestario, partidas y momentos contables | `budget_db` |
| `tax-service` | grp | Padrón, liquidaciones y pagos de contribuciones | `tax_db` |
| `social-program-service` | grp | Padrones y beneficios de programas sociales | `social_program_db` |
| `transparency-service` | grp | Obligaciones de transparencia y publicación | `transparency_db` |
| `oversight-service` | grp | Auditorías, observaciones y seguimiento | `oversight_db` |
| `procurement-service` | grp | Procedimientos de contratación pública | `procurement_db` |
| `citizen-service` | grp | Ciudadanos, trámites y citas | `citizen_db` |
| `electronic-file-service` | grp | Expediente electrónico y actuaciones | `electronic_file_db` |
| `document-service` | grp | Gestión documental, versiones y firma | `document_db` |
| `gov-control-service` | grp | Controles internos, riesgos y cumplimiento | `gov_control_db` |
| `gateway-service` | edge | API Gateway: routing, authn relay, rate limit, BFF hooks | `n/a (stateless)` |

Cada servicio tiene ficha en `docs/microservices/<nombre>.md`.

## Convenciones
- Prefijo API: `/api/v1`
- Health: `/actuator/health/{liveness|readiness}`
- DB-per-service (PostgreSQL)
- Outbox obligatorio para eventos de negocio
- TenantId en JWT + columna/RLS
