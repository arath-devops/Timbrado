# 4. Backlog detallado — Document
## BL-S1-CORE-001

**Epic:** `E-DOC-S1` — Expediente documental básico Sprint 1  
**Servicio:** `document-service`  
**DoD:** DoD-001 · OpenAPI `shared/openapi/document/v1.yaml` · DDL `database/flyway/document/`

---

### DOC-001 — Schema + object storage adapter
| Campo | Valor |
|-------|--------|
| Tipo | Enabler |
| Prioridad | P0 |
| Pts | 5 |
| Como | equipo |
| Quiero | Flyway document_db + cliente storage (S3/MinIO) |
| Para | guardar binarios fuera de PG |
| AC | Tablas case_file, document_item, document_link; bucket/prefix `{tenantId}/...`; health readiness si storage down → DOWN |
| Out | OCR pipeline |

### DOC-002 — Crear expediente (CaseFile)
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 3 |
| Como | capturista / sistema |
| Quiero | abrir un expediente |
| Para | agrupar documentos de una compra |
| AC | `POST /api/v1/case-files`; title + owningBoundedContext; status OPEN; GET por id; tenant RLS |
| Depende | DOC-001, IAM JWT |

### DOC-003 — Upload a expediente
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 5 |
| Como | capturista |
| Quiero | subir un archivo al expediente |
| Para | adjuntar evidencia |
| AC | `POST /case-files/{id}/documents` multipart; docType de catálogo DOC_TYPE; contentType/size; storage_key; checksum opcional verificado; evento `DocumentUploaded`; límites size documentados (ej. 20MB); 413/415 según OpenAPI |
| Depende | DOC-002 |

### DOC-004 — Download
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 3 |
| Como | usuario autorizado |
| Quiero | descargar el documento |
| Para | revisar evidencia |
| AC | `GET /documents/{id}?includeDownloadUrl=true` devuelve URL firmada con expiry; 403 cross-tenant / sin rol; no exponer path interno crudo sin firma |
| Depende | DOC-003 |

### DOC-005 — Asociación a expediente (ya en upload) + listado
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 2 |
| Como | capturista |
| Quiero | ver documentos del case file |
| Para | validar expediente completo |
| AC | GET case file incluye `documentIds` o endpoint list; todo doc uploaded queda asociado al case_file_id |
| Depende | DOC-003 |

### DOC-006 — DocumentLink a agregado de negocio
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 3 |
| Como | sistema / capturista |
| Quiero | vincular documento a PurchaseOrder/Request |
| Para | trazar expediente↔compra |
| AC | `POST /documents/{id}/links`; relation SUPPORTING\|PRIMARY\|ANNEX; unique link; evento `DocumentLinked` |
| Depende | DOC-003 |

### DOC-007 — Version básica
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P1 |
| Pts | 5 |
| Como | capturista |
| Quiero | subir una nueva versión del mismo documento lógico |
| Para | corregir un anexo sin perder historial mínimo |
| AC | `POST /documents/{id}/versions` **o** convención: nuevo upload con `replacesDocumentId`; `version_no` incrementa; versión anterior queda AVAILABLE histórica o superseded status simple; download default = latest; **sin** merge/branch; sin OCR de diff |
| Decisión SA | Preferir columna `version_no` + `document_group_id` (UUID estable) en `document_item` si V1 DDL no basta → migración `V3__document_version.sql` en implementación |
| Depende | DOC-003, DOC-004 |
| Out | Firma por versión, QR de verificación |

### DOC-008 — Outbox eventos document
| Campo | Valor |
|-------|--------|
| Tipo | Enabler |
| Prioridad | P0 |
| Pts | 2 |
| Como | plataforma |
| Quiero | DocumentUploaded / DocumentLinked |
| Para | saga y audit |
| AC | EDA-MVP schemas; key tenantId:documentId |
| Depende | DOC-003, DOC-006 |

### DOC-009 — AuthZ módulo + tests DoD
| Campo | Valor |
|-------|--------|
| Tipo | Enabler |
| Prioridad | P0 |
| Pts | 5 |
| Como | equipo |
| Quiero | permisos mínimos y isolation tests |
| Para | Done |
| AC | Solo roles con module document/procurement; RLS; coverage; OpenAPI |
| Depende | DOC-001–008 |

### DOC-010 (OUT) — OCR / QR / Firma avanzada
| Campo | Valor |
|-------|--------|
| Tipo | **Excluido** |
| Pts | 0 |
| Nota | No endpoints `/signatures`, `/verify/{token}`, OCR jobs |

---

## Totales Document

| Prioridad | Pts aprox. |
|-----------|------------|
| P0 | 25 |
| P1 | 5 |
| **Total** | **~30** |

## Definición “versión básica” (congelada)

1. Un documento lógico = `document_group_id`.  
2. Cada upload de versión = fila `document_item` con `version_no` N+1.  
3. Latest = max(version_no) donde status AVAILABLE.  
4. No hay borrado físico de versiones en Sprint 1 (opcional superseded).
