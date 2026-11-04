# Autorización RBAC + ABAC

## Flujo
```mermaid
sequenceDiagram
  participant U as Usuario
  participant GW as Gateway
  participant SVC as Resource Server
  participant IAM as Policy Engine

  U->>GW: Request + Bearer JWT
  GW->>GW: Validate signature/exp/iss
  GW->>SVC: Forward + headers
  SVC->>SVC: RBAC @PreAuthorize
  SVC->>IAM: Evaluate ABAC (opcional PDP)
  IAM-->>SVC: Permit/Deny
  SVC-->>U: 200 / 403
```

## Atributos ABAC
- Sujeto: roles, clearance, ou, employeeId
- Recurso: tenantId, module, amount, costCenter, budgetItem
- Acción: create/approve/execute/export
- Entorno: ipRange, timeWindow, deviceTrust, mfaAge

## Ejemplo política
```json
{
  "id": "budget-approve-high",
  "effect": "Permit",
  "actions": ["budget.allocation:approve"],
  "condition": "subject.roles.contains('BUD_APPROVER') && resource.amount <= subject.approvalLimit && resource.tenantId == subject.tenantId && environment.mfaAge < 300"
}
```
