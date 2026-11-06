# Sagas MVP — DDD / EDA
## SAGA-MVP-001

| Campo | Valor |
|-------|--------|
| Documento | SAGA-MVP-001 |
| Roles | Domain Driven Design · Event Driven Architecture |
| Saga principal | **PurchaseApprovalSaga** (Solicitud de Compra → Aprobación → Commit Budget → Documento → Auditoría) |
| Orquestador | `procurement-service` (orchestration saga) |
| Estado | Diseño completo (sin código de implementación) |
| Entradas | BL-S1-001, SA-MS-001, EDA-MVP-001, DA-MVP-001, API-001 |

## Contenido

1. [Saga completa — diseño](01-PURCHASE-APPROVAL-SAGA.md)
2. [Pasos, comandos, eventos, compensaciones](02-STEPS-COMMANDS-EVENTS.md)
3. [Casos de falla y rollback](03-FAILURE-CASES.md)
4. [Diagramas UML / Mermaid](04-SEQUENCE-DIAGRAMS.md)
5. [Tabla de estados](05-STATE-TABLE.md)
6. [Recuperación e idempotencia](06-RECOVERY-IDEMPOTENCY.md)

## Decisión de estilo

| Opción | Elección MVP | Justificación |
|--------|--------------|---------------|
| Orquestación vs coreografía pura | **Orquestación** en procurement + eventos espejo | El invariante fondos exige decisión sync (`CommitBudget`); el orquestador evita carreras entre WF y budget |
| CommitBudget | **Comando sync HTTP** + evento `BudgetCommitted` | SA-MS / DoR: sin COMMITTED no hay APPROVED |
| Auditoría | Side-effect **no compensable** (append-only) | Audit trail nunca se borra; se registra compensación como nuevo fact |
