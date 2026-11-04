# Catálogos

**Microservicio:** `catalog-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- CRUD catálogo
- Resolver i18n
- Publicar versión

## Agregados y Entidades

### Agregado `Catalog`
- **Descripción:** Catálogo maestro
- **Atributos clave:** code, name

### Agregado `CatalogItem`
- **Descripción:** Ítem
- **Atributos clave:** code, labels, attrs


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `CatalogItemCreated`
- `CatalogItemUpdated`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio
