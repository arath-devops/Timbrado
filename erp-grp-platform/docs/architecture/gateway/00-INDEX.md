# API Gateway MVP
## SA-GW-001

| Campo | Valor |
|-------|--------|
| Documento | SA-GW-001 |
| Rol | Solution Architect |
| Componente | `gateway-service` (edge) |
| Estado | Especificación completa (sin implementación nueva en este entregable) |
| Entradas | API-001, CA-TEN-001, BL-S1-001, BL-S1-CORE-001, DoD-001, SA-MS-001 |
| Stack sugerido | Spring Cloud Gateway **o** Kong/APISIX equivalente — contrato idéntico |

## Contenido

1. [Visión, principios y responsabilidades](01-VISION-PRINCIPIOS.md)
2. [Rutas y versionado](02-RUTAS-VERSIONADO.md)
3. [JWT, Tenant, CorrelationId](03-JWT-TENANT-CORRELATION.md)
4. [Rate limiting y resiliencia](04-RATE-LIMITING-RESILIENCIA.md)
5. [Error handling](05-ERROR-HANDLING.md)
6. [Especificación operativa completa](06-SPEC-COMPLETA.md)

## Decisión de enrutamiento

```text
Público (cliente):     /api/v1/{service}/**
Upstream (microservicio): paths OpenAPI del servicio (sin prefijo de nombre)
Rewrite: strip /api/v1/{service}  →  reenviar path restante al upstream
Excepción OAuth: /api/v1/iam/oauth2/** → iam /oauth2/**
```
