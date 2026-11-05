# 5. Tablero consolidado — orden de entrega
## BL-S1-CORE-001

## 5.1 Capacidad total del slice

| Módulo | Pts approx. | Stories Must (P0/P1) |
|--------|-------------|----------------------|
| IAM | ~38 | IAM-001…012 |
| Workflow | ~31 | WF-001…009 |
| Document | ~30 | DOC-001…009 |
| **Total** | **~99** | — |

> Esfuerzo relativo para planificación; el PO ajusta capacidad real del equipo.

## 5.2 Oleadas de entrega

### Oleada A — Fundación IAM (bloqueante)
`IAM-001 → IAM-002 → IAM-003 → IAM-006 → IAM-004 → IAM-007 → IAM-008 → IAM-009 → IAM-012`  
Paralelo tardío: `IAM-005`, `IAM-010`, `IAM-011`

**Exit criteria A:** Login + JWT + JWKS + roles + OrgScope + `/me` demoables.

### Oleada B — Document ∥ Workflow (en paralelo tras A)
**Document:** `DOC-001 → DOC-002 → DOC-003 → DOC-004 → DOC-005 → DOC-006 → DOC-008 → DOC-009` → luego `DOC-007`  
**Workflow:** `WF-001 → WF-002 → WF-003 → WF-004 → WF-005 → WF-007 → WF-008 → WF-009` → `WF-006`

**Exit criteria B:** Upload/download/link + approve/reject con comentario + eventos Kafka en int.

### Oleada C — Integración mínima cross-slice
- Token IAM usado en llamadas WF y DOC  
- Case file + link listos para Procurement (consumidor posterior)  
- `PO_APPROVAL` startable con businessRef de prueba  

## 5.3 Backlog board (prioridad global)

| Orden | ID | Título | P | Pts | Estado |
|------:|----|--------|---|-----|--------|
| 1 | IAM-001 | Schema + seed tenant/roles | P0 | 3 | To Do |
| 2 | IAM-002 | Login + JWT | P0 | 5 | To Do |
| 3 | IAM-003 | JWKS | P0 | 2 | To Do |
| 4 | IAM-006 | Roles CRUD | P0 | 3 | To Do |
| 5 | IAM-004 | Users create/list | P1 | 5 | To Do |
| 6 | IAM-007 | Assign roles / permissions | P0 | 3 | To Do |
| 7 | IAM-008 | OrgScope | P0 | 5 | To Do |
| 8 | IAM-009 | GET /me | P0 | 2 | To Do |
| 9 | IAM-012 | RLS + DoD tests | P0 | 5 | To Do |
| 10 | DOC-001 | Schema + storage | P0 | 5 | To Do |
| 11 | WF-001 | Schema + PO_APPROVAL def | P0 | 3 | To Do |
| 12 | DOC-002 | Create case file | P0 | 3 | To Do |
| 13 | WF-002 | StartProcess | P0 | 5 | To Do |
| 14 | DOC-003 | Upload | P0 | 5 | To Do |
| 15 | WF-003 | Inbox | P0 | 3 | To Do |
| 16 | DOC-004 | Download | P0 | 3 | To Do |
| 17 | WF-004 | Approve + comment | P0 | 5 | To Do |
| 18 | WF-005 | Reject + comment | P0 | 5 | To Do |
| 19 | DOC-006 | DocumentLink | P0 | 3 | To Do |
| 20 | DOC-005 | List case docs | P0 | 2 | To Do |
| 21 | WF-007 / DOC-008 | Outbox events | P0 | 2–3 | To Do |
| 22 | WF-008 | Idempotency guards | P0 | 3 | To Do |
| 23 | IAM-005 / IAM-010 / IAM-011 | Lock, menus, events | P1 | 2–3 c/u | To Do |
| 24 | DOC-007 | Version básica | P1 | 5 | To Do |
| 25 | WF-006 | GET process/task | P1 | 2 | To Do |
| 26 | DOC-009 / WF-009 | DoD close | P0 | 5 | To Do |

## 5.4 Definition of Done del slice (PO acceptance)

El Core Slice se acepta cuando:

1. **IAM:** login municipal, JWT/JWKS, roles, permisos vía rol, OrgScope, `/me` — sin MFA/SSO/Federation.  
2. **Workflow:** start `PO_APPROVAL`, approve y reject con comentarios, eventos — sin SLA/BPM/reglas avanzadas.  
3. **Document:** upload, download, case file, link a agregado, version básica — sin OCR/QR/firma avanzada.  
4. Tres servicios cumplen checklists DoD-001 aplicables (API, DB, security, tests, docker mínimos acordados al sprint).  
5. Demo en int: usuario A sube doc a expediente; usuario B aprueba/rechaza tarea con comentario usando JWT emitido por IAM.

## 5.5 Change Control

| Pedido | Acción |
|--------|--------|
| Agregar MFA/SSO/Federation | Rechazar → CR post Sprint 1 |
| Agregar SLA WF | Rechazar |
| Agregar OCR/QR/Firma | Rechazar |
| Ajustar candidateRoles PO_APPROVAL | PO + SA (menor, sin CR formal si no rompe freeze) |
| Ampliar versionado documental | PO + SA |
