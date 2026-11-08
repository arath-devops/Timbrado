# OpenAPI 3.1 — Contratos MVP

| Campo | Valor |
|-------|--------|
| Estándar | OpenAPI **3.1** |
| Versión API | `/api/v1` |
| Alcance | Core plataforma + track **ERP** (ERP-SF-001) + legado GRP |
| Estado | Contratos listos para implementación |

## Track ERP (usar estos para desarrollo ERP)

Contratos canónicos: **[erp/README.md](erp/README.md)** — ADR-014 (sin budget).

| Servicio | Spec |
|----------|------|
| Common (headers, errores, paginación, `X-Legal-Entity-Id`) | [common/v1.yaml](common/v1.yaml) |
| iam / catalog / audit / workflow / document | specs en carpetas homónimas |
| procurement-service **ERP** | [erp/procurement/v1.yaml](erp/procurement/v1.yaml) |
| inventory-service | [erp/inventory/v1.yaml](erp/inventory/v1.yaml) |
| ap-service | [erp/ap/v1.yaml](erp/ap/v1.yaml) |
| ar-billing-service | [erp/ar-billing/v1.yaml](erp/ar-billing/v1.yaml) |
| accounting-service | [erp/accounting/v1.yaml](erp/accounting/v1.yaml) |
| treasury-service | [erp/treasury/v1.yaml](erp/treasury/v1.yaml) |

## Legado / GRP (no usar en feat-ERP)

| Servicio | Spec | Nota |
|----------|------|------|
| procurement-service (acoplado budget) | [procurement/v1.yaml](procurement/v1.yaml) | **Deprecated para ERP** — solo referencia GRP |
| budget-service | [budget/v1.yaml](budget/v1.yaml) | Exclusivo GRP |

## Convenciones transversales

| Tema | Regla |
|------|--------|
| Versionado | Breaking → `/api/v2`; additive fields = minor compatible |
| Auth | `Authorization: Bearer <JWT>` (salvo token/jwks) |
| Tenant | Claim JWT `tenant_id` (fuente de verdad). Header `X-Tenant-Id` solo local/dev |
| Correlation | `X-Correlation-Id` (UUID). Si falta en mutación, el servidor genera y echo |
| Request | `X-Request-Id` (UUID cliente). Echo en response |
| Trace | `traceparent` (W3C) y/o `X-Trace-Id` |
| Idempotencia | `Idempotency-Key` obligatorio en commit/release y comandos marcados |
| Errores | Schema `ApiError` |
| Paginación | `page` (0-based), `size` (default 20, max 100), response `Page*` |

## Referencias

- `docs/delivery/03-SPRINT-1-SCOPE-BASELINE.md`
- `docs/microservices/architecture/03-CONTRATOS-TRANSVERSALES.md`
- `docs/delivery/04-DEFINITION-OF-DONE.md` (API checklist)
