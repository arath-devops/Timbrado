# 2. Rutas y versionado
## SA-GW-001

## 2.1 Versionado

| Regla | Detalle |
|-------|---------|
| Prefijo público | `/api/v1` |
| Breaking change | Nuevo prefijo `/api/v2` en gateway **y** servicios |
| Additive (no breaking) | Misma `/api/v1` |
| Deprecation | Header `Deprecation` / `Sunset` en v1 cuando exista v2 (post-MVP) |
| Actuator servicios | **No** exponer `/actuator/**` de upstream al público (solo probe internos) |
| OpenAPI agregada | Opcional Sprint 1: `/api/v1/openapi/{service}` → upstream `/v3/api-docs` (protegido ADMIN o red interna) |

El **nombre de servicio en el path** (`/iam`, `/catalog`, …) es responsabilidad del **gateway**, no del OpenAPI interno del microservicio.

## 2.2 Tabla de rutas MVP

| # | Public path | Upstream service | Rewrite | AuthN gateway | Notas |
|---|-------------|------------------|---------|---------------|-------|
| 1 | `/api/v1/iam/oauth2/token` | `iam-service` | → `/oauth2/token` | **Público** | Login |
| 2 | `/api/v1/iam/oauth2/jwks` | `iam-service` | → `/oauth2/jwks` | **Público** | JWKS (cacheable) |
| 3 | `/api/v1/iam/**` | `iam-service` | strip `/api/v1/iam` → `/api/v1/**` o map ver §2.3 | JWT | users, roles, scopes, me |
| 4 | `/api/v1/catalog/**` | `catalog-service` | strip → servicio `/api/v1/**` | JWT | |
| 5 | `/api/v1/audit/**` | `audit-service` | strip → `/api/v1/**` | JWT | M2M/admin |
| 6 | `/api/v1/workflow/**` | `workflow-service` | strip → `/api/v1/**` | JWT | |
| 7 | `/api/v1/document/**` | `document-service` | strip → `/api/v1/**` | JWT | multipart upload |
| 8 | `/api/v1/procurement/**` | `procurement-service` | strip → `/api/v1/**` | JWT | |
| 9 | `/api/v1/budget/**` | `budget-service` | strip → `/api/v1/**` | JWT | |
| 10 | `/health` o `/api/v1/gateway/health` | gateway | local | Público | liveness gateway |
| 11 | `/ready` | gateway | local + deps opcionales | Público/interno | readiness |

## 2.3 Mapeo explícito IAM (ejemplos)

| Cliente llama | Upstream iam-service |
|---------------|----------------------|
| `POST /api/v1/iam/oauth2/token` | `POST /oauth2/token` |
| `GET /api/v1/iam/oauth2/jwks` | `GET /oauth2/jwks` |
| `GET /api/v1/iam/users` | `GET /api/v1/users` |
| `POST /api/v1/iam/users` | `POST /api/v1/users` |
| `GET /api/v1/iam/me` | `GET /api/v1/me` |
| `GET /api/v1/iam/me/menus` | `GET /api/v1/me/menus` |
| `POST /api/v1/iam/scopes` | `POST /api/v1/scopes` |

## 2.4 Mapeo resto de servicios (patrón)

```text
GET  /api/v1/catalog/catalogs/{type}/items     → GET  /api/v1/catalogs/{type}/items
POST /api/v1/workflow/processes/PO_APPROVAL/start → POST /api/v1/processes/PO_APPROVAL/start
POST /api/v1/document/case-files              → POST /api/v1/case-files
POST /api/v1/budget/movements/commit          → POST /api/v1/movements/commit
POST /api/v1/procurement/purchase-orders      → POST /api/v1/purchase-orders
POST /api/v1/audit/facts                      → POST /api/v1/facts
```

## 2.5 Métodos y CORS

| Tema | Política MVP |
|------|----------------|
| Métodos | Los del OpenAPI upstream; gateway no bloquea verbos salvo TRACE |
| CORS | Si hay UI browser: origins allowlist del plane; `Authorization`, `X-Correlation-Id`, `X-Request-Id`, `Idempotency-Key`, `Content-Type` |
| Max body | Document upload: **21MB** (20MB file + margin); resto **2MB** default |

## 2.6 Timeouts por ruta (sugeridos)

| Grupo | Connect | Response |
|-------|---------|----------|
| Default | 2s | 10s |
| `budget/movements/*` | 2s | 3s |
| `document/**` upload | 5s | 60s |
| `iam/oauth2/token` | 2s | 5s |
| `workflow/**` | 2s | 10s |
