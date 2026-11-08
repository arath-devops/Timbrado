# Convenciones de código

## Java
- Java 21, `records`, pattern matching, virtual threads donde aplique
- Paquetes hexagonales (domain/application/infrastructure/interfaces)
- Sin lógica de negocio en controllers
- MapStruct para DTO mapping
- Flyway obligatorio
- Tests: unit (AssertJ) + @SpringBootTest slice + Testcontainers

## Angular
- Standalone components
- Strict TypeScript
- State: signals / NgRx por MFE según complejidad
- i18n runtime (`es-MX`, `en-US`)
- Accesibilidad WCAG 2.2 AA

## SQL
- snake_case, UUID PKs, índices tenant-aware
