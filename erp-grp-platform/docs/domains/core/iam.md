# IAM

**Microservicio:** `iam-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Autenticar OIDC
- Asignar roles
- Evaluar ABAC
- Revocar sesión

## Agregados y Entidades

### Agregado `User`
- **Descripción:** Usuario
- **Atributos clave:** username, email, status, mfa

### Agregado `Role`
- **Descripción:** Rol
- **Atributos clave:** code, permissions

### Agregado `Permission`
- **Descripción:** Permiso
- **Atributos clave:** resource, action

### Agregado `Policy`
- **Descripción:** Política ABAC
- **Atributos clave:** rules


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `UserCreated`
- `UserLocked`
- `RoleAssigned`
- `SessionRevoked`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio
