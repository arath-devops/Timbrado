# 2. Decisión definitiva
## CA-TEN-001

## 2.1 Estrategia seleccionada (única)

### **Shared Database (por microservicio) + `tenant_id` + RLS**

Complemento de despliegue para el piloto y clientes regulados:

### **Dedicated Data Plane (opcional / piloto)**

Misma aplicación y mismo DDL multi-tenant, desplegados en infraestructura de datos **sin co-location** de otros tenants.

```text
                    ┌─────────────────────────────┐
                    │     Control Plane SaaS      │
                    │  tenant registry, billing, │
                    │  routing, feature flags     │
                    └──────────────┬──────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           ▼                       ▼                       ▼
   Dedicated Plane A        Shared Plane (SaaS)     Dedicated Plane B
   (Municipio piloto)       muchos tenants          (Enterprise)
   7 service DBs            7 service DBs           7 service DBs
   RLS ON (1 tenant)        RLS ON (N tenants)      RLS ON (1..few)
   tenant_id en filas       tenant_id en filas      tenant_id en filas
```

## 2.2 Por qué no las otras (rechazo explícito)

| Estrategia | Veredicto | Motivo principal |
|------------|-----------|------------------|
| **Database per Tenant** (como default SaaS) | **Rechazada** | Costo/ops explosivos con 7 servicios; onboarding lento; no escala a SaaS municipal masivo |
| **Schema per Tenant** | **Rechazada** | Flyway × N schemas × 7 servicios; riesgo search_path; poco beneficio vs RLS |
| **Shared + tenant_id + RLS** | **Seleccionada** | Alineada a DA-MVP, costo SaaS, una migración, defense-in-depth, path a dedicated plane |

Database-per-tenant **como producto “Dedicated Edition”** se interpreta como **Dedicated Data Plane** (opción de despliegue), no como modelo de programación distinto.

## 2.3 Cumplimiento EA-DEC

| Decisión sponsor | Cómo se cumple |
|------------------|----------------|
| D-02 Multi-tenant by design | Código, DDL, JWT, eventos, RLS siempre tenant-aware |
| D-03 Tenant dedicado piloto | Plane dedicado: un solo `tenant_id` efectivo en ese runtime; sin vecinos |

## 2.4 Implicaciones inmediatas (MVP)

1. Mantener `tenant_id NOT NULL` en todas las tablas de negocio (DA-MVP).  
2. **Activar RLS** en migraciones `V2__enable_rls.sql` (piloto dedicated incluido — defensa en profundidad).  
3. App role **sin** `BYPASSRLS`; migrate role sí puede bypass.  
4. Prohibir confiar solo en `WHERE tenant_id = ?` sin RLS.  
5. Tests cross-tenant obligatorios (DoD).  
6. Header `X-Tenant-Id` solo local/dev; prod = claim JWT.

## 2.5 Criterios de revisión futura

Reabrir la decisión solo si:

- Un regulador exige catálogo PostgreSQL físicamente separado **y** Dedicated Plane no basta, **o**
- Un tenant supera límites de noisy-neighbor no resolubles con plane dedicado / sharding.

Cambio requeriría ADR nuevo firmado por Cloud Architect + CTO.
