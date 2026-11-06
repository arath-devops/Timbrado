# 7. Reglas de retención
## EDM-001

## 7.1 Modelo

```text
RetentionPolicy:
  id
  appliesTo: documentType | caseType | classification
  retentionYears / retentionMonths
  dispositionAction: DESTROY | TRANSFER_HISTORICAL | REVIEW
  freezeOnLitigation: true
  legalBasis: text/code
```

`RetentionHold`: hold manual/legal que **bloquea** disposición aunque venza la política.

## 7.2 Políticas default — Gubernamental (municipal)

| Serie / Tipo | Retención orientativa* | Disposición |
|--------------|------------------------|-------------|
| Expediente de compra / contrato | 5–10 años | REVIEW / TRANSFER |
| Comprobantes de pago / presupuesto | 5–10 años | REVIEW |
| Expediente de personal | Según normativa laboral/local | REVIEW |
| Transparencia publicada | Vigencia + archivo | TRANSFER |
| Auditoría / hallazgos | 10+ años | REVIEW |
| PII ciudadano | Mínimo necesario + base legal | DESTROY controlado |

\*Parametrizable por tenant; no hardcode legal universal.

## 7.3 Políticas default — Empresarial

| Tipo | Retención orientativa | Disposición |
|------|------------------------|-------------|
| Contratos comerciales | 5–7 años post-cierre | DESTROY/REVIEW |
| Facturas / fiscal | Según autoridad fiscal local | REVIEW |
| RRHH | Según laboral | REVIEW |
| CRM attachments | 2–3 años o vida de cuenta | DESTROY |
| Soft-delete drafts | 30–90 días | DESTROY |

## 7.4 Reglas operativas

1. Al crear Document se asigna `retentionPolicyId` por tipo.  
2. Reloj de retención inicia en `ACTIVE` o `CaseFile CLOSED` (configurable).  
3. `RetentionHold` detiene el reloj/disposición.  
4. Disposición destruye **contenido** object-storage; metadatos+hash quedan marcados `DISPOSED` (tombstone auditable).  
5. Disposición requiere permiso `document.retention:execute` + doble control si `CONFIDENTIAL`.  
6. Reportes de vencimientos para Records Officer / Admin.

## 7.5 Justificación

Sin retención, el EDM se convierte en “disco infinito” o en riesgo legal. Separar **policy** de **contenido** permite el mismo motor en empresa y gobierno.
