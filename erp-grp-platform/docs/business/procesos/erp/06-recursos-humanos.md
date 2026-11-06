# Recursos Humanos
## ERP-HR · Prioridad piloto: **F2+**

### Objetivo
Administrar el ciclo de vida del empleado/servidor público: plazas, altas, movimientos y bajas, como maestro para nómina y organigrama.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| HR-01 | Administrar organigrama y plazas | Estructura de puestos |
| HR-02 | Reclutar / seleccionar (básico) | Vacante a candidato |
| HR-03 | Alta de empleado | Contrato e ingreso |
| HR-04 | Movimientos de personal | Promoción, transferencia, comisión |
| HR-05 | Registrar incidencias laborales | Faltas, permisos, horas extra — input a nómina |
| HR-06 | Baja / término | Fin de relación laboral |

### Entradas
- Plaza autorizada
- Documentos del empleado
- Tabulador
- Incidencias
- Normativa laboral

### Salidas
- Expediente de personal
- Empleado activo
- Movimientos
- Incidencias
- Eventos: EmployeeCreated, EmployeeUpdated, EmployeeTerminated

### Actores
- **HR Officer:** Gestiona altas/movimientos
- **Jefe de área:** Solicita plaza/movimiento
- **Empleado:** Consulta datos propios
- **Nómina:** Consume maestro

### Riesgos
- **Alta sin plaza:** Gasto no autorizado
- **Datos personales sensibles:** Cumplimiento privacidad
- **Desalineación con nómina:** Pagos erróneos

### Reglas de negocio
1. No hay alta sin plaza/presupuesto de servicios personales cuando aplique.
2. CURP/RFC/Id únicos por tenant.
3. Cambios salariales quedan versionados y auditados.
4. Baja corta acceso IAM vinculado.

### Notas de alcance (piloto)
Maestro RRHH puede anticiparse parcialmente; **Nómina está OUT-F1**.
