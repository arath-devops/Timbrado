# Inventarios
## ERP-INV · Prioridad piloto: **F2+**

### Objetivo
Controlar existencias de bienes en almacenes municipales/empresariales: entradas, salidas, traspasos y valuación básica.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| INV-01 | Administrar almacenes y ubicaciones | Estructura física |
| INV-02 | Alta de ítems / SKU | Maestro de materiales |
| INV-03 | Entrada por compra | Desde recepción |
| INV-04 | Salida por consumo/venta | Egreso controlado |
| INV-05 | Traspaso entre almacenes | Movimiento interno |
| INV-06 | Ajuste de inventario | Con justificación y aprobación |
| INV-07 | Valuación y costo | Promedio / PEPS según política |

### Entradas
- OC/recepción
- Solicitud de material
- Conteos físicos
- Catálogo de ítems
- Costos

### Salidas
- Kardex / existencias
- Movimientos
- Ajustes
- Costo de inventario
- Eventos: StockIncreased, StockDecreased, StockTransferred

### Actores
- **Almacenista:** Opera movimientos
- **Comprador:** Genera entradas
- **Jefe de almacén:** Aprueba ajustes
- **Contador:** Impacto de valuación

### Riesgos
- **Stock negativo:** Corrupción de existencias
- **Ajustes sin control:** Pérdidas
- **Desalineación con compras:** Doble entrada

### Reglas de negocio
1. No permitir stock negativo salvo política explícita auditada.
2. Toda entrada por compra referencia recepción/OC.
3. Ajustes > umbral requieren workflow.
4. Método de valuación es por tenant y no se cambia en periodos abiertos sin migración controlada.

### Notas de alcance (piloto)
Fuera del MVP municipal.
