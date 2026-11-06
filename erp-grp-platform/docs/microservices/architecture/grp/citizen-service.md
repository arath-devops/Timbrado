# `citizen-service`
## SA-MS-001 · Capa **GRP** · Prioridad: **OUT-F1**

### Responsabilidad
Gestión ciudadana: padrón básico, solicitudes de trámite, citas y seguimiento de casos (expediente vía document-service).

### Límites (Bounded Context)

**Posee / es dueño de:**
- Citizen
- ServiceRequest
- Appointment

**No posee / no debe hacer:**
- Recaudación
- Programas sociales (emite refs)
- Portal auth ciudadano completo (realm IAM separado)

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/citizens` | Registrar |
| `GET` | `/api/v1/citizens/{id}` | Detalle |
| `POST` | `/api/v1/service-requests` | Abrir trámite |
| `POST` | `/api/v1/service-requests/{id}/close` | Cerrar |
| `POST` | `/api/v1/appointments` | Agendar |

### Eventos publicados
- `CitizenRegistered`
- `ServiceRequestOpened`
- `ServiceRequestClosed`
- `AppointmentScheduled`

### Eventos consumidos
- `ProcessCompleted(CITIZEN_REQUEST_RESOLUTION)`
- `DocumentLinked`
- `TaxPaymentReceived (opcional)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `citizen_db`
- Regla: acceso exclusivo de `citizen-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `Elasticsearch`
- `IAM`
- `workflow-service`
- `document-service`
- `notification-service`
- `audit-service`

### Notas de contrato
**OUT-F1**. PII estricto; scopes separados.
