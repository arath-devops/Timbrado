# `document-service`
## SA-MS-001 · Capa **Core / EDM** · Prioridad: **MVP**

### Responsabilidad
Enterprise Document Management: documentos, versiones, expedientes, metadatos, hash, QR, OCR, firmas y retención.

### Límites (Bounded Context)

**Posee / es dueño de:**
- Document
- DocumentVersion
- CaseFile
- Metadata
- SignatureRecord
- QrToken
- RetentionPolicy

**No posee / no debe hacer:**
- Aprobar OC
- Calcular presupuesto
- Guardar blobs en DB relacional

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/documents` | Upload metadata+content |
| `POST` | `/api/v1/documents/{id}/versions` | Nueva versión |
| `GET` | `/api/v1/documents/{id}` | Metadatos |
| `GET` | `/api/v1/documents/{id}/content` | Download (URL firmada) |
| `POST` | `/api/v1/documents/{id}/links` | BusinessLink |
| `POST` | `/api/v1/case-files` | Abrir expediente |
| `POST` | `/api/v1/case-files/{id}/items` | Agregar doc |
| `POST` | `/api/v1/case-files/{id}/checklist:validate` | Validar checklist |
| `POST` | `/api/v1/documents/{id}/signatures` | Firmar versión |
| `GET` | `/api/v1/verify/{token}` | Verificación QR |
| `POST` | `/api/v1/documents/{id}/verify-integrity` | Verificar hash |

### Eventos publicados
- `DocumentUploaded`
- `DocumentVersioned`
- `DocumentLinked`
- `DocumentSigned`
- `DocumentQuarantined`
- `CaseFileOpened`
- `CaseFileClosed`
- `DocumentIntegrityBroken`
- `DocumentDisposed`

### Eventos consumidos
- `ProcessCompleted (opcional cerrar sección)`
- `RetentionDue (internal)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `document_db + Object Storage + ES(OCR)`
- Regla: acceso exclusivo de `document-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version` (optimistic lock)

### Dependencias
- `PostgreSQL`
- `Object Storage`
- `Kafka`
- `Redis`
- `IAM`
- `Antivirus/OCR workers`
- `workflow-service (callbacks)`
- `audit-service`

### Notas de contrato
Único dueño de binarios. SHA-256 obligatorio. Firmas invocadas por workflow.
