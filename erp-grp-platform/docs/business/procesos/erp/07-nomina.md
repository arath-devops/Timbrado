# Nómina
## ERP-PAY · Prioridad piloto: **OUT-F1**

### Objetivo
Calcular, aprobar, timbrar/dispersar y contabilizar la nómina del personal, con afectación presupuestal en sector público.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| PAY-01 | Cargar incidencias | Insumos del periodo |
| PAY-02 | Crear corrida de nómina | Payroll run |
| PAY-03 | Calcular nómina | Percepciones/deducciones |
| PAY-04 | Aprobar nómina | Workflow y controles |
| PAY-05 | Timbrar / generar recibos | Comprobantes |
| PAY-06 | Dispersar pago | Tesorería |
| PAY-07 | Contabilizar y afectar presupuesto | Asiento + momentos presupuestales |
| PAY-08 | Cerrar corrida | Inmutabilidad del periodo |

### Entradas
- Empleados activos
- Incidencias
- Tabulador / reglas
- Partidas de servicios personales
- Calendario de pagos

### Salidas
- Payslips
- Archivo de dispersión
- Asientos
- Afectación presupuestal
- Eventos: PayrollApproved, PayslipGenerated, PayrollClosed

### Actores
- **Analista de nómina:** Calcula
- **Director / RH:** Aprueba
- **Tesorero:** Paga
- **Presupuesto:** Valida techo
- **Auditor:** Revisa

### Riesgos
- **Cálculo incorrecto:** Conflicto laboral/financiero
- **Pago sin presupuesto:** Irregularidad
- **Fuga de datos salariales:** Privacidad

### Reglas de negocio
1. No se aprueba corrida sin validación de presupuesto de servicios personales.
2. SoD: quien calcula no ejecuta la dispersión.
3. Corrida CERRADA es inmutable.
4. Recálculos generan nueva versión/auditoría, no edición silenciosa.

### Notas de alcance (piloto)
**Fuera de Fase 1** según EA-DEC-001.
