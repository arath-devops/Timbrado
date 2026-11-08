# 5. Error Handling
## SA-GW-001

## 5.1 Formato canónico (edge)

Alineado a API-001 `ApiError`:

```json
{
  "code": "UNAUTHORIZED",
  "message": "Missing or invalid bearer token",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "correlationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "requestId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "details": []
}
```

Headers de error también llevan `X-Correlation-Id`, `X-Request-Id`, `X-Trace-Id`.

## 5.2 Errores generados por el Gateway

| HTTP | code | Cuándo |
|------|------|--------|
| 400 | `VALIDATION_ERROR` | Correlation-Id / Idempotency-Key inválidos |
| 401 | `UNAUTHORIZED` | Sin/invalid JWT |
| 403 | `FORBIDDEN` | TENANT_HEADER_MISMATCH / MODULE_DISABLED |
| 404 | `ROUTE_NOT_FOUND` | Path no mapeado |
| 413 | `PAYLOAD_TOO_LARGE` | Body > límite ruta |
| 429 | `RATE_LIMIT_EXCEEDED` | Cupo agotado |
| 502 | `BAD_GATEWAY` | Upstream respuesta inválida |
| 503 | `UPSTREAM_UNAVAILABLE` | Circuit open / JWKS down / no instances |
| 504 | `GATEWAY_TIMEOUT` | Upstream timeout |

## 5.3 Errores del upstream

| Política | Detalle |
|----------|---------|
| Pass-through | Si upstream responde `ApiError` JSON bien formado → **reenviar** status + body |
| Wrap | Si upstream 5xx sin body estándar → envolver en ApiError `UPSTREAM_ERROR` con status 502/503 |
| No filtrar | No eliminar `code` de negocio (`INSUFFICIENT_FUNDS`) |

## 5.4 Matriz ejemplos

| Escenario | Status | code |
|-----------|--------|------|
| Login sin password | 400 (upstream) | pass-through |
| API budget sin token | 401 | `UNAUTHORIZED` |
| X-Tenant-Id ≠ JWT | 403 | `FORBIDDEN` |
| Commit timeout | 504 | `GATEWAY_TIMEOUT` |
| Rate limit upload | 429 | `RATE_LIMIT_EXCEEDED` |
| Path `/api/v1/unknown` | 404 | `ROUTE_NOT_FOUND` |

## 5.5 Qué no hacer

- No devolver stack traces al cliente  
- No incluir tokens en `message`  
- No mapear `INSUFFICIENT_FUNDS` a 500  
