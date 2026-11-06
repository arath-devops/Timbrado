# Activos Fijos
## ERP-FA · Prioridad piloto: **F2+**

### Objetivo
Registrar, depreciar y dar de baja bienes de capital, manteniendo trazabilidad patrimonial y contable.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| FA-01 | Alta de activo | Desde compra o capitalización |
| FA-02 | Clasificar y etiquetar | Categoría, vida útil, ubicación |
| FA-03 | Calcular depreciación | Corrida periódica |
| FA-04 | Transferir / reasignar | Cambio de responsable/ubicación |
| FA-05 | Baja / disposición | Venta, donación, destrucción |
| FA-06 | Inventario físico de activos | Conteo y conciliación |

### Entradas
- OC/recepción de capitalizables
- Catálogo de categorías
- Política de depreciación
- Responsable patrimonial

### Salidas
- Registro patrimonial
- Depreciaciones
- Bajas
- Asientos
- Eventos: AssetCreated, AssetDepreciated, AssetDisposed

### Actores
- **Responsable patrimonial:** Custodia
- **Contador:** Depreciación
- **Compras:** Origen del alta
- **Auditor:** Verifica existencia

### Riesgos
- **Activo no capitalizado:** Subvaluación
- **Depreciación duplicada:** Gasto indebido
- **Baja sin evidencia:** Riesgo de fraude

### Reglas de negocio
1. Activos sobre umbral de capitalización no se gastan 100% en compra.
2. Depreciación solo en activos ACTIVE.
3. Baja requiere acta/documento y workflow.
4. Cada activo tiene responsable único vigente.

### Notas de alcance (piloto)
Fuera del MVP.
