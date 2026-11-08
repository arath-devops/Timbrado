# Casos de prueba Separation of Duties (SoD)
## ERP-SOD-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-SOD-001 |
| Fuente | ERP-CP-001 §4 · ERP-FM-001 §19 |
| Estado | **Obligatorio antes de UAT ERP** |

Matriz completa: [ERP-CP-001](04-ERP-CONTROL-PACK.md). Aquí: casos ejecutables.

---

## Convenciones

- **PASS** = sistema rechaza combinación ilegal (403 / `SOD_VIOLATION`).
- **FAIL** = deja pasar (bug bloqueante).
- Actor A/B = usuarios distintos en misma Legal Entity.

---

## SOD-T01 — Crear proveedor vs aprobar OC

| Paso | Actor | Acción | Esperado |
|------|-------|--------|----------|
| 1 | A `ROLE_MASTER_DATA` | Crea Vendor V1 | 201 |
| 2 | A intenta aprobar PO hacia V1 | — | **403 SOD** |
| 3 | B `ROLE_PURCHASING` / aprobador WF | Aprueba PO | 200 |

## SOD-T02 — Recibir mercancía vs facturar CxP

| Paso | Actor | Acción | Esperado |
|------|-------|--------|----------|
| 1 | A `ROLE_WAREHOUSE` | Postea GR | 201 |
| 2 | A registra Vendor Invoice misma PO/GR | — | **403 SOD** |
| 3 | B `ROLE_AP` | Registra factura | 201 |

## SOD-T03 — Dual control pago

| Paso | Actor | Acción | Esperado |
|------|-------|--------|----------|
| 1 | A `ROLE_TREASURY` | Crea PaymentProposal | 201 |
| 2 | A aprueba la misma propuesta | — | **403 SOD** |
| 3 | B aprobador (tesorería o finanzas) | Aprueba | 200 |
| 4 | Ejecución pago | treasury | 200 |

## SOD-T04 — Contabilizar vs cerrar periodo

| Paso | Actor | Acción | Esperado |
|------|-------|--------|----------|
| 1 | A `ROLE_ACCOUNTANT` | Postea JE | 201 |
| 2 | A cierra periodo solo | — | **403** o requiere WF-06 segundo actor |
| 3 | B `ROLE_FINANCE_CONTROLLER` | Aprueba cierre | PeriodClosed |

## SOD-T05 — Crédito: alta cliente vs override hold

| Paso | Actor | Acción | Esperado |
|------|-------|--------|----------|
| 1 | A `ROLE_MASTER_DATA` | Crea Customer + límite | 201 |
| 2 | Sistema pone CreditHold en SO | — | hold |
| 3 | A libera hold | — | **403 SOD** |
| 4 | B `ROLE_CREDIT` / finanzas | Override | 200 |

## SOD-T06 — Mismo userId dos roles conflictivos en token

| Paso | Acción | Esperado |
|------|--------|----------|
| Login con roles `ROLE_WAREHOUSE` + `ROLE_AP` | Token emitido | **Rechazar** en IAM o marcar combinación ilegal en policy |
| Cualquier POST GR + Invoice misma sesión | — | Al menos una acción **403** |

---

## Automatización

- Tests de integración: `sod/` en cada servicio + prueba e2e gateway.
- Fixture usuarios: ver [ERP-CFG-001](13-CONFIG-SEED-ACME.md) sección SoD users.

---

**Fin ERP-SOD-001**
