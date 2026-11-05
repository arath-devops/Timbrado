# 2. Catálogo de eventos MVP
## EDA-MVP-001

Todos los eventos: **version = 1**, formato Avro + JSON Schema, envelope con `correlationId`, `tenantId`, `eventVersion`, `eventTimestamp`.

| eventType | Topic | Producer | Consumers (MVP) | Key | Avro | JSON Schema |
|-----------|-------|----------|-----------------|-----|------|-------------|
| `UserCreated` | `core.iam.events` | `iam-service` | `audit-service` | `tenantId:userId` | [UserCreated.avsc](../../../shared/avro/mvp/UserCreated.avsc) | [UserCreated.json](../../../shared/json-schema/mvp/UserCreated.json) |
| `RoleAssigned` | `core.iam.events` | `iam-service` | `audit-service` | `tenantId:userId` | [RoleAssigned.avsc](../../../shared/avro/mvp/RoleAssigned.avsc) | [RoleAssigned.json](../../../shared/json-schema/mvp/RoleAssigned.json) |
| `AuditRecordCreated` | `core.audit.events` | `audit-service` | (proyecciones / SIEM futuro) | `tenantId:entityId` | [AuditRecordCreated.avsc](../../../shared/avro/mvp/AuditRecordCreated.avsc) | [AuditRecordCreated.json](../../../shared/json-schema/mvp/AuditRecordCreated.json) |
| `WorkflowStarted` | `core.workflow.events` | `workflow-service` | `procurement-service`, `audit-service` | `tenantId:processInstanceId` | [WorkflowStarted.avsc](../../../shared/avro/mvp/WorkflowStarted.avsc) | [WorkflowStarted.json](../../../shared/json-schema/mvp/WorkflowStarted.json) |
| `WorkflowApproved` | `core.workflow.events` | `workflow-service` | `procurement-service`, `budget-service` (opcional), `audit-service` | `tenantId:processInstanceId` | [WorkflowApproved.avsc](../../../shared/avro/mvp/WorkflowApproved.avsc) | [WorkflowApproved.json](../../../shared/json-schema/mvp/WorkflowApproved.json) |
| `WorkflowRejected` | `core.workflow.events` | `workflow-service` | `procurement-service`, `audit-service` | `tenantId:processInstanceId` | [WorkflowRejected.avsc](../../../shared/avro/mvp/WorkflowRejected.avsc) | [WorkflowRejected.json](../../../shared/json-schema/mvp/WorkflowRejected.json) |
| `DocumentUploaded` | `core.document.events` | `document-service` | `audit-service` | `tenantId:documentId` | [DocumentUploaded.avsc](../../../shared/avro/mvp/DocumentUploaded.avsc) | [DocumentUploaded.json](../../../shared/json-schema/mvp/DocumentUploaded.json) |
| `DocumentLinked` | `core.document.events` | `document-service` | `procurement-service`, `audit-service` | `tenantId:documentId` | [DocumentLinked.avsc](../../../shared/avro/mvp/DocumentLinked.avsc) | [DocumentLinked.json](../../../shared/json-schema/mvp/DocumentLinked.json) |
| `PurchaseRequestCreated` | `erp.procurement.events` | `procurement-service` | `audit-service`, `document-service` (opcional) | `tenantId:purchaseRequestId` | [PurchaseRequestCreated.avsc](../../../shared/avro/mvp/PurchaseRequestCreated.avsc) | [PurchaseRequestCreated.json](../../../shared/json-schema/mvp/PurchaseRequestCreated.json) |
| `PurchaseRequestApproved` | `erp.procurement.events` | `procurement-service` | `audit-service`, `budget-service` (señal) | `tenantId:purchaseRequestId` | [PurchaseRequestApproved.avsc](../../../shared/avro/mvp/PurchaseRequestApproved.avsc) | [PurchaseRequestApproved.json](../../../shared/json-schema/mvp/PurchaseRequestApproved.json) |
| `BudgetCommitted` | `grp.budget.events` | `budget-service` | `procurement-service`, `audit-service` | `tenantId:allocationId` | [BudgetCommitted.avsc](../../../shared/avro/mvp/BudgetCommitted.avsc) | [BudgetCommitted.json](../../../shared/json-schema/mvp/BudgetCommitted.json) |
| `BudgetReleased` | `grp.budget.events` | `budget-service` | `procurement-service`, `audit-service` | `tenantId:allocationId` | [BudgetReleased.avsc](../../../shared/avro/mvp/BudgetReleased.avsc) | [BudgetReleased.json](../../../shared/json-schema/mvp/BudgetReleased.json) |
| `BudgetCommitFailed` | `grp.budget.events` | `budget-service` | `procurement-service`, `audit-service`, `workflow-service` (opcional) | `tenantId:allocationId` | [BudgetCommitFailed.avsc](../../../shared/avro/mvp/BudgetCommitFailed.avsc) | [BudgetCommitFailed.json](../../../shared/json-schema/mvp/BudgetCommitFailed.json) |

## Secuencia happy path (referencia)

```text
UserCreated / RoleAssigned
  → PurchaseRequestCreated
  → DocumentUploaded → DocumentLinked
  → WorkflowStarted
  → BudgetCommitted | BudgetCommitFailed
  → WorkflowApproved | WorkflowRejected
  → PurchaseRequestApproved (si aplica)
  → BudgetReleased (si cancelación posterior)
  → AuditRecordCreated (en cada mutación relevante vía bridge)
```

> Nota: el **commit presupuestal sync** HTTP sigue siendo la fuente de decisión para APPROVED de OC; los eventos `Budget*` son el espejo asíncrono y la base de proyección/audit.
