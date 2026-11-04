# Compras
## ERP-PUR · Prioridad piloto: **MVP + F1**

### Objetivo
Gestionar el ciclo Procure-to-Pay desde la necesidad hasta la recepción y matching con factura, asegurando vínculo con presupuesto, documentos y aprobaciones.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| PUR-01 | Crear requisición | Solicitud de bienes/servicios por área |
| PUR-02 | Aprobar requisición | Workflow según monto/unidad |
| PUR-03 | Crear orden de compra | Formalización con proveedor |
| PUR-04 | Aprobar orden de compra | Incluye check de disponibilidad presupuestal |
| PUR-05 | Registrar recepción (GRN) | Entrada de bienes/servicios |
| PUR-06 | Registrar / cuadrar factura | 2-way o 3-way match |
| PUR-07 | Gestionar proveedores (operativo) | Alta rápida / evaluación básica |
| PUR-08 | Cancelar / cerrar OC | Cierre total o parcial |

### Entradas
- Necesidad del área
- Catálogo de productos/servicios
- Proveedor
- Partida presupuestal / centro de costo
- Cotizaciones / contrato (si existe)
- Documentos soporte

### Salidas
- Requisición
- OC aprobada
- Recepción
- Factura matched
- Solicitud de pago
- Eventos: PurchaseRequisitionCreated, PurchaseOrderApproved, GoodsReceived, InvoiceMatched

### Actores
- **Capturista / Requisitor:** Crea solicitud
- **Jefe de área / Director:** Aprueba
- **Comprador:** Emite OC
- **Almacén / Receptor:** Recibe
- **Cuentas por pagar:** Cuadra factura
- **Analista presupuestal:** Valida afectación

### Riesgos
- **Compra sin presupuesto:** Sobregiro
- **3-way match fallido:** Pagos indebidos
- **Proveedor no validado:** Riesgo de fraude
- **Documentación incompleta:** Observaciones de auditoría

### Reglas de negocio
1. No se aprueba OC sin disponibilidad presupuestal suficiente (regla municipal crítica).
2. Toda OC aprobada genera o confirma compromiso presupuestal.
3. Montos y umbrales determinan nivel de aprobación (RBAC + workflow).
4. No se paga factura sin match mínimo definido (OC y/o recepción).
5. Anexos documentales obligatorios según tipo de compra.
6. Cancelación de OC libera compromiso no ejercido.
7. SoD: quien crea la OC no puede aprobarla en el mismo flujo.

### Notas de alcance (piloto)
**MVP:** PUR-01..04 + documentos + compromiso. **F1:** recepción, matching, enlace a pago.
