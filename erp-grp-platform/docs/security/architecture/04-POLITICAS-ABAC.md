# 4. Políticas ABAC
## SEC-ARCH-001

## 4.1 Motor de decisión (lógico)

```text
PDP.evaluate(subject, action, resource, environment) -> Permit | Deny | PermitWithObligations
```

| Dimensión | Atributos |
|-----------|-----------|
| Subject | roles, permissions, org_scopes, approval_limit, mfa_level, clearance |
| Resource | tenant_id, module, org_unit_id, department_id, amount, currency, status, sensitivity |
| Action | permission code |
| Environment | time, ip_range, device_trust, amr/mfa_age, channel |

## 4.2 Políticas base (Policy-as-design)

### POL-TENANT-ISOLATION
- **Effect:** Deny si `resource.tenant_id != subject.tenant_id`
- **Justificación:** control #1 multi-tenant

### POL-ORG-SCOPE
- **Effect:** Permit solo si recurso.org_unit ∈ scopes (exact/subtree/LE/tenant)
- **Justificación:** ORG-001

### POL-DEPARTMENT-BOUNDARY
- **Effect:** Deny create/approve fuera del departamento scoped salvo rol buyer central / admin
- **Justificación:** evita captura cruzada entre áreas

### POL-AMOUNT-THRESHOLD
- **Effect:** Require role+level según monto; Deny si `amount > subject.approval_limit`
- **Obligations:** step-up MFA si amount ≥ U2
- **Justificación:** delegación de autoridad financiera

### POL-SOD-PURCHASE
- **Effect:** Deny approve si `subject.userId == resource.createdBy`
- **Justificación:** segregación crear/aprobar

### POL-SOD-PAY
- **Effect:** Deny `treasury.payment:execute` si subject calculó/casó la misma factura/nómina
- **Justificación:** fraude en pagos

### POL-BUDGET-FUNDS
- **Effect:** Deny `purchasing.po:approve` si commitment no confirmado
- **Justificación:** funds control GRP

### POL-MODULE-ENABLED
- **Effect:** Deny si módulo no activo en tenant
- **Justificación:** EA módulos on/off

### POL-MFA-STEPUP
- **Effect:** DenyUntilMfa para acciones sensibles si `mfa_age > 5m` o amr insuficiente

### POL-TIME-WINDOW (opcional municipal)
- **Effect:** Deny pagos fuera de ventana operativa salvo break-glass

## 4.3 Pseudopolíticas (ejemplos)

```json
{
  "id": "po-approve-amount",
  "action": "purchasing.po:approve",
  "effect": "Permit",
  "condition": "subject.roles.containsAny('AREA_MANAGER','DIRECTOR','PUR_BUYER','ADMIN') && subject.inOrgScope(resource.orgUnitId) && resource.amount <= subject.approvalLimit && resource.tenantId == subject.tenantId && resource.budgetCommitStatus == 'COMMITTED'"
}
```

```json
{
  "id": "budget-modify-high",
  "action": "budget.allocation:modify",
  "effect": "Permit",
  "condition": "subject.roles.contains('BUD_APPROVER') && subject.mfaLevel >= 2 && resource.amount <= subject.approvalLimit && subject.inOrgScope(resource.responsibleOrgUnitId)"
}
```

## 4.4 Obligations (efectos colaterales de autorización)

| Obligation | Cuándo |
|------------|--------|
| `REQUIRE_MFA` | Step-up |
| `REQUIRE_DUAL_APPROVAL` | Monto ≥ U3 |
| `REQUIRE_DOCUMENT_SET` | PO approve / budget modify |
| `AUDIT_BREAK_GLASS` | Admin override |
| `NOTIFY_CONTROLLER` | Pagos/modificaciones sobre umbral |

## 4.5 Justificación RBAC + ABAC

RBAC solo no expresa “hasta $X en mi dirección”. ABAC solo es difícil de gobernar. El híbrido es el estándar de ERPs modernos (Oracle data security + role; SAP + organizational levels; Entra PIM + Conditional Access).
