# 8. Matriz de autorización GRP
## SEC-ARCH-001

## 8.1 Presupuesto Público (MVP + F1)

| Acción | BUD_ANALYST | BUD_APPROVER | DIRECTOR resp. | PUR_BUYER / sistema | AUDITOR | ADMIN |
|--------|-------------|--------------|----------------|---------------------|---------|-------|
| availability:read | R | R | R | R | R | R |
| allocation:read | R | R | R* | R* | R | R |
| cycle:create | C | C | — | — | — | C |
| cycle:approve | — | A(+MFA) | — | — | — | A** |
| allocation:activate | C | A | — | — | — | A |
| allocation:commit | X*** | X | — | X via policy | — | X** |
| allocation:accrue/pay | X (F1) | A | — | via events | — | A |
| allocation:modify | C | A(+MFA/U2+) | A solicitud | — | R | A** |
| allocation:freeze | C | A | — | — | — | A |

\*limitado a partidas de su OrgScope / responsible OU  
\*\*break-glass  
\*\*\*commit automático de sistema bajo service account con permiso restringido idempotente

**ABAC:** `authorized ≥ committed ≥ accrued ≥ paid`; Deny commit si available < amount; modify sobre U2 exige MFA.

## 8.2 Documentos (MVP)

| Acción | CLERK | MANAGER/DIRECTOR | DOC_MANAGER | AUDITOR | ADMIN |
|--------|-------|------------------|-------------|---------|-------|
| upload/link | C | C | C | — | C |
| read | R scope | R | R | R | R |
| sign | — | X | X | — | X |
| retention configure | — | — | X | — | X |

## 8.3 Contrataciones Públicas (F2+)

| Acción | PRC_OFFICER | PRC_COMMITTEE | JURIDICO/DIRECTOR | BUD_APPROVER | AUDITOR |
|--------|-------------|---------------|-------------------|--------------|---------|
| procedure:publish | C/S | R | A | R (suficiencia) | R |
| bid:evaluate | R | A | R | — | R |
| award:grant | — | A(+MFA) | A | — | R |
| contract:sign | — | — | X(+MFA) | R | R |

**SoD:** evaluar ≠ adjudicar en solitario para U2+.

## 8.4 Transparencia / Fiscalización (F2+)

| Módulo | Operador | Aprobador | Auditor |
|--------|----------|-----------|---------|
| Transparencia | obligation:publish | Director/TRA lead | R |
| Fiscalización | case:open, finding:issue | finding:close | R/E |

## 8.5 Ciudadanía / Recaudación / Programas (OUT-F1)

Reservado: matrices se activan al readmitir módulos. Principio: PII mínimo, scopes estrictos, MFA para dispersiones y condonaciones.

## 8.6 Matriz cruzada ERP↔GRP (piloto)

| Evento de seguridad | Control |
|---------------------|---------|
| PO approve | RBAC compras + OrgScope + monto + **BudgetCommitted** + documentos mínimos |
| Budget modify | RBAC presupuesto + MFA + monto + scope partida |
| Pago (F1) | RBAC tesorería + MFA + SoD + monto + Budget accrue/pay |
