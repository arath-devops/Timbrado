# 8. Catálogo de procesos reutilizables
## BPM-001

Cada módulo **registra definiciones**; el motor es único.

## 8.1 Plantillas genéricas

| Template Key | Patrón | Params |
|--------------|--------|--------|
| `GENERIC_SINGLE_APPROVAL` | P1 | candidateRule, sla |
| `GENERIC_MULTI_LEVEL_AMOUNT` | P2 | thresholds, levels |
| `GENERIC_REVIEW_APPROVE_SIGN` | P3+P4 | reviewRole, signPolicy |
| `GENERIC_PARALLEL_REVIEW` | P5 | review nodes |
| `GENERIC_REQUEST_CHANGES_LOOP` | P6 | maxLoops |

## 8.2 Definiciones ERP

| processKey | Módulo | Template | Prioridad |
|------------|--------|----------|-----------|
| `PR_APPROVAL` | Compras | Multi-level amount | **MVP** |
| `PO_APPROVAL` | Compras | Multi-level + optional sign + system budget | **MVP** |
| `PO_CANCEL_APPROVAL` | Compras | Single/Dual | F1 |
| `INVOICE_MATCH_EXCEPTION` | Compras/CXP | Review+Approve | F1 |
| `PAYMENT_APPROVAL` | Tesorería | Multi-level + MFA + sign | F1 |
| `JOURNAL_POST_APPROVAL` | Contabilidad | Single/Dual | F1/F2 |
| `PERIOD_CLOSE_APPROVAL` | Contabilidad | Dual + MFA | F2 |
| `STOCK_ADJUST_APPROVAL` | Inventarios | Single | F2+ |
| `HR_MOVEMENT_APPROVAL` | RRHH | Multi-level | F2+ |
| `PAYROLL_APPROVAL` | Nómina | Dual + MFA | OUT-F1 |
| `ASSET_DISPOSAL_APPROVAL` | Activos | Dual | F2+ |

## 8.3 Definiciones GRP

| processKey | Módulo | Template | Prioridad |
|------------|--------|----------|-----------|
| `BUDGET_CYCLE_APPROVAL` | Presupuesto | Dual/Multi + sign | MVP/F1 |
| `BUDGET_MODIFICATION` | Presupuesto | Multi-level amount + MFA | **MVP/F1** |
| `BUDGET_FREEZE_REQUEST` | Presupuesto | Single | F1 |
| `PROCUREMENT_AWARD_APPROVAL` | Contrataciones | Committee + sign | F2+ |
| `CONTRACT_SIGN_FLOW` | Contrataciones | Signature chain | F2+ |
| `TRANSPARENCY_PUBLISH_APPROVAL` | Transparencia | Review+Approve | F2+ |
| `CITIZEN_REQUEST_RESOLUTION` | Ciudadanía | Review+Approve+Notify | OUT-F1 |
| `TAX_WRITEOFF_APPROVAL` | Recaudación | Dual+MFA | OUT-F1 |
| `SOCIAL_DISBURSEMENT_APPROVAL` | Programas | Dual+MFA | OUT-F1 |
| `OVERSIGHT_FINDING_CLOSE` | Fiscalización | Dual | F2+ |
| `DOCUMENT_RETENTION_EXCEPTION` | Documentos | Single | MVP opcional |

## 8.4 Cómo un módulo nuevo se engancha (checklist)

1. Elegir template o clonar definición.  
2. Mapear variables (`amount`, `orgUnitId`, …).  
3. Configurar ruleset de candidatos/umbrales.  
4. Configurar SLA + reminders.  
5. Suscribir policies: `ProcessCompleted` → command de dominio (`ApprovePurchaseOrder`).  
6. Registrar menú “Mis aprobaciones” (ya global).  
7. Pruebas: approve, reject, request changes, expire/escalate, sign.

**Justificación:** onboarding de módulos sin tocar el core del engine — mismo approach que Flexible Workflow SAP / AME Oracle.
