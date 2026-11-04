# Finanzas
## ERP-FIN · Prioridad piloto: **F2+**

### Objetivo
Gobernar la estructura financiera de la entidad (centros de costo/unidades responsables, periodos, tipologías de gasto e ingreso, y controles financieros previos a la contabilización detallada).

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| FIN-01 | Definir estructura financiera | Alta de unidades responsables / centros de costo y jerarquías |
| FIN-02 | Administrar periodos financieros | Apertura, congelamiento y cierre de periodos de gestión |
| FIN-03 | Gestionar tipos de cambio | Registro y vigencia de FX multi-moneda |
| FIN-04 | Clasificar gasto / ingreso | Naturaleza económica y dimensiones analíticas |
| FIN-05 | Control presupuestal-financiero | Alertas de desviación presupuesto vs real (cuando exista contabilidad) |
| FIN-06 | Consultar ejecución financiera | Tableros operativos de gasto/compromiso por unidad |

### Entradas
- Organigrama / unidades administrativas
- Política de centros de costo
- Calendario fiscal
- Catálogos de moneda y dimensiones
- Datos de ejecución contable/presupuestal

### Salidas
- Estructura financiera vigente
- Periodos abiertos/cerrados
- Tipos de cambio publicados
- Reportes de ejecución por unidad
- Eventos: CostCenterCreated, PeriodClosed, ExchangeRateUpdated

### Actores
- **Administrador financiero:** Configura estructura y periodos
- **Director / Jefe de área:** Consulta ejecución de su unidad
- **Analista financiero:** Mantiene dimensiones y FX
- **Auditor:** Revisa cambios de estructura

### Riesgos
- **Estructura mal diseñada:** Dificulta reporting y afectaciones
- **Cierre prematuro de periodo:** Bloquea operación legítima
- **FX desactualizado:** Distorsión multi-moneda

### Reglas de negocio
1. Toda transacción financiera debe referenciar unidad responsable válida y vigente.
2. No se permiten movimientos en periodos CERRADOS salvo rol break-glass auditado.
3. Los tipos de cambio tienen vigencia temporal; se aplica el vigente a la fecha contable.
4. La jerarquía de centros de costo no admite ciclos.
5. Los cambios de estructura de periodos anteriores requieren justificación y auditoría.

### Notas de alcance (piloto)
No es núcleo del MVP municipal; se usa parcialmente vía unidades en Catálogos y Presupuesto.
