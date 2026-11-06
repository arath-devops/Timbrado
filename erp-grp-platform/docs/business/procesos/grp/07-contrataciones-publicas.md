# Contrataciones Públicas
## GRP-PRC · Prioridad piloto: **F2+**

### Objetivo
Conducir procedimientos de contratación pública desde la planeación hasta el contrato, asegurando transparencia, competencia y enlace al ejercicio (compras + presupuesto).

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| PRC-01 | Planear contratación | Necesidad y estrategia |
| PRC-02 | Publicar procedimiento | Licitación / invitación / adjudicación directa según marco |
| PRC-03 | Recibir propuestas | Bids |
| PRC-04 | Evaluar y adjudicar | Fallo |
| PRC-05 | Formalizar contrato | Instrumento jurídico |
| PRC-06 | Administrar contrato | Convenios modificatorios, fianzas, avances |
| PRC-07 | Integrar a ejecución ERP | Genera OC / pedidos / hitos de pago |
| PRC-08 | Publicar en transparencia | Obligaciones asociadas |

### Entradas
- Requisición / dictamen de necesidad
- Presupuesto autorizado
- Marco legal de contrataciones
- Proveedores/participantes
- Documentos del procedimiento

### Salidas
- Expediente del procedimiento
- Fallo / adjudicación
- Contrato
- OC derivadas
- Publicaciones
- Eventos: ProcedurePublished, AwardGranted, PublicContractSigned

### Actores
- **Área requirente:** Define necesidad
- **Unidad de contrataciones:** Conduce procedimiento
- **Comité / autoridad:** Adjudica
- **Jurídico:** Contrato
- **Compras / presupuesto:** Ejecutan
- **Órganos de control:** Vigilancia

### Riesgos
- **Adjudicación indebida:** Sanción / nulidad
- **Contrato sin presupuesto:** Sobregiro
- **Expediente incompleto:** Observaciones
- **Conflicto de interés:** Integridad

### Reglas de negocio
1. No publicar procedimiento sin dictamen de suficiencia presupuestal.
2. El fallo debe ser trazable a evaluación documentada.
3. Contrato firmado es prerrequisito para OC de ejecución (salvo excepciones legales auditadas).
4. Montos de contrato limitan compromisos acumulados.
5. Participantes sancionados no pueden adjudicar.
6. SoD entre quien evalúa técnicamente y quien aprueba pago.

### Notas de alcance (piloto)
Post MVP; se enlazará a Compras+Presupuesto+Documentos+Transparencia.
