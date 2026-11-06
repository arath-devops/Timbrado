# 7. Matriz de autorización ERP
## SEC-ARCH-001

Leyenda: **C**=Create/Captura, **R**=Read, **U**=Update, **S**=Submit, **A**=Approve, **X**=Execute, **E**=Export, **—**=No

Scopes se asumen correctos; sin OrgScope → Deny.

## 7.1 Compras (MVP)

| Permiso / Acción | CLERK / PUR_REQUESTER | AREA_MANAGER | DIRECTOR | PUR_BUYER | PUR_RECEIVER | PUR_AP_CLERK | AUDITOR | ADMIN |
|------------------|-----------------------|--------------|----------|-----------|--------------|--------------|---------|-------|
| requisition:create | C | C | C | C | — | — | — | C |
| requisition:read | R* | R | R | R | R | R | R | R |
| requisition:approve | — | A(U0) | A(U1+) | — | — | — | — | A** |
| po:create/submit | — | — | — | C/S | — | — | — | C |
| po:approve | — | A(U0)*** | A | A*** | — | — | — | A** |
| po:cancel | — | — | A | A | — | — | — | A |
| receipt:create | — | — | — | R | C | R | R | C |
| invoice:match | — | — | — | R | — | C/A | R | A |
| document link/upload | C | C | C | C | C | C | R | C |

\*solo propias / su OU  
\*\*break-glass  
\*\*\*si política municipal lo permite; si no, solo Director/BUD

**ABAC extra:** SoD create≠approve; budget COMMITTED antes de approve PO; umbrales U0–U4.

## 7.2 Contabilidad (F1 parcial)

| Acción | ACC_ACCOUNTANT | ACC_CHIEF | DIRECTOR Fin | AUDITOR | ADMIN |
|--------|----------------|-----------|--------------|---------|-------|
| journal:create | C | C | R | R | C |
| journal:post | — | A/X | A | — | A** |
| period:close | — | X | A | — | A** |
| report:read/export | R | R/E | R/E | R/E | R/E |

## 7.3 Tesorería (F1 parcial)

| Acción | TRE_OPERATOR | TRE_PAYMASTER | DIRECTOR / BUD_APPROVER | AUDITOR | ADMIN |
|--------|--------------|---------------|-------------------------|---------|-------|
| payment:create | C | C | R | R | C |
| payment:approve | — | A(U1) | A | — | A** |
| payment:execute | — | X(+MFA) | — | — | X** |
| collection:create | C | C | R | R | C |
| reconcile:execute | C | C | A | R | A |

**SoD:** quien hace match de factura no ejecuta el pago de la misma.

## 7.4 Inventarios / RRHH / Activos / CRM / Nómina

| Módulo | Operador | Jefe | Auditor | Nota |
|--------|----------|------|---------|------|
| Inventarios | movement:create | adjust:approve | R | F2+ |
| RRHH | employee:write | approve moves | R | F2+ |
| Activos | asset:create | dispose:approve | R | F2+ |
| CRM | lead/opportunity write | R forecast | R | F2+ |
| Nómina | calculate | approve+MFA | R/E | **OUT-F1** |

## 7.5 Finanzas estructura

| Acción | FIN_ANALYST | DIRECTOR | ADMIN |
|--------|-------------|----------|-------|
| cost_center:write | C/U | A | A |
| period:close | — | A | A |
| fx:write | C/U | A | A |
