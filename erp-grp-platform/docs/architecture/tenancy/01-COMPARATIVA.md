# 1. Comparativa de estrategias multi-tenant
## CA-TEN-001

Contexto de evaluación: plataforma ERP+GRP SaaS, PostgreSQL, **DB-per-service** ya fijado (7 DBs lógicas por despliegue), piloto municipal con requisito de aislamiento, crecimiento a muchos municipios/empresas.

Las tres opciones se evalúan como **modelo de aislamiento de datos de tenant dentro de cada database de servicio** (no como alternativa a DB-per-service).

---

## 1.1 Resumen ejecutivo de opciones

| # | Estrategia | Idea |
|---|------------|------|
| 1 | **Database per Tenant** | Un PostgreSQL database (o instancia) por tenant × cada servicio |
| 2 | **Schema per Tenant** | Un schema PG por tenant dentro de cada database de servicio |
| 3 | **Shared DB + `tenant_id` + RLS** | Tablas compartidas; fila etiquetada; Row Level Security |

---

## 1.2 Comparativa multidimensional

| Criterio | (1) DB per Tenant | (2) Schema per Tenant | (3) Shared + tenant_id + RLS |
|----------|-------------------|-----------------------|------------------------------|
| **Aislamiento seguridad** | Máximo (catálogo/BD separados) | Alto (namespace SQL) | Alto **si RLS + disciplina app**; residual noise-neighbor |
| **Blast radius** | Falla/backup por tenant | Migra/error puede afectar cluster compartido | Misma BD; mitigar con RLS, cuotas, pools |
| **Costo infra (SaaS 100 tenants)** | **Muy alto** (700 DBs si 7 servicios, o 100 instancias) | Medio-alto (700 schemas + search_path) | **Bajo-medio** (7 DBs × pool) |
| **Costo ops / SRE** | Alto (provisioning, patching, monitoring × N) | Alto (Flyway × schemas, grants) | **Bajo** (un pipeline de schema) |
| **Escalabilidad #tenants** | Pobre sin automatización extrema | Regular hasta decenas/cientos | **Buena** a miles (con sharding futuro) |
| **Escalabilidad por tenant grande** | Excelente (aislar noisy neighbor) | Media | Media → resolver con dedicated plane |
| **Migraciones Flyway** | Correr N veces / tooling complejo | N schemas por release | **Una migración por servicio** |
| **Connection pooling** | Difícil (muchas DBs) | search_path / SET role por request | Simple; SET `app.tenant_id` |
| **Backup / restore 1 tenant** | Nativo y limpio | Dump schema; posible | Más complejo (lógico por `tenant_id`) |
| **Cumplimiento municipal / residencia** | Fuerte narrativa | Media | Requiere **dedicated plane** o región |
| **Time-to-onboard tenant** | Minutos–horas (provision) | Minutos (CREATE SCHEMA + migrate) | **Segundos** (INSERT tenant + seed) |
| **Encaje código actual (DA-MVP)** | Rompe supuestos de un schema | Requiere search_path dinámico | **Ya modelado** (`tenant_id` en todas las tablas) |
| **Complejidad app** | Routing datasource dinámico | Schema routing | Filtro + RLS session var |
| **Riesgo fuga cross-tenant** | Bajo | Medio (mal search_path) | Medio-bajo (**RLS obligatorio** reduce) |

---

## 1.3 Costos (orden de magnitud relativo)

Supuesto: 7 microservicios, PostgreSQL managed, 1 piloto hoy → 50 tenants SaaS en 24 meses.

| Concepto | DB/Tenant | Schema/Tenant | Shared+RLS |
|----------|-----------|---------------|------------|
| Compute DB (piloto 1) | 1.0× | 1.0× | 1.0× |
| Compute DB (50 tenants) | **15–40×** | 2–4× | **1–2×** (+ read replicas) |
| Almacenamiento | Similar datos | Similar + overhead catalogs | Similar |
| Ingeniería onboarding | Alta | Media | **Baja** |
| Ingeniería migraciones | Alta | **Muy alta** | **Baja** |
| Costo restore tenant | Bajo ops skill | Medio | Medio-alto (herramienta export) |
| Costo “tenant enterprise dedicado” | Incluido por defecto | Custom | **Add-on** Dedicated Plane |

> Cifras relativas para decisión; no presupuesto financiero formal.

---

## 1.4 Riesgos

| Riesgo | DB/Tenant | Schema/Tenant | Shared+RLS |
|--------|-----------|---------------|------------|
| Explosión operativa | **Crítico** en SaaS | Alto | Bajo |
| Fuga de datos | Bajo | Alto si bug search_path | Mitigado con RLS + tests |
| Migración fallida masiva | Parcial por tenant | **Crítico** (loops schemas) | Un fallo afecta a todos → canary |
| Noisy neighbor | Bajo | Medio | Medio → dedicated tier |
| Vendor/ops lock-in tooling | Alto | Alto | Bajo |
| Desalineación con DDL actual | Media | Alta | **Nula** |
| Expectativa política municipal | Cubierta | Parcial | Cubierta vía **dedicated plane** |

---

## 1.5 Seguridad

| Control | DB/Tenant | Schema/Tenant | Shared+RLS |
|---------|-----------|---------------|------------|
| Separación catálogo PG | Sí | Parcial | No (misma tabla) |
| Defense-in-depth DB | Nativo | Grants por schema | **RLS FORCE + app filter** |
| Privilegio app role | CONNECT a su DB | USAGE schema | SET `app.tenant_id`; no BYPASSRLS |
| Auditoría acceso | Por instancia | Por schema | Policies + app audit |
| JWT tenant binding | Igual de necesario | Igual | **Obligatorio** |
| Residual risk | Ops misconfig routing | search_path injection | Missing WHERE (RLS cubre) |

---

## 1.6 Escalabilidad

| Eje | DB/Tenant | Schema/Tenant | Shared+RLS |
|-----|-----------|---------------|------------|
| +Tenants pequeños | Mal | Regular | **Bien** |
| +Un tenant enorme | Bien | Regular | Sharding / dedicated plane |
| +Regiones | N DBs × regiones | Complejo | Plane por región |
| +Servicios (más de 7) | Multiplica dolor | Multiplica schemas | Lineal (1 DB nueva) |

---

## 1.7 Encaje con el piloto municipal

| Necesidad piloto | Mejor cobertura |
|------------------|-----------------|
| Aislamiento percibido / sin co-location | DB/Tenant **o** Shared en **instancia dedicada** |
| Mismo código que futuro SaaS | Shared+RLS |
| Onboarding rápido de municipio 2..N | Shared+RLS |
| EA-DEC D-02 multi-tenant by design | Shared+RLS |
| EA-DEC D-03 tenant dedicado runtime | Dedicated Data Plane (despliegue), no cambiar modelo de datos |
