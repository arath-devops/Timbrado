# `audit-service`
## SA-MS-001 · Capa **Core** · Prioridad: **MVP**

### Responsabilidad
Ingesta append-only de hechos auditables, consulta de trails, verificación de integridad (hash chain) y exportación controlada.

### Límites (Bounded Context)

**Posee / es dueño de:**
- AuditFact
- AuditTrail
- Integrity verification jobs

**No posee / no debe hacer:**
- Decidir autorizaciones
- Mutar aggregates de negocio
- UI transaccional

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/facts` | Registrar hecho (interno/M2M) |
| `GET` | `/api/v1/trails/{entityType}/{entityId}` | Trail de entidad |
| `GET` | `/api/v1/facts/search` | Búsqueda |
| `POST` | `/api/v1/trails/{id}/verify` | Verificar hash chain |
| `GET` | `/api/v1/facts/export` | Export (permiso fuerte) |

### Eventos publicados
- `AuditFactRecorded`
- `AuditIntegrityBroken`

### Eventos consumidos
- `*DomainEvent vía audit bridge / publishers`
- `DocumentDownloaded`
- `BreakGlassUsed`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `audit_db (+ ES index opcional)`
- Regla: acceso exclusivo de `audit-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version` (optimistic lock)

### Dependencias
- `PostgreSQL`
- `Kafka`
- `Elasticsearch (search)`
- `IAM JWKS`

### Notas de contrato
Contrato de escritura genérico EntityRef+payload. Consumidores Conformist al envelope. Particionar por tiempo.
