# 6. Especificación operativa completa
## SA-GW-001

Documento único de referencia para implementar `gateway-service`.

---

## 6.1 Identidad del componente

| Campo | Valor |
|-------|--------|
| Nombre | `gateway-service` |
| Tipo | Edge / BFF-light (sin agregación Sprint 1) |
| Protocolo | HTTPS externo · HTTP interno cluster |
| Config | YAML rutas + Redis rate-limit + JWKS URI |

---

## 6.2 Rutas (resumen normativo)

```text
# Público
POST /api/v1/iam/oauth2/token          → iam:/oauth2/token
GET  /api/v1/iam/oauth2/jwks           → iam:/oauth2/jwks
GET  /health                           → local
GET  /ready                            → local

# Protegido JWT
/api/v1/iam/**           → iam-service        (strip /api/v1/iam → /api/v1/** excepto oauth ya mapeado)
/api/v1/catalog/**       → catalog-service
/api/v1/audit/**         → audit-service
/api/v1/workflow/**      → workflow-service
/api/v1/document/**      → document-service
/api/v1/procurement/**   → procurement-service
/api/v1/budget/**        → budget-service
```

Upstream DNS (K8s): `{service}.svc.cluster.local:8080` (puerto estándar).

---

## 6.3 Pipeline de filtros (orden)

```text
1. RequestSizeLimit
2. Generate/Validate CorrelationId + RequestId
3. OpenTelemetry start/continue
4. RateLimit (IP o tenant según ruta)
5. JwtAuth (skip public routes)
6. TenantGuard (mismatch header vs JWT)
7. ModuleGate (optional)
8. Inject headers (X-Tenant-Id from JWT, correlation, trace)
9. Route + Rewrite
10. Upstream call (timeouts)
11. Response: echo correlation headers + rate limit headers
12. ErrorEncoder → ApiError
```

---

## 6.4 Headers — contrato

### Cliente → Gateway

| Header | Requerido | Notas |
|--------|-----------|-------|
| `Authorization` | Sí (protegidas) | Bearer JWT |
| `Content-Type` | Según body | multipart en document |
| `X-Correlation-Id` | No | UUID; se genera si falta |
| `X-Request-Id` | No | UUID |
| `Idempotency-Key` | Según API servicio | Forward |
| `X-Tenant-Id` | No | Solo local; mismatch → 403 en int/prod |
| `traceparent` | No | W3C |

### Gateway → Upstream (inyección)

```text
Authorization: <passthrough>
X-Tenant-Id: <jwt.tenant_id>
X-Tenant-Code: <jwt.tenant_code?>
X-Correlation-Id: <id>
X-Request-Id: <id>
X-Trace-Id: <id>
traceparent: <...>
Idempotency-Key: <passthrough if any>
X-Forwarded-For / X-Forwarded-Proto: standard
```

### Gateway → Cliente (siempre)

```text
X-Correlation-Id
X-Request-Id
X-Trace-Id
X-RateLimit-*   (si aplica)
```

---

## 6.5 JWT — pseudocontrato

```text
jwks_uri: http://iam-service/oauth2/jwks
algorithms: [RS256]
required_claims: [sub, tenant_id, exp, iat, iss]
issuer: ${PLANE_ISS_ALLOWLIST}
```

---

## 6.6 Rate limits (tabla operativa)

Ver [04-RATE-LIMITING-RESILIENCIA.md](04-RATE-LIMITING-RESILIENCIA.md). Redis key examples:

```text
rl:ip:{ip}:login
rl:tenant:{tenantId}:default
rl:tenant:{tenantId}:budget-commit
rl:tenant:{tenantId}:doc-upload
```

---

## 6.7 Errores edge

Ver [05-ERROR-HANDLING.md](05-ERROR-HANDLING.md). Schema `ApiError` obligatorio en fallos de gateway.

---

## 6.8 Configuración ejemplo (Spring Cloud Gateway style)

```yaml
spring:
  cloud:
    gateway:
      httpclient:
        connect-timeout: 2000
        response-timeout: 10s
      default-filters:
        - name: RequestSize
        - name: CorrelationId
        - name: TenantInjection
      routes:
        - id: iam-token
          uri: http://iam-service:8080
          predicates:
            - Path=/api/v1/iam/oauth2/token
            - Method=POST
          filters:
            - RewritePath=/api/v1/iam/oauth2/token, /oauth2/token
            - name: RateLimit
              args: { key: ip, limit: 20, window: 60s }
          metadata: { public: true }

        - id: iam-jwks
          uri: http://iam-service:8080
          predicates:
            - Path=/api/v1/iam/oauth2/jwks
          filters:
            - RewritePath=/api/v1/iam/oauth2/jwks, /oauth2/jwks
          metadata: { public: true }

        - id: iam-api
          uri: http://iam-service:8080
          predicates:
            - Path=/api/v1/iam/**
          filters:
            - name: JwtAuth
            - RewritePath=/api/v1/iam/(?<seg>.*), /api/v1/$\{seg}

        - id: catalog-api
          uri: http://catalog-service:8080
          predicates:
            - Path=/api/v1/catalog/**
          filters:
            - name: JwtAuth
            - RewritePath=/api/v1/catalog/(?<seg>.*), /api/v1/$\{seg}

        - id: audit-api
          uri: http://audit-service:8080
          predicates:
            - Path=/api/v1/audit/**
          filters:
            - name: JwtAuth
            - RewritePath=/api/v1/audit/(?<seg>.*), /api/v1/$\{seg}

        - id: workflow-api
          uri: http://workflow-service:8080
          predicates:
            - Path=/api/v1/workflow/**
          filters:
            - name: JwtAuth
            - RewritePath=/api/v1/workflow/(?<seg>.*), /api/v1/$\{seg}

        - id: document-api
          uri: http://document-service:8080
          predicates:
            - Path=/api/v1/document/**
          filters:
            - name: JwtAuth
            - name: RequestSize
              args: { max: 21MB }
            - RewritePath=/api/v1/document/(?<seg>.*), /api/v1/$\{seg}
          metadata: { responseTimeout: 60s }

        - id: procurement-api
          uri: http://procurement-service:8080
          predicates:
            - Path=/api/v1/procurement/**
          filters:
            - name: JwtAuth
            - RewritePath=/api/v1/procurement/(?<seg>.*), /api/v1/$\{seg}

        - id: budget-api
          uri: http://budget-service:8080
          predicates:
            - Path=/api/v1/budget/**
          filters:
            - name: JwtAuth
            - RewritePath=/api/v1/budget/(?<seg>.*), /api/v1/$\{seg}
          metadata: { responseTimeout: 3s }
```

> Referencia ilustrativa; la implementación puede usar filtros custom con los mismos contratos.

---

## 6.9 Criterios de aceptación (Gateway Done)

1. Login vía `/api/v1/iam/oauth2/token` sin JWT.  
2. Llamada a `/api/v1/budget/availability` sin JWT → 401 ApiError.  
3. Con JWT válido, rewrite correcto a OpenAPI upstream.  
4. `X-Correlation-Id` echo en éxito y error.  
5. `X-Tenant-Id` inyectado = claim; mismatch cliente → 403.  
6. Rate limit login dispara 429 con `Retry-After`.  
7. Upload document 21MB edge; > límite → 413.  
8. `/actuator` de servicios **no** público.  
9. Timeout budget commit → 504.  
10. Logs con tenantId + correlationId + path + status.

## 6.10 Relación con otros docs

| Doc | Relación |
|------|----------|
| API-001 OpenAPI | Paths upstream post-rewrite |
| CA-TEN-001 | Tenant claims / RLS en servicios |
| DoD-001 | Security/observability del edge |
| SAGA-MVP-001 | Clientes usan rutas gateway en E2E |
