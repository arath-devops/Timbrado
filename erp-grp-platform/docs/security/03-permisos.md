# Modelo de Permisos

Formato: `resource:action` (+ opcional `field` / `condition`).

## Catálogo base
| Permiso | Descripción |
|---------|-------------|
| `user:read` / `user:write` | Gestión usuarios |
| `role:assign` | Asignación de roles |
| `audit:read` | Consulta auditoría |
| `catalog:read` / `catalog:write` | Catálogos |
| `finance.costcenter:write` | Centros de costo |
| `accounting.journal:create` | Crear asientos |
| `accounting.journal:post` | Contabilizar |
| `budget.allocation:commit` | Comprometer presupuesto |
| `budget.allocation:approve` | Aprobar presupuesto |
| `purchasing.po:approve` | Aprobar OC |
| `treasury.payment:execute` | Ejecutar pagos |
| `payroll.run:approve` | Aprobar nómina |
| `procurement.award:grant` | Adjudicar |
| `citizen.request:manage` | Gestionar trámites |
| `report:export` | Exportar reportes |
| `module:toggle` | Activar/desactivar módulos |

## Separación de funciones (SoD)
Ejemplos bloqueados por política:
- Quien crea OC no puede aprobar la misma OC
- Quien calcula nómina no puede ejecutar el pago
- Quien captura asiento no puede cerrar periodo solo

Implementación: reglas en `iam-service` + validación en workflow.
