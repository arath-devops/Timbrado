# 1. Scope Freeze — IAM · Workflow · Document
## BL-S1-CORE-001

## 1.1 Declaración de congelamiento

Queda **congelado** para Sprint 1 (Core Slice) únicamente lo listado en **INCLUIR**.  
Todo lo listado en **EXCLUIR** no se diseña, no se implementa y no se demuestra en este slice.

---

## 1.2 IAM (`iam-service`)

### Incluir (implementación obligatoria)

| Capacidad | Qué significa exactamente |
|-----------|---------------------------|
| **Login** | Password grant (o equivalente JSON) contra tenant; validar usuario ACTIVE; emitir access token; rechazar LOCKED/DISABLED |
| **JWT** | Access token firmado; claims mínimos CA-TEN/API; endpoint JWKS; Resource Servers validan firma/exp/`tenant_id` |
| **Roles** | Catálogo de roles del piloto; crear/listar; asignar/reemplazar roles a usuario |
| **Permisos** | Permisos asociados a roles (lista/códigos en rol); exposición en `/me` y/o embebidos vía roles en JWT (sin motor de policies externo) |
| **Organization Scope** | Grant `OU_SUBTREE` / `OU_EXACT` por usuario; claims `org_scopes` en JWT; `/me` refleja scopes |

También incluidos como soporte necesario del freeze:

- Alta/consulta/lock de usuarios del tenant  
- `GET /api/v1/me` y `GET /api/v1/me/menus` (árbol mínimo)  
- Sesión básica (`sid`) y lock → no emitir tokens nuevos  
- Multi-tenant: `tenant_id` en JWT + RLS (CA-TEN)

### Excluir (prohibido en Sprint 1)

| Capacidad | Nota |
|-----------|------|
| **MFA** | enroll/verify/step-up OUT |
| **SSO** | SAML/OIDC federado enterprise OUT |
| **Federation** | IdP externo, social login, broker OUT |
| Refresh token rotation avanzada / device management | OUT (refresh opcional mínimo no comprometido) |
| SoD matrices / ABAC de monto | OUT (SEC-ARCH diferido) |
| UI consola IAM completa | OUT (API-first; smoke opcional) |

### Criterio de aceptación del módulo IAM

1. Login con usuario seed → JWT con `tenant_id`, `roles`, `org_scopes`, `modules`.  
2. JWKS permite validar el token en otro servicio.  
3. Asignar rol + OrgScope y verlos en `/me`.  
4. Usuario LOCKED no obtiene token.  
5. Cross-tenant rechazado.  
6. Ningún endpoint MFA/SSO expuesto.

---

## 1.3 Workflow (`workflow-service`)

### Incluir

| Capacidad | Qué significa exactamente |
|-----------|---------------------------|
| **Aprobación simple** | Proceso fijo `PO_APPROVAL`: start → tarea OPEN → `CompleteTask(APPROVE)` → `WorkflowApproved` / ProcessCompleted |
| **Rechazo** | `CompleteTask(REJECT)` → `WorkflowRejected`; comentario opcional/recomendado |
| **Comentarios** | Campo `comment` en complete task; persistido en tarea; visible en GET task / eventos (payload) |

Soporte incluido:

- `StartProcess` con `businessRef` + variables mínimas  
- Inbox `GET /tasks` (assigneeMe / por rol candidato)  
- Estados instancia: RUNNING / COMPLETED / REJECTED / CANCELLED  
- Idempotency-Key en start/complete  
- Eventos: `WorkflowStarted`, `WorkflowApproved`, `WorkflowRejected`

### Excluir

| Capacidad | Nota |
|-----------|------|
| **SLA automático** | timers, escalamiento, recordatorios OUT |
| **BPM complejo** | gateways paralelos, multi-etapa, subprocess, diseñador BPMN OUT |
| **Motor de reglas avanzado** | DMN, reglas de monto/Org dinámicas OUT; candidatos = roles fijos de definición |
| Claim/reassign avanzado, parallel approvals | OUT |
| Integración firma documental como tarea | OUT |

### Criterio de aceptación del módulo Workflow

1. Start `PO_APPROVAL` con businessRef de una OC/REQ.  
2. Aparece tarea en inbox del rol aprobador.  
3. APPROVE con comentario → evento `WorkflowApproved`.  
4. REJECT con comentario → evento `WorkflowRejected`; agregados consumidores pueden marcar REJECTED.  
5. Doble complete con misma Idempotency-Key no duplica outcome.  
6. No existen jobs de SLA ni definiciones multi-nodo complejas.

---

## 1.4 Document (`document-service`)

### Incluir

| Capacidad | Qué significa exactamente |
|-----------|---------------------------|
| **Upload** | Multipart a case file; metadatos + `storage_key` en object storage; checksum opcional |
| **Download** | GET metadatos + URL firmada de corta duración (o stream autorizado) |
| **Version básica** | Una versión vigente por upload; nuevo upload sobre mismo doc lógico **o** nuevo `document_item` versionado simple (`version_no` / replace) — ver backlog; **sin** branch/merge |
| **Asociación a expediente** | `CaseFile` + agregar documentos al expediente + `DocumentLink` a agregado de negocio |

Soporte incluido:

- Estados doc: AVAILABLE (QUARANTINED solo si scan stub futuro — no OCR)  
- Eventos: `DocumentUploaded`, `DocumentLinked`  
- AuthZ: solo usuarios del tenant con permiso de módulo document/procurement  

### Excluir

| Capacidad | Nota |
|-----------|------|
| **OCR** | OUT |
| **QR** | OUT |
| **Firma electrónica avanzada** | e.firma, certificados, pads OUT |
| Retención legal / disposición / legal hold UI | OUT |
| Virus scan productivo avanzado | OUT (stub opcional no comprometido) |
| Edición online / preview PDF motor | OUT |

### Criterio de aceptación del módulo Document

1. Crear case file y subir documento.  
2. Descargar vía URL firmada o endpoint autorizado.  
3. Vincular documento a `PurchaseOrder` / `PurchaseRequest`.  
4. Version básica: nueva versión deja rastro (`version_no` o nuevo ítem ligado).  
5. Binario **no** en PostgreSQL.  
6. Sin APIs de OCR/QR/firma.

---

## 1.5 Dependencias entre los tres

```text
IAM ──JWT/JWKS──► Workflow
IAM ──JWT/JWKS──► Document
Document.caseFileId / links ──► usados por Procurement (fuera de este freeze de código, pero contrato estable)
Workflow.businessRef ──► Procurement (consumidor)
```

Orden de construcción del slice: **IAM → Document ∥ Workflow** (en paralelo tras JWT).

## 1.6 Fuera de este documento

Catalog, Audit, Budget, Procurement siguen BL-S1-001 general; este freeze **detalla y prioriza** solo IAM/WF/DOC como primer paquete implementable.
