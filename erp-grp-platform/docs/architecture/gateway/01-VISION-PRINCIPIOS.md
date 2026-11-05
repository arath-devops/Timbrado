# 1. Visión y principios
## SA-GW-001

## 1.1 Propósito

El API Gateway es el **único punto de entrada HTTPS** del Data Plane hacia los microservicios MVP. Centraliza:

- Enrutamiento versionado  
- Validación JWT (salvo rutas públicas de login/JWKS)  
- Propagación de `tenant_id` / correlación / trace  
- Rate limiting  
- Normalización de errores de edge  
- TLS termination (o passthrough según plane)

**No** es dueño de reglas de negocio de Budget/Procurement ni de ABAC de monto.

## 1.2 Responsabilidades

| IN (Gateway) | OUT (Gateway) |
|--------------|---------------|
| Path routing + rewrite | Autorización fina de dominio (roles de negocio en RS) |
| JWT signature/exp/iss/aud + presencia `tenant_id` | CommitBudget / workflows |
| Inyectar/ forear correlation headers | Persistencia |
| Rate limit por IP / tenant / ruta | Transformaciones de body de negocio |
| Timeouts / retries idempotentes selectivos | Agregación BFF compleja (Sprint 1: no) |
| Health agregado edge | MFA/SSO (excluido) |

## 1.3 Principios

1. **Stateless** — sin sesión de servidor en el gateway.  
2. **Pass-through body** — no reescribe payloads de negocio.  
3. **Defense in depth** — JWT en gateway **y** Resource Server.  
4. **Tenant from JWT only** (prod/int) — CA-TEN-001.  
5. **Fail closed** — sin token en ruta protegida → 401.  
6. **Observability first** — todo request con `correlationId` + `traceId` en logs.

## 1.4 Topología piloto

```text
Client → Ingress TLS → gateway-service → ClusterIP services
                              │
                              ├─ iam-service
                              ├─ catalog-service
                              ├─ audit-service
                              ├─ workflow-service
                              ├─ document-service
                              ├─ procurement-service
                              └─ budget-service
```

Dedicated Plane: un gateway por plane (mismo chart, distinta config upstream/JWKS).
