# 3. Expedientes y Metadatos
## EDM-001

## 3.1 Expediente (CaseFile)

El **expediente** es el contenedor documental de un caso de negocio (compra, contrato, trámite, auditoría).

| Atributo | Descripción |
|----------|-------------|
| `caseType` | `PROCUREMENT_FILE`, `BUDGET_FILE`, `CITIZEN_CASE`, `EMPLOYEE_FILE`, `CONTRACT_FILE`, `AUDIT_FILE`… |
| `title` / `code` | Identificador humano (EXP-COMPRA-2026-00123) |
| `owningOrgUnitId` | OU responsable |
| `primaryBusinessRef` | Aggregate ancla (p.ej. PurchaseOrder) |
| `status` | `OPEN`, `CLOSED`, `FROZEN` |
| `index` | Lista ordenada de documentos con rol |

### Roles de ítem en expediente (`roleInCase`)

`COVER` · `REQUEST` · `AUTHORIZATION` · `TECHNICAL` · `FINANCIAL` · `LEGAL` · `SIGNED` · `NOTIFICATION` · `EVIDENCE` · `OTHER`

## 3.2 Expediente mínimo — Compra municipal (MVP)

| Orden | roleInCase | DocumentType típico | Obligatorio |
|-------|------------|---------------------|-------------|
| 1 | REQUEST | Soporte de requisición / solicitud | Condicional |
| 2 | FINANCIAL | Suficiencia / disponibilidad (PDF/system) | Sí al aprobar OC |
| 3 | AUTHORIZATION | OC / autorización | Sí |
| 4 | SIGNED | OC firmada / dictamen | Si umbral exige firma |
| 5 | EVIDENCE | Cotizaciones / anexos | Según política |
| 6 | TECHNICAL | Recepción / evidencia de servicio | F1 |

**Policy BPM:** `REQUIRE_DOCUMENT_SET` valida este checklist antes de `ProcessCompleted`.

## 3.3 Metadatos

### Metadatos de sistema (obligatorios)
`tenantId`, `documentType`, `title`, `mimeType`, `byteSize`, `checksumSha256`, `createdBy/At`, `owningOrgUnitId`, `classification`

### Metadatos de negocio (extensibles por tipo)
Ejemplos: `fiscalYear`, `supplierId`, `budgetKey`, `contractNumber`, `curp`(si aplica), `rfc`, `procedureId`, `language`, `pages`

### Esquema por DocumentType
Cada tipo declara un **metadata schema** (required/optional/datatype).  
Validación en upload y en transición a ACTIVE/SIGNED.

## 3.4 Modelo empresarial vs gubernamental (expediente)

| Aspecto | Empresarial | Gubernamental |
|---------|-------------|---------------|
| Nombre | Project/Vendor file / Deal room | Expediente administrativo / electrónico |
| Series | Por proceso interno | Series documentales / cuadro de clasificación |
| Cierre | Al cerrar PO/proyecto | Al concluir actuación + plazos legales |
| Acceso | ACL OU + roles | + posible transparencia / acceso a la información (metadatos no PII) |

## 3.5 Justificación

En GRP el “adjunto suelto” falla auditorías. El expediente con roles tipados permite demostrar **completitud** ante contraloría (equivalente a records file plan).
