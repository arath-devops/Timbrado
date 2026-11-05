# 3. Modelo de Permisos
## SEC-ARCH-001

## 3.1 Formato

```text
<domain>.<resource>:<action>[#<qualifier>]
```

Ejemplos: `purchasing.purchase_order:approve`, `budget.allocation:commit`, `org.unit:write`

## 3.2 Acciones canónicas

`create` · `read` · `update` · `delete` · `submit` · `approve` · `reject` · `cancel` · `execute` · `export` · `assign` · `configure`

## 3.3 Catálogo Core / Plataforma

| Permiso | Descripción |
|---------|-------------|
| `iam.user:create` / `read` / `update` / `lock` | Usuarios |
| `iam.role:assign` | Asignar roles |
| `iam.scope:grant` | Otorgar OrgScope |
| `iam.session:revoke` | Revocar sesiones |
| `catalog.item:read` / `write` | Catálogos |
| `audit.fact:read` / `export` | Auditoría |
| `workflow.task:read` / `complete` | Inbox |
| `workflow.process:start` / `cancel` | Instancias |
| `document.file:upload` / `read` / `link` / `sign` | Documentos |
| `org.unit:read` / `write` | Organigrama |
| `org.position:write` | Plazas |
| `menu:read` | Resolver menús |
| `module:toggle` | Feature flags (admin) |
| `notify:send` | Notificaciones admin |

## 3.4 Catálogo ERP (extracto)

| Dominio | Permisos clave |
|---------|----------------|
| Finanzas | `finance.cost_center:write`, `finance.period:close`, `finance.fx:write` |
| Contabilidad | `accounting.journal:create`, `accounting.journal:post`, `accounting.period:close`, `accounting.report:read` |
| Tesorería | `treasury.payment:create`, `treasury.payment:approve`, `treasury.payment:execute`, `treasury.collection:create`, `treasury.reconcile:execute` |
| Compras | `purchasing.requisition:create`, `purchasing.requisition:approve`, `purchasing.po:create`, `purchasing.po:submit`, `purchasing.po:approve`, `purchasing.po:cancel`, `purchasing.receipt:create`, `purchasing.invoice:match` |
| Inventarios | `inventory.movement:create`, `inventory.adjust:approve` |
| RRHH | `hr.employee:create`, `hr.employee:update`, `hr.position:write` |
| Nómina | `payroll.run:calculate`, `payroll.run:approve`, `payroll.run:close` |
| Activos | `assets.asset:create`, `assets.depreciate:execute`, `assets.dispose:approve` |
| CRM | `crm.lead:write`, `crm.opportunity:write` |

## 3.5 Catálogo GRP (extracto)

| Dominio | Permisos clave |
|---------|----------------|
| Presupuesto | `budget.cycle:create`, `budget.cycle:approve`, `budget.allocation:read`, `budget.allocation:activate`, `budget.allocation:commit`, `budget.allocation:accrue`, `budget.allocation:pay`, `budget.allocation:modify`, `budget.allocation:freeze`, `budget.availability:read` |
| Contrataciones | `procurement.procedure:publish`, `procurement.bid:evaluate`, `procurement.award:grant`, `procurement.contract:sign` |
| Transparencia | `transparency.obligation:publish`, `transparency.request:manage` |
| Ciudadanía | `citizen.request:manage`, `citizen.citizen:register` |
| Recaudación | `tax.assessment:issue`, `tax.payment:register` |
| Programas | `social.beneficiary:enroll`, `social.benefit:disburse` |
| Fiscalización | `oversight.case:open`, `oversight.finding:issue`, `oversight.finding:close` |

## 3.6 Permisos MVP prioritarios

Conjunto mínimo a implementar/configurar primero:

1. IAM + Org + Catalog + Audit + Workflow + Document  
2. `purchasing.*` (create/submit/approve/cancel)  
3. `budget.availability:read`, `budget.allocation:commit`, `budget.allocation:modify`(admin)  
4. `document.file:*` esenciales  
5. `workflow.task:complete`

## 3.7 Justificación

Permisos **finos por recurso** (no solo por módulo) permiten SoD y matrices ERP/GRP auditables, patrón usado en Oracle Fusion duty roles y SAP authorization objects simplificados a un namespace legible.
