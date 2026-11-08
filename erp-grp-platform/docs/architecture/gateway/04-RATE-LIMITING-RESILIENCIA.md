# 4. Rate limiting y resiliencia
## SA-GW-001

## 4.1 Rate limiting

### Dimensiones

| Key | Uso |
|-----|-----|
| `ip` | Rutas públicas (login, jwks) |
| `tenant_id` | Rutas autenticadas |
| `tenant_id + routeGroup` | Presupuesto/commit, uploads |
| `sub` (user) | Anti-abuso inbox/complete |

Algoritmo sugerido: **token bucket** / sliding window en Redis del plane.

### Cupos MVP (dedicated plane — un tenant)

| Ruta / grupo | Límite | Ventana | Código overflow |
|--------------|--------|---------|-----------------|
| `POST .../iam/oauth2/token` | 20 req | 1 min / IP | 429 |
| `GET .../iam/oauth2/jwks` | 120 req | 1 min / IP | 429 |
| Default autenticado | 600 req | 1 min / tenant | 429 |
| `POST .../budget/movements/**` | 60 req | 1 min / tenant | 429 |
| `POST .../document/**` (upload) | 30 req | 1 min / tenant | 429 |
| `POST .../workflow/tasks/*/complete` | 120 req | 1 min / tenant | 429 |
| Burst login failure | 10 fail | 5 min / IP | 429 + lockout hint |

Shared plane futuro: cupos más bajos por tenant + fair sharing.

### Headers de respuesta rate limit

```text
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 542
X-RateLimit-Reset: 1730832000
Retry-After: 30   (en 429)
```

---

## 4.2 Resiliencia

| Control | Política |
|---------|----------|
| Timeouts | Ver §2.6 rutas |
| Retry upstream | **Solo** GET/HEAD idempotentes; max 1 retry; **nunca** retry POST commit/upload/token automáticamente |
| Circuit breaker | Por upstream; open → 503 `UPSTREAM_UNAVAILABLE` |
| Bulkhead | Conexiones máximas por servicio |
| Load balance | Round-robin K8s Service |

## 4.3 Seguridad edge adicional

| Control | MVP |
|---------|-----|
| TLS 1.2+ | Sí en ingress |
| Max request size | Por ruta (§2.5) |
| Block TRACE | Sí |
| Security headers | `X-Content-Type-Options nosniff`, etc. en respuestas edge |
| IP allowlist admin audit | Opcional plane dedicado |
