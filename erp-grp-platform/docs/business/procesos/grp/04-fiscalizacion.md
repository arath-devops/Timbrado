# Fiscalización
## GRP-FIS · Prioridad piloto: **F2+**

### Objetivo
Planear y ejecutar auditorías/revisiones de control, emitir observaciones/hallazgos y dar seguimiento a la remediación.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| FIS-01 | Plan anual de fiscalización | Objetos a revisar |
| FIS-02 | Abrir auditoría / revisión | Alcance y equipo |
| FIS-03 | Recabar evidencia | De auditoría sistémica y documental |
| FIS-04 | Emitir hallazgo / observación | Con severidad y plazo |
| FIS-05 | Atender remediación | Planes de acción del auditado |
| FIS-06 | Cerrar hallazgo / auditoría | Veredicto |

### Entradas
- Trails de auditoría de plataforma
- Documentos
- Estados financieros/presupuestales
- Normativa aplicable

### Salidas
- Expediente de auditoría
- Hallazgos
- Planes de remediación
- Cierres
- Eventos: AuditOpened, FindingIssued, FindingClosed

### Actores
- **Auditor interno/externo:** Ejecuta
- **Enlace del área auditada:** Atiende
- **Contralor:** Prioriza plan
- **Dirección:** Responde hallazgos críticos

### Riesgos
- **Hallazgos sin seguimiento:** Riesgo residual
- **Evidencia incompleta:** Contencioso
- **Confidencialidad rota:** Filtro de información

### Reglas de negocio
1. Todo hallazgo tiene responsable, plazo y severidad.
2. No se cierra hallazgo sin evidencia de remediación o aceptación de riesgo formal.
3. Acceso a trails respeta RBAC/ABAC de auditoría.

### Notas de alcance (piloto)
Se beneficia del módulo Auditoría del MVP, pero el producto de fiscalización es F2+.
