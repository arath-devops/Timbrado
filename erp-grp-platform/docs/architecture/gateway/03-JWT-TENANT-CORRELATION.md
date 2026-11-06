# 3. JWT Validation · Tenant · CorrelationId
## SA-GW-001

## 3.1 JWT Validation (Gateway)

### Rutas públicas (sin JWT)

- `POST /api/v1/iam/oauth2/token`
- `GET /api/v1/iam/oauth2/jwks`
- Health endpoints del gateway

### Rutas protegidas

Todas las demás del §2.2.

### Validaciones obligatorias en edge

| Check | Acción si falla |
|-------|-----------------|
| Header `Authorization: Bearer` presente | 401 `UNAUTHORIZED` |
| Firma JWT vs JWKS IAM (cache JWKS TTL 5–15 min) | 401 |
| `exp` / `nbf` / `iat` razonables | 401 |
| `iss` allowlist del plane | 401 |
| `aud` si se emite | 401 |
| Claim `tenant_id` presente (UUID) | 401 |
| Claim `sub` presente | 401 |
| Algoritmo allowlist (p.ej. RS256) | 401 |

### Lo que el Gateway **no** hace en Sprint 1

- Evaluar ABAC de monto  
- Comprobar OrgScope contra body  
- Introspección opaca en cada request (JWT autosuficiente + JWKS)

Los Resource Servers **revalidan** JWT (defense in depth) y aplican roles.

### Caché JWKS

```text
Source: http://iam-service/oauth2/jwks  (cluster DNS)
TTL: 300s
Refresh ahead: on unknown kid → fetch once
Circuit: if JWKS down → 503 for protected routes (fail closed)
```

---

## 3.2 Tenant Propagation

### Fuente de verdad

| Ambiente | Fuente |
|----------|--------|
| int / prod | Claim JWT `tenant_id` **únicamente** |
| local/dev | JWT; `X-Tenant-Id` solo si no contradice claim |

### Headers hacia upstream

El gateway **inyecta** (o sobrescribe) para que el servicio no dependa del cliente:

| Header | Valor | Obligatorio upstream |
|--------|-------|----------------------|
| `Authorization` | Bearer original (forward) | Sí |
| `X-Tenant-Id` | `jwt.tenant_id` | Sí (inyectado por GW; RS usa claim preferente) |
| `X-Tenant-Code` | `jwt.tenant_code` si existe | No |
| `X-Plane` | `jwt.plane` si existe | No |

**Regla:** si el cliente envía `X-Tenant-Id` distinto del JWT en int/prod → **403** `TENANT_HEADER_MISMATCH` (o strip silencioso — **preferir 403** para detectar bugs).

### Módulo gate (opcional Sprint 1)

Si claim `modules` no contiene el módulo de la ruta, gateway puede devolver 403 `MODULE_DISABLED`:

| Path prefix | Module code |
|-------------|-------------|
| `/api/v1/document` | `core.document` |
| `/api/v1/workflow` | `core.workflow` (o implícito core) |
| `/api/v1/catalog` | `core.catalog` |
| `/api/v1/audit` | `core.audit` |
| `/api/v1/procurement` | `erp.procurement` |
| `/api/v1/budget` | `grp.budget` |
| `/api/v1/iam` | siempre (identidad) |

MVP: gate de módulos **Should**; si no implementado, RS valida.

---

## 3.3 CorrelationId · RequestId · TraceId

### Entrada (cliente → gateway)

| Header | Si falta | Si presente |
|--------|----------|-------------|
| `X-Correlation-Id` | GW genera UUID v4 | Validar UUID; si inválido → 400 o regenerar (preferir **400** en int) |
| `X-Request-Id` | GW genera UUID v4 | Echo + forward |
| `traceparent` | GW inicia span OTel | Continuar trace |
| `X-Trace-Id` | Derivar de trace | Echo |

### Salida (gateway → cliente)

Siempre echo:

- `X-Correlation-Id`
- `X-Request-Id`
- `X-Trace-Id` (si aplica)

### Forward (gateway → upstream)

Mismos headers + OTel propagation.  
Upstream debe devolverlos; gateway no los pierde en error paths.

### Logs gateway (mínimo)

```text
timestamp, level, method, path, status, latencyMs,
tenantId, sub, correlationId, requestId, traceId, upstream
```

---

## 3.4 Idempotency-Key

| Acción gateway | Detalle |
|----------------|---------|
| Forward | Pasar `Idempotency-Key` sin modificar |
| No store | El store de idempotencia vive en el servicio |
| Validate | Si presente y no UUID → 400 `INVALID_IDEMPOTENCY_KEY` (opcional estricto) |
