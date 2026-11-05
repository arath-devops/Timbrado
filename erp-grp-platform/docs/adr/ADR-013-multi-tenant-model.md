# ADR-013 — Modelo multi-tenant de datos

| Campo | Valor |
|-------|--------|
| Estado | **Aceptado** |
| Fecha | 2026-11-05 |
| Decisores | Cloud Architect · CTO |
| Relacionado | EA-DEC-001 D-02/D-03 · CA-TEN-001 · DA-MVP-001 |

## Contexto

Elegir aislamiento de datos entre Database-per-Tenant, Schema-per-Tenant y Shared DB + TenantId + RLS para SaaS ERP/GRP PostgreSQL con piloto municipal.

## Decisión

Adoptar **Shared Database (por microservicio) + `tenant_id` + RLS** como único modelo de aplicación.  
El piloto municipal corre en **Dedicated Data Plane** (sin co-location), sin cambiar el modelo de programación.

## Consecuencias

- Flyway único por servicio; `V2__enable_rls.sql` obligatorio.  
- JWT debe portar `tenant_id`; propagación vía token + envelope Kafka.  
- Database/Schema per tenant rechazados como default SaaS.  
- Dedicated Plane cubre aislamiento político/regulatorio del piloto.
