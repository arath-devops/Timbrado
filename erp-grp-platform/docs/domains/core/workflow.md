# Workflow

**Microservicio:** `workflow-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Iniciar proceso
- Completar tarea
- Escalar
- Cancelar

## Agregados y Entidades

### Agregado `ProcessDefinition`
- **Descripción:** Definición BPMN/DSL
- **Atributos clave:** key, version

### Agregado `ProcessInstance`
- **Descripción:** Instancia
- **Atributos clave:** definitionKey, status

### Agregado `Task`
- **Descripción:** Tarea humana
- **Atributos clave:** assignee, status


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `ProcessStarted`
- `TaskCompleted`
- `ProcessCompleted`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio
