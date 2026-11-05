# `transparency-service`
## SA-MS-001 · Capa **GRP** · Prioridad: **F2+**

### Responsabilidad
Obligaciones de transparencia, preparación/publicación de paquetes y atención de solicitudes de información (metadatos/evidencias).

### Límites (Bounded Context)

**Posee / es dueño de:**
- Obligation
- PublicationPackage
- InformationRequest

**No posee / no debe hacer:**
- Calcular presupuesto
- Expedir contratos (solo consume)
- Binarios (link a document-service)

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/obligations` | Definir obligación |
| `POST` | `/api/v1/publications` | Publicar paquete |
| `GET` | `/api/v1/publications` | Listar públicas |
| `POST` | `/api/v1/information-requests` | Alta solicitud |
| `POST` | `/api/v1/information-requests/{id}/respond` | Responder |

### Eventos publicados
- `ObligationPublished`
- `PublicationUpdated`
- `InformationRequestOpened`
- `InformationRequestClosed`

### Eventos consumidos
- `BudgetApproved`
- `PurchaseOrderApproved`
- `PublicContractSigned (futuro)`
- `CaseFileClosed`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `transparency_db`
- Regla: acceso exclusivo de `transparency-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `IAM`
- `document-service`
- `catalog-service`
- `audit-service`
- `notification-service`

### Notas de contrato
No publica PII. Usa Document links + metadatos. F2+.
