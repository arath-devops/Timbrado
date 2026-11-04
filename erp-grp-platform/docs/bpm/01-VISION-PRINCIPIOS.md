# 1. Visión y principios
## BPM-001

## 1.1 Visión

> Proveer un **Workflow Engine Enterprise** como Bounded Context de plataforma, capaz de orquestar ciclos humanos y de sistema (solicitud → revisión → aprobación/rechazo → firma → cierre) para **cualquier módulo**, sin reimplementar aprobaciones dentro de Compras, Presupuesto, Tesorería, Contrataciones, etc.

## 1.2 Referentes

| Plataforma | Capacidad análoga |
|------------|-------------------|
| SAP | Business Workflow / Flexible Workflow |
| Oracle | Approvals Management (AME) / OCI Process Automation |
| Dynamics 365 | Power Automate + approval workflows |
| Camunda / Flowable | BPMN engines (inspiración de estados/tokens) |

## 1.3 Principios de diseño

| Principio | Justificación |
|---------|---------------|
| **Workflow ≠ Dominio de negocio** | El PO no “es” el proceso; el proceso **aprueba** el PO |
| **Definition vs Instance** | Versionar flujos sin romper casos en vuelo |
| **Human + System tasks** | Firmas, commits presupuestales y notificaciones como tareas/servicios |
| **Rules outside hardcode** | Umbrales, roles y routing por motor de reglas + OrgScope |
| **SLA first-class** | Municipios viven de plazos; escalar no es opcional |
| **Idempotencia y auditoría** | Cada transición deja rastro en Audit BC |
| **Reusable process templates** | Un meta-modelo; N definiciones por dominio |

## 1.4 No-objetivos (MVP del motor)

- BPMN completo con todos los gateways complejos (se soporta subset enterprise)
- Low-code visual designer en Fase 0 (sí modelo declarative YAML/JSON)
- Case Management completo tipo CMMN (puede venir en F2+ para ciudadanía)
