# `iam-service`
## SA-MS-001 · Capa **Core** · Prioridad: **MVP**

### Responsabilidad
Gestionar identidad, autenticación OIDC/OAuth2, usuarios, roles, permisos, OrgScope grants, sesiones, MFA y emisión/validación de tokens (JWKS).

### Límites (Bounded Context)

**Posee / es dueño de:**
- UserAccount
- Role
- Permission catalog
- Session
- MFA devices
- OrgScope grants
- Authorization Server

**No posee / no debe hacer:**
- Autorizar reglas de monto de negocio (eso es ABAC en RS + policies)
- Guardar documentos
- Orquestar aprobaciones de compras
- Enviar emails directamente

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/oauth2/token` | Token endpoint |
| `GET` | `/oauth2/jwks` | JWKS |
| `GET` | `/api/v1/users` | Listar usuarios |
| `POST` | `/api/v1/users` | Crear usuario |
| `POST` | `/api/v1/users/{id}/roles` | Asignar rol |
| `POST` | `/api/v1/users/{id}/lock` | Bloquear |
| `GET` | `/api/v1/roles` | Listar roles |
| `POST` | `/api/v1/roles` | Crear rol |
| `POST` | `/api/v1/scopes` | Grant OrgScope |
| `GET` | `/api/v1/me` | Perfil, roles, scopes, módulos |
| `GET` | `/api/v1/me/menus` | Menús dinámicos |
| `POST` | `/api/v1/mfa/enroll` | Alta MFA |
| `POST` | `/api/v1/mfa/verify` | Verificar MFA / step-up |

### Eventos publicados
- `UserRegistered`
- `UserLocked`
- `RoleAssigned`
- `RoleRevoked`
- `SessionRevoked`
- `MfaEnrolled`
- `OrgScopeGranted`

### Eventos consumidos
- `TenantModulesChanged`
- `EmployeeTerminated (futuro → lock user)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `iam_db`
- Regla: acceso exclusivo de `iam-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version` (optimistic lock)

### Dependencias
- `PostgreSQL`
- `Redis (sesiones/denylist/rate-limit)`
- `Kafka`
- `IdP externo opcional`

### Notas de contrato
Published Language de seguridad. Todos los RS dependen de JWKS. No embeber permisos infinitos en JWT; claims: tenant_id, roles, org_scopes, modules, amr, sid.
