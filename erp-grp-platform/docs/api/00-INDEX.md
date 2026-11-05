# API Architecture — Contratos OpenAPI MVP
## API-001

| Campo | Valor |
|-------|--------|
| Documento | API-001 |
| Rol | Principal API Architect |
| Estado | Contratos listos para implementación |
| Formato | OpenAPI **3.1** YAML |
| Ubicación | `shared/openapi/` |

## Specs

Ver [shared/openapi/README.md](../../shared/openapi/README.md).

| Servicio | Path |
|----------|------|
| Common | `shared/openapi/common/v1.yaml` |
| IAM | `shared/openapi/iam/v1.yaml` |
| Catalog | `shared/openapi/catalog/v1.yaml` |
| Audit | `shared/openapi/audit/v1.yaml` |
| Workflow | `shared/openapi/workflow/v1.yaml` |
| Document | `shared/openapi/document/v1.yaml` |
| Procurement | `shared/openapi/procurement/v1.yaml` |
| Budget | `shared/openapi/budget/v1.yaml` |

## Decisiones de contrato

1. **Versionado:** recursos bajo `/api/v1`; breaking change → `/api/v2`.
2. **Tenant:** claim JWT `tenant_id`; `X-Tenant-Id` solo local/dev.
3. **Correlation / Request / Trace:** `X-Correlation-Id`, `X-Request-Id`, `X-Trace-Id` + `traceparent`.
4. **Idempotencia:** `Idempotency-Key` obligatorio en commit/release, start process, complete task, ingest audit, submit/cancel OC.
5. **Dinero:** montos como **string decimal** (no float JSON).
6. **Errores:** `ApiError` común.
7. **Paginación:** `page` 0-based, `size` ≤ 100, `PageMeta`.

## Fuera de estos contratos (Scope Freeze)

MFA/SSO completo, OCR/firma avanzada, accrue/pay, GR/factura, notification productivo.
