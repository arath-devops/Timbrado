# Catálogo de eventos ERP MVP
## ERP-EV-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-EV-001 |
| Complementa | `docs/events/mvp/02-EVENT-CATALOG.md` (plataforma) |
| Estado | **Obligatorio para track ERP** |

Envelope CloudEvents + `LegalEntityId` / `CorrelationId` / `CausationId` según [ADR-003](../adr/ADR-003-event-envelope-cloudevents.md).

---

## 1. Eventos que NO aplican al ERP

| Evento | Motivo |
|--------|--------|
| `BudgetCommitted` | GRP — ADR-014 |
| `BudgetReleased` | GRP |
| `BudgetCommitFailed` | GRP |

---

## 2. Procurement / Inventory (P2P)

| EventType | Productor | Consumidores | Notas |
|-----------|-----------|--------------|-------|
| `PurchaseRequisitionSubmitted` | procurement | workflow | Inicia WF PR |
| `PurchaseRequisitionApproved` | procurement | — | Tras WF |
| `PurchaseOrderCreated` | procurement | — | Borrador |
| `PurchaseOrderSubmitted` | procurement | workflow | Inicia WF OC |
| `PurchaseOrderApproved` | procurement | inventory (reserva opcional) | **Sin** BudgetCommitted |
| `PurchaseOrderRejected` | procurement | — | |
| `PurchaseOrderCancelled` | procurement | inventory | Libera reservas |
| `GoodsReceiptPosted` | procurement o inventory | ap, accounting | Base 3-way |
| `GoodsReceiptReversed` | inventory | ap, accounting | |

## 3. AP / Treasury

| EventType | Productor | Consumidores | Notas |
|-----------|-----------|--------------|-------|
| `VendorInvoiceReceived` | ap | workflow, match engine | |
| `ThreeWayMatchCompleted` | ap | — | payload: matched/exception |
| `VendorInvoiceApproved` | ap | accounting | Posting CxP |
| `VendorInvoiceBlocked` | ap | — | Excepción match |
| `PaymentProposalCreated` | ap | workflow | Dual control |
| `PaymentProposalApproved` | ap | treasury | |
| `PaymentExecuted` | treasury | ap, accounting | |
| `BankStatementImported` | treasury | — | |
| `BankReconciliationCompleted` | treasury | accounting | |

## 4. O2C light / AR / Billing

| EventType | Productor | Consumidores | Notas |
|-----------|-----------|--------------|-------|
| `CustomerCreditChecked` | ar-billing | sales path | OK / hold |
| `SalesOrderConfirmed` | ar-billing | inventory | |
| `DeliveryPosted` | inventory | ar-billing | |
| `CustomerInvoiceIssued` | ar-billing | accounting, fiscal-port | |
| `CustomerPaymentApplied` | ar-billing | accounting | |
| `CreditHoldPlaced` | ar-billing | — | Bloquea SO |
| `CreditHoldReleased` | ar-billing | — | |

## 5. Accounting / master

| EventType | Productor | Consumidores | Notas |
|-----------|-----------|--------------|-------|
| `JournalEntryPosted` | accounting | — | Inmutable |
| `PeriodClosed` | accounting | ap, ar, treasury | Rechaza postings |
| `PeriodReopened` | accounting | — | SoD estricto |
| `VendorCreated` / `VendorUpdated` | procurement | — | |
| `CustomerCreated` / `CustomerUpdated` | ar-billing | — | |
| `ItemCreated` / `ItemUpdated` | inventory | — | |

## 6. Topics sugeridos (Kafka)

| Topic | Eventos |
|-------|---------|
| `erp.procurement.v1` | PR/PO |
| `erp.inventory.v1` | GR, Delivery, stock |
| `erp.ap.v1` | Facturas, match, propuestas |
| `erp.ar.v1` | SO, invoice, credit, payments |
| `erp.treasury.v1` | Pagos, extractos, conciliación |
| `erp.accounting.v1` | JE, periodos |
| `platform.workflow.v1` | (existente) |
| `platform.audit.v1` | (existente) |

**No** crear consumidores ERP en topics `grp.budget.*`.

---

**Fin ERP-EV-001**
