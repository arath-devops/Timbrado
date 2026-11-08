# 4. JWT Claims, Tenant Resolution y Propagación
## CA-TEN-001

## 4.1 JWT Access Token — claims obligatorios

```json
{
  "iss": "https://iam.{plane}.erp-grp.local",
  "sub": "user-uuid",
  "sid": "session-uuid",
  "tenant_id": "tenant-uuid",
  "tenant_code": "MUN-X",
  "preferred_username": "jperez",
  "roles": ["PUR_CLERK", "PUR_DIRECTOR"],
  "org_scopes": [
    { "type": "OU_SUBTREE", "orgUnitId": "ou-uuid" }
  ],
  "modules": ["core.document", "erp.procurement", "grp.budget"],
  "plane": "DEDICATED",
  "amr": ["pwd"],
  "iat": 0,
  "exp": 0
}
```

| Claim | Obligatorio | Uso |
|-------|-------------|-----|
| `tenant_id` | **Sí** | Aislamiento de datos / RLS |
| `tenant_code` | Recomendado | Logs humanos / routing host |
| `sub` | Sí | Actor / audit |
| `roles` | Sí | AuthZ |
| `org_scopes` | Sí (operativos) | ABAC org |
| `modules` | Sí | Feature gates |
| `plane` | Recomendado | `SHARED` \| `DEDICATED` |
| `sid` | Sí | Revocación sesión |

**Prohibido:** emitir token sin `tenant_id`.  
**Prohibido en prod:** aceptar `tenant_id` de body/query que difiera del JWT.

---

## 4.2 Tenant Resolution

### Orden de resolución

| Fase | Fuente | Cuándo |
|------|--------|--------|
| A. Pre-auth (login) | `tenant_code` en form / host subdomain / IdP hint | Solo para seleccionar tenant del password grant |
| B. Token issue | IAM resuelve tenant ACTIVE y embebe `tenant_id` | Obligatorio |
| C. Resource Server | **Solo** claim JWT `tenant_id` | Toda API de negocio |
| D. Dev/local | `X-Tenant-Id` si y solo si perfil `local` y no hay mismatch | Nunca en int/prod |
| E. M2M | Client credentials con `tenant_id` fijo o claim de client | Jobs in-tenant |

### Algoritmo Resource Server

```text
1. Validate JWT (sign, exp, iss, aud)
2. tenantId = claim.tenant_id
3. if missing → 401
4. if Tenant.status != ACTIVE → 403 TENANT_SUSPENDED
5. if header X-Tenant-Id present AND env in {int,prod} → ignore OR 400 if differs
6. if header X-Tenant-Id present AND env=local AND differs from claim → 403
7. bind TenantContext(tenantId, tenantCode, plane, modules, roles, sub, correlationId)
8. open TX → set_config('app.tenant_id', tenantId, true)
9. proceed
```

### Login (password grant)

```text
POST /oauth2/token
  grant_type=password
  username, password
  tenant_id | tenant_code   ← requerido en MVP multi-capable
```

IAM valida usuario **dentro** de ese tenant; no autenticación cross-tenant.

---

## 4.3 Propagación entre servicios

### HTTP síncrono (servicio → servicio)

| Mecanismo | Detalle |
|-----------|---------|
| Forward JWT usuario | Preferido en request user-driven (OAuth2 token relay) |
| M2M + impersonation claim | Solo si no hay usuario; incluir `tenant_id` en token de cliente |
| Headers de correlación | `X-Correlation-Id`, `X-Request-Id`, `traceparent` |
| No reenviar | `X-Tenant-Id` como fuente de verdad |

Receptor **siempre** revalida JWT/JWKS y re-setea RLS; no confía en el caller.

### Kafka

Envelope EDA-MVP ya incluye `tenantId`:

```text
Producer: copia TenantContext.tenantId → event.tenantId
Consumer:
  1) dedup inbox
  2) set TenantContext from event.tenantId
  3) set_config app.tenant_id
  4) reject if handler forced another tenant
```

### Outbox

Columna `tenant_id` NOT NULL; publisher no altera tenant.

### Object storage

`storage_key = "{tenantId}/{caseFileId}/{documentId}/{filename}"`  
URLs firmadas con path validado contra TenantContext.

### Async jobs / schedulers

Job debe declarar `tenantId` (fan-out por lista de tenants ACTIVE del plane) o correr in-plane dedicated con único tenant.

---

## 4.4 TenantContext (contrato de runtime)

```text
TenantContext {
  tenantId: UUID
  tenantCode: string
  plane: SHARED | DEDICATED
  modules: string[]
  roles: string[]
  userId: UUID | null   // null en algunos M2M
  correlationId: UUID
  requestId: UUID
  traceId: string
}
```

Propagación in-process: ThreadLocal / Reactor Context / Micrometer baggage (`tenant.id`).

---

## 4.5 Pruebas obligatorias de aislamiento

| Test | Esperado |
|------|----------|
| JWT tenant A lee recurso de B | 404/403 (no leak) |
| Sin SET `app.tenant_id` | 0 rows / error (FORCE RLS) |
| Evento tenant A procesado con context B | Reject |
| Login usuario A en tenant B | Fail auth |
| Idempotency-Key reusada cross-tenant | No colisión (UK incluye tenant_id) |
