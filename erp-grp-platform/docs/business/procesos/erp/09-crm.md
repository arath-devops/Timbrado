# CRM
## ERP-CRM · Prioridad piloto: **F2+**

### Objetivo
Gestionar relación con clientes/ciudadanos potenciales en contextos comerciales o de servicios de cobro, desde lead hasta cuenta.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| CRM-01 | Captar lead | Interés inicial |
| CRM-02 | Calificar oportunidad | Pipeline |
| CRM-03 | Gestionar cuenta / contacto | Maestro comercial |
| CRM-04 | Cotizar | Propuesta comercial |
| CRM-05 | Cerrar oportunidad | Ganada/perdida → ventas/facturación |
| CRM-06 | Seguimiento postventa | Casos / satisfacción |

### Entradas
- Campañas
- Contactos
- Histórico de interacciones
- Catálogo de productos/servicios

### Salidas
- Leads
- Oportunidades
- Cuentas
- Cotizaciones
- Eventos: LeadCreated, OpportunityWon, OpportunityLost

### Actores
- **Ejecutivo comercial:** Gestiona pipeline
- **Supervisor:** Forecast
- **Facturación:** Recibe cierre ganado

### Riesgos
- **Duplicidad de cuentas:** Mala calidad de datos
- **Fuga de pipeline:** Pérdida de ingresos

### Reglas de negocio
1. Una oportunidad ganada referencia cuenta válida.
2. No eliminar leads: se archivan (auditoría).
3. Datos de contacto sujetos a consentimiento/privacidad.

### Notas de alcance (piloto)
Baja prioridad para piloto municipal de gasto; diferido.
