# Modelo Organizacional Corporativo y Gubernamental
## ORG-001 — Consultoría ERP/GRP

| Campo | Valor |
|-------|--------|
| Documento | ORG-001 |
| Entradas | EA-VIS-001, EA-DEC-001, DDD-001 (IAM / Tenant) |
| Objetivo | Metamodelo **reutilizable** para entidades privadas y públicas |
| Piloto | Municipal (tenant dedicado) usando el mismo metamodelo |
| Estado | Diseño funcional/conceptual (sin código) |

## Contenido

1. [Metamodelo y principios](01-METAMODELO.md)
2. [Tipos organizacionales y equivalencias](02-TIPOS-Y-EQUIVALENCIAS.md)
3. [Jerarquías](03-JERARQUIAS.md)
4. [Responsabilidades y puestos](04-RESPONSABILIDADES.md)
5. [Dependencias entre unidades](05-DEPENDENCIAS-ORG.md)
6. [Permisos organizacionales](06-PERMISOS-ORGANIZACIONALES.md)
7. [Ejemplos Holding / Empresa / Municipio](07-EJEMPLOS.md)

## Pregunta de diseño resuelta

> ¿Necesitamos una entidad distinta por cada etiqueta (Secretaría, Dirección, Departamento…)?  
> **No.** Se usa un metamodelo único de **Unidad Organizacional (OrgUnit)** tipada + una capa de **Entidad Legal / Party**, reutilizable. Las etiquetas son **tipos/clasificadores**, no tablas distintas por sinónimo.
