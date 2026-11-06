# Gestión Ciudadana
## GRP-CIT · Prioridad piloto: **OUT-F1**

### Objetivo
Gestionar la relación del municipio con la ciudadanía: trámites, citas, seguimiento y resolución, con expediente electrónico.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| CIT-01 | Registrar / identificar ciudadano | Padron básico |
| CIT-02 | Abrir solicitud de trámite | Caso de servicio |
| CIT-03 | Agendar cita | Ventanilla/turnos |
| CIT-04 | Gestionar expediente del trámite | Actuaciones y documentos |
| CIT-05 | Resolver / notificar | Cierre del caso |
| CIT-06 | Encuesta / satisfacción | Calidad del servicio |

### Entradas
- Identidad del ciudadano
- Catálogo de trámites
- Documentos requisito
- SLAs normativos
- Pagos de derechos (si aplica — recaudación)

### Salidas
- Ciudadano registrado
- Service Request
- Citas
- Expediente
- Notificaciones
- Eventos: CitizenRegistered, ServiceRequestOpened, ServiceRequestClosed

### Actores
- **Ciudadano:** Solicita
- **Agente de ventanilla:** Opera
- **Resolutor / área:** Dictamina
- **Supervisor:** Monitorea SLA

### Riesgos
- **Incumplimiento de SLA:** Quejas / sanciones
- **Expediente incompleto:** Nulidades
- **Usurpación de identidad:** Fraude

### Reglas de negocio
1. No se cierra trámite sin checklist documental mínimo.
2. Notificación de resolución es obligatoria y auditable.
3. SLA por tipo de trámite; vencidos escalan.
4. Un ciudadano puede tener múltiples solicitudes; cada una un expediente.

### Notas de alcance (piloto)
**Fuera de Fase 1**.
