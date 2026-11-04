# Topics Kafka

| Topic | Particiones (prod) | Clave | Productores | Consumidores |
|-------|--------------------|-------|-------------|--------------|
| `erp.purchasing.events` | 24 | tenantId:poId | purchasing | budget, accounting, inventory, audit, notify |
| `erp.accounting.events` | 24 | tenantId:journalId | accounting | report, audit, finance |
| `erp.treasury.events` | 12 | tenantId:paymentId | treasury | accounting, budget, tax, audit |
| `erp.payroll.events` | 12 | tenantId:runId | payroll | accounting, budget, treasury, notify |
| `erp.hr.events` | 12 | tenantId:employeeId | hr | payroll, audit |
| `erp.inventory.events` | 12 | tenantId:sku | inventory | accounting, sales |
| `grp.budget.events` | 24 | tenantId:allocationId | budget | purchasing, payroll, procurement, transparency, report |
| `grp.tax.events` | 12 | tenantId:taxpayerId | tax | treasury, citizen, audit |
| `grp.procurement.events` | 12 | tenantId:procedureId | procurement | purchasing, budget, transparency |
| `grp.citizen.events` | 24 | tenantId:citizenId | citizen | electronic-file, tax, social-program, notify |
| `grp.document.events` | 12 | tenantId:docId | document | electronic-file, transparency |
| `core.iam.events` | 12 | tenantId:userId | iam | audit, notify |
| `core.audit.events` | 24 | tenantId:entityId | audit | oversight |
| `core.workflow.events` | 12 | tenantId:processId | workflow | purchasing, budget, payroll, procurement |
| `core.notification.commands` | 12 | tenantId | * | notification |
| `*.dlq` | = origen | original key | consumers | ops / redrive |

RF=3, min.insync.replicas=2, acks=all.
