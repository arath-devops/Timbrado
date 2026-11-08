# 3. Contratos transversales
## SA-MS-001

## 3.1 Contrato de identidad (IAM → todos)

### JWT access token (claims mínimos)
```json
{
  "sub": "user-uuid",
  "tenant_id": "tenant-uuid",
  "preferred_username": "jperez",
  "roles": ["PUR_BUYER", "CLERK"],
  "org_scopes": [
    {"type": "OU_SUBTREE", "orgUnitId": "..."}
  ],
  "modules": ["erp.procurement", "grp.budget", "core.document"],
  "amr": ["pwd", "otp"],
  "sid": "session-uuid",
  "exp": 0
}
```

### Endpoint de menú
`GET /api/v1/me/menus` → árbol filtrado (SEC-ARCH-001).

---

## 3.2 Contrato crítico MVP: Procurement ↔ Budget

### Sync command (preferido en approve/submit)
`POST /api/v1/movements/commit`  
Headers: `Idempotency-Key`, `Authorization`, `X-Correlation-Id`

Request:
```json
{
  "allocationId": "uuid",
  "amount": 125000.00,
  "currency": "MXN",
  "referenceType": "PURCHASE_ORDER",
  "referenceId": "po-uuid"
}
```

Responses:
- `200` `{ "status": "COMMITTED", "movementId": "..." }` → procurement puede aprobar
- `409/422` `{ "code": "INSUFFICIENT_FUNDS" }` → procurement rechaza/regresa borrador
- Evento espejo: `BudgetCommitted` / `BudgetCommitFailed`

### Release
`POST /api/v1/movements/release` al cancelar OC.

**Límite:** procurement **nunca** calcula `available` como fuente de verdad; solo consulta `GET /availability` para UX.

---

## 3.3 Contrato Workflow ↔ Dominios

### Start
```json
{
  "processKey": "PO_APPROVAL",
  "businessRef": {
    "boundedContext": "procurement",
    "aggregateType": "PurchaseOrder",
    "aggregateId": "uuid"
  },
  "variables": {
    "amount": 125000.00,
    "currency": "MXN",
    "orgUnitId": "uuid",
    "departmentId": "uuid",
    "caseFileId": "uuid"
  }
}
```

### Outcomes consumidos por dominio
| Evento | Acción de dominio |
|--------|-------------------|
| `ProcessCompleted` | `ApprovePurchaseOrder` / activar modificación presupuestal |
| `ProcessRejected` | marcar REJECTED / devolver DRAFT |
| `ProcessCancelled` | compensar holds |

---

## 3.4 Contrato Document ↔ Dominios / Workflow

| API/Evento | Uso |
|------------|-----|
| `POST /case-files` + items | Expediente de compra |
| `checklist:validate` | Guard BPM |
| `POST /signatures` | Signature task |
| `DocumentSigned` | Reanudar BPM |
| `DocumentLinked` | Trazabilidad |

---

## 3.5 Contrato Audit

`POST /api/v1/facts` (M2M) o bridge desde outbox:

```json
{
  "entityType": "PurchaseOrder",
  "entityId": "uuid",
  "action": "APPROVED",
  "actor": "user-uuid",
  "before": {},
  "after": {},
  "correlationId": "uuid"
}
```

---

## 3.6 Versiones y compatibilidad

| Cambio | Estrategia |
|--------|------------|
| Campo opcional nuevo en API | Minor, backward compatible |
| Campo requerido nuevo / remove | `/api/v2` |
| Evento payload additive | `eventVersion++` con compatibilidad BACKWARD |
| Rename eventType | Nuevo tipo; dual-publish período de gracia |

## 3.7 SLAs técnicos de contrato (objetivos)

| Interacción | p99 objetivo |
|-------------|--------------|
| JWT validate + API read | ≤ 150 ms |
| CommitBudget sync | ≤ 300 ms |
| StartProcess | ≤ 300 ms |
| Upload doc (excl. red transfer) | ack ≤ 500 ms + async scan |
