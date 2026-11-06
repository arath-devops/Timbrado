# Domain Driven Design — Event Storming & Modelo de Dominio
## DDD-001

| Campo | Valor |
|-------|--------|
| Documento | DDD-001 |
| Entradas | EA-VIS-001, EA-DEC-001, BA-PROC-001 |
| Rol | Domain-Driven Design Expert |
| Piloto | Municipal · Tenant dedicado · Multi-tenant capable |
| Estado | Modelo de dominio para alineación (sin código) |

## Contenido

1. [Event Storming](01-EVENT-STORMING.md)
2. [Domain Model](02-DOMAIN-MODEL.md)
3. [Context Map](03-CONTEXT-MAP.md)
4. [Bounded Contexts](04-BOUNDED-CONTEXTS.md)
5. [Dependencias entre dominios](05-DEPENDENCIAS.md)
6. [Domain Portfolio Map ERP+GRP](06-DOMAIN-PORTFOLIO-MAP.md) — **DDD-PORT-001**

## Principios aplicados

1. **Bounded Context = frontera de lenguaje + de despliegue potencial.**  
2. **MVP primero en profundidad:** Identity, Catalog, Audit, Workflow, Document, Budget, Purchasing.  
3. **ERP ↔ GRP se integran por eventos + ACL**, no por base compartida.  
4. **Regla presupuestal como invariante de Aggregate**, no como “validación de UI”.  
5. **Auditoría es contexto autónomo** alimentado por policies, no un cross-cutting silencioso sin contrato.

## Justificación metodológica

Se eligió Event Storming porque el diferenciador del piloto municipal es un **flujo de decisiones** (requisición → aprobación → disponibilidad → OC → compromiso → documentos), típico de sistemas tipo SAP MM+PSM / Oracle Public Sector Procurement, donde los *domain events* revelan acoplamientos antes de modelar tablas.
