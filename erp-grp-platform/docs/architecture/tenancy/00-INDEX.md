# Tenancy — Modelo multi-tenant definitivo
## CA-TEN-001

| Campo | Valor |
|-------|--------|
| Documento | CA-TEN-001 |
| Rol | Cloud Architect (SaaS ERP/GRP) |
| Estado | **Decisión cerrada** |
| Motor | PostgreSQL |
| Alinea | EA-DEC-001 D-02 / D-03 · DA-MVP-001 · SA-MS-001 · API-001 |
| Piloto | Gobierno Municipal |

## Contenido

1. [Comparativa de estrategias](01-COMPARATIVA.md)
2. [Decisión y justificación](02-DECISION.md)
3. [Diseño técnico](03-DISENO-TECNICO.md)
4. [JWT, resolución y propagación](04-JWT-RESOLUTION-PROPAGATION.md)
5. [Migraciones Flyway multi-tenant](05-MIGRATIONS.md)

## Decisión en una línea

> **Estrategia única de aplicación:** Shared Database (por microservicio) + `tenant_id` + **RLS**.  
> **Piloto municipal:** mismo modelo de código desplegado en **Data Plane dedicado** (sin co-location de otros tenants en ese runtime).
