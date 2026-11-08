# `notification-service`
## SA-MS-001 · Capa **Core** · Prioridad: **MVP**

### Responsabilidad
Despachar notificaciones multi-canal (in-app, email, SMS futuro, push futuro) a partir de comandos/eventos, con plantillas y preferencias.

### Límites (Bounded Context)

**Posee / es dueño de:**
- Notification
- Template
- DeliveryAttempt
- UserPreference

**No posee / no debe hacer:**
- Decidir quién aprueba
- Generar PDF
- Lógica de negocio ERP/GRP

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/notifications` | Enviar (M2M/command) |
| `GET` | `/api/v1/notifications/inbox` | In-app inbox |
| `POST` | `/api/v1/notifications/{id}/read` | Marcar leída |
| `GET` | `/api/v1/templates` | Plantillas |
| `PUT` | `/api/v1/preferences/me` | Preferencias |

### Eventos publicados
- `NotificationQueued`
- `NotificationSent`
- `NotificationFailed`

### Eventos consumidos
- `TaskCreated`
- `TaskEscalated`
- `ProcessCompleted`
- `ProcessRejected`
- `PaymentExecuted`
- `DocumentSigned`
- `*NotificationRequested`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `notification_db`
- Regla: acceso exclusivo de `notification-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version` (optimistic lock)

### Dependencias
- `PostgreSQL`
- `Kafka`
- `Redis`
- `SMTP/Provider`
- `IAM`

### Notas de contrato
Solo consume eventos/commands; plantillas versionadas; PII mínima en canales externos.
