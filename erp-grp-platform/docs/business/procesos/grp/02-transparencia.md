# Transparencia
## GRP-TRA · Prioridad piloto: **F2+**

### Objetivo
Cumplir obligaciones de transparencia proactiva y reactiva: publicar información pública, atender solicitudes y mantener evidencias de publicación.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| TRA-01 | Definir obligaciones / calendario | Catálogo de cargas de transparencia |
| TRA-02 | Preparar paquete de publicación | Datos desde presupuesto, contratos, nómina, etc. |
| TRA-03 | Publicar información | Portal / open data |
| TRA-04 | Atender solicitud de información | Reactiva |
| TRA-05 | Gestionar recursos de revisión | Seguimiento a impugnaciones |
| TRA-06 | Archivar evidencia de cumplimiento | Documentos y hashes |

### Entradas
- Datos de módulos fuente
- Marco normativo de transparencia
- Solicitudes ciudadanas
- Calendario de obligaciones

### Salidas
- Publicaciones
- Acuses
- Expedientes de solicitud
- Indicadores de cumplimiento
- Eventos: ObligationPublished, PublicationUpdated

### Actores
- **Enlace de transparencia:** Coordina publicaciones
- **Áreas obligadas:** Proveen información
- **Ciudadano:** Consulta/solicita
- **Órgano garante:** Externo

### Riesgos
- **Publicación incompleta o tardía:** Sanciones / reputación
- **Datos personales en abierto:** Violación de privacidad
- **Desalineación con fuente:** Información inconsistente

### Reglas de negocio
1. No publicar PII/datos sensibles sin base legal y disociación.
2. Toda publicación referencia periodo y fuente sistémica.
3. Las obligaciones vencidas escalan por workflow/SLA.
4. Las versiones publicadas son inmutables; se corrigen con nueva versión.

### Notas de alcance (piloto)
Posterior al control del gasto; se alimentará de Presupuesto/Contrataciones.
