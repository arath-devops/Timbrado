# Visión y principios arquitectónicos

## Visión

Construir una **suite integrada ERP + GRP** que unifique la gestión administrativa, financiera y operativa del sector privado con las obligaciones de gobernanza, transparencia, presupuesto público y atención ciudadana del sector público — sin acoplar módulos innecesarios.

> **Principio rector:** *Un núcleo compartido (Identity, Audit, Catalog, Workflow, Notifications) y dominios de negocio desacoplados que se comunican por contratos y eventos.*

## Principios (con justificación)

### 1. Domain Driven Design (DDD)
**Por qué:** ERP y GRP tienen lenguajes ubiquos distintos (p. ej. *asiento contable* vs *partida presupuestal*). DDD evita el “big ball of mud” típico de monolitos gubernamentales.

**Cómo:** Bounded Contexts claros, Context Map con relaciones Customer/Supplier y Anti-Corruption Layers (ACL) entre ERP↔GRP.

### 2. Clean + Hexagonal Architecture
**Por qué:** Permite cambiar adapters (REST → gRPC, JPA → R2DBC, Kafka → Pulsar) sin contaminar el dominio.

**Cómo:** `domain` → `application` → `infrastructure` / `interfaces`. Puertos hacia afuera; adapters hacia adentro.

### 3. SOLID
**Por qué:** Mantenibilidad a 10+ años (ciclo típico de ERP gubernamental).

### 4. Event Driven Architecture (EDA)
**Por qué:** SAP Event Mesh / Oracle Integration Cloud / Dynamics Dual-write demuestran que la integración asíncrona es el único camino a escala multi-módulo.

**Cómo:** Kafka topics versionados + Avro + Schema Registry + outbox pattern.

### 5. CQRS (selectivo)
**Por qué:** Contabilidad, presupuesto y nómina tienen ratio lectura/escritura extremos.

**Cómo:** Write model en PostgreSQL; read models en PostgreSQL materializadas + Elasticsearch para búsqueda.

### 6. API First
**Por qué:** Contratos OpenAPI 3.1 como fuente de verdad entre backend, frontend y partners (bancos, SAT, TESOFE, proveedores).

### 7. Twelve-Factor + Cloud Native
Config por env, procesos stateless, ports binding, concurrency via scale-out, disposability, logs como streams, admin processes.

### 8. Secure by Design
Zero Trust, least privilege, defense in depth, secrets fuera del código, MFA obligatorio para roles privilegiados.

## Comparativa con referentes de industria

| Capacidad | SAP S/4 | Oracle Fusion | Dynamics 365 | Este arquetipo |
|-----------|---------|---------------|--------------|----------------|
| Módulos activables | Add-ons / scope items | Offerings | Apps | Feature flags + deploy flags |
| Multitenant | Limited (PCE) | Nativo SaaS | Nativo | Schema + RLS + tenant_id |
| Eventos | Event Mesh | OIC / Streams | Dual-write / Dataverse | Kafka + Outbox |
| Extensibilidad | BAdI / RAP | PaaS extensions | Plugins | Hexagonal ports + webhooks |
| Sector público | IS-PS | Public Sector | Gov Cloud | GRP nativo (presupuesto, transparencia) |

## Decisiones ADR relacionadas

Ver `docs/adr/` — ADR-001 a ADR-012.
