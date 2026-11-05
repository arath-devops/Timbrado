# Presupuesto Público
## GRP-BUD · Prioridad piloto: **MVP + F1**

### Objetivo
Planear, autorizar, controlar y reportar el ejercicio del gasto público mediante claves presupuestales y momentos contables (comprometido, devengado, ejercido/pagado), evitando sobregiros.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| BUD-01 | Formular anteproyecto | Carga de techos y proyectos de gasto |
| BUD-02 | Aprobar presupuesto | Autorización del ciclo/anualidad |
| BUD-03 | Activar asignaciones / partidas | Claves con montos autorizados |
| BUD-04 | Verificar disponibilidad | Availability check en tiempo real |
| BUD-05 | Registrar compromiso | Reserva por OC/contrato/nómina |
| BUD-06 | Registrar devengado | Obligación por recepción/factura |
| BUD-07 | Registrar ejercido / pagado | Liquidación con tesorería |
| BUD-08 | Modificar presupuesto | Ampliaciones, reducciones, transferencias |
| BUD-09 | Congelar / cerrar periodo | Cortes mensuales/anuales |
| BUD-10 | Generar reportes de ejercicio / cuenta pública básica | Información de control |

### Entradas
- Techos autorizados
- Catálogo de claves presupuestales
- Eventos de compras/contratos/nómina/pagos
- Normativa presupuestal municipal
- Solicitudes de modificación

### Salidas
- Ciclo presupuestario
- Partidas ACTIVE
- Movimientos por momento contable
- Disponibilidad
- Reportes de ejercicio
- Eventos: BudgetApproved, BudgetCommitted, BudgetAccrued, BudgetPaid, BudgetModified

### Actores
- **Analista presupuestal:** Formula y controla
- **Director de finanzas / Tesorería municipal:** Aprueba modificaciones
- **Comprador / áreas:** Consumen disponibilidad
- **Auditor / Contraloría:** Fiscaliza ejercicio
- **Autoridad / Cabildo:** Aprueba presupuesto — fuera de sistema o vía integración

### Riesgos
- **Sobregiro:** Ilegalidad / observación grave
- **Doble compromiso:** Infla obligaciones
- **Modificaciones sin control:** Pérdida de trazabilidad
- **Claves mal parametrizadas:** Ejercicio incorrecto

### Reglas de negocio
1. En todo momento: Autorizado ≥ Comprometido ≥ Devengado ≥ Pagado.
2. Ningún compromiso se registra sin disponibilidad suficiente.
3. Las modificaciones requieren workflow y dejan auditoría.
4. Partidas FROZEN/CLOSED no admiten nuevos compromisos.
5. Todo compromiso referencia documento origen (OC, contrato, nómina, etc.).
6. La liberación por cancelación de OC reduce comprometido no devengado.
7. Consultas de disponibilidad son consistentes con el último movimiento confirmado (eventual consistency controlada).

### Notas de alcance (piloto)
**MVP:** ciclo, partidas, disponibilidad, compromiso básico con compras. **F1:** momentos completos + modificaciones.
