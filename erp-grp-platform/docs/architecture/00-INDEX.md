# Fase 1 — Arquitectura Empresarial

## Índice

1. [Visión y principios](01-vision-principios.md)
2. [Arquitectura empresarial (EA)](02-arquitectura-empresarial.md)
3. [Arquitectura lógica](03-arquitectura-logica.md)
4. [Arquitectura física](04-arquitectura-fisica.md)
5. [Arquitectura de despliegue](05-arquitectura-despliegue.md)
6. [Arquitectura de dominios](06-arquitectura-dominios.md)
7. [Arquitectura de integración](07-arquitectura-integracion.md)
8. [Diagramas C4](c4/README.md)
9. [Diagramas Mermaid / UML](uml/README.md)

## Resumen ejecutivo

La plataforma **ERP+GRP Enterprise** se define como un **System of Record** + **System of Engagement** cloud-native, multi-tenant, con módulos activables por licencia/tenant.

### Capas empresariales (TOGAF ADM adaptado)

| Capa TOGAF | Artefacto | Decisión |
|------------|-----------|----------|
| Business Architecture | Capabilidades ERP/GRP + Core | Módulos on/off por tenant |
| Application Architecture | Microservicios + MFEs | Bounded Context = Deployable Unit |
| Data Architecture | DB-per-service + Event Store lógico | PostgreSQL + Kafka topics |
| Technology Architecture | K8s multi-AZ + managed data services | HA 99.95%, DR RPO≤15m / RTO≤1h |

### Drivers no funcionales (NFR)

- **Throughput:** ≥ 5,000 TPS sostenidos en picos (nómina / recaudación).
- **Latencia p99 API síncrona:** ≤ 300 ms (sin reportes pesados).
- **Auditoría:** 100% de mutaciones con who/when/what/why (inmutable).
- **Compliance:** ISO 27001, NIST CSF, CIS Controls, LFPDPPP / GDPR-like.
- **Residencia de datos:** configurable por jurisdicción (federal/estatal).
