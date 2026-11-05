# 5. Firmas electrónicas
## EDM-001

## 5.1 Tipos de firma soportados (configurables por tenant)

| signatureType | Nivel | Uso típico |
|---------------|-------|------------|
| `SIMPLE_APPROVAL_STAMP` | Bajo | Visto bueno digital con usuario+MFA+hash estampado |
| `ADVANCED_ELECTRONIC` | Medio-Alto | Certificado del firmante / proveedor de firma |
| `QUALIFIED` / FIEL-like | Alto | Cuando el marco legal del tenant lo exija |

**Piloto municipal MVP:** `SIMPLE_APPROVAL_STAMP` + MFA step-up + hash + QR.  
Evolución: conector a proveedor de firma avanzada / HSM.

## 5.2 SignatureRecord

| Campo | Descripción |
|-------|-------------|
| `versionId` | Versión firmada (inmutable) |
| `signerId` / `signerPositionId` | Quién firma |
| `signedAt` | Timestamp UTC |
| `signatureType` | Ver tabla |
| `signatureHash` | Hash del paquete de firma |
| `certificateThumbprint` | Si aplica |
| `evidenceRef` | XML/JSON de evidencia PAdES/CAdES o stamp payload |
| `workflowTaskId` | Correlación BPM |

## 5.3 Flujo de firma (con Workflow)

1. BPM crea `SIGNATURE_TASK`.  
2. Firmante abre documento (versión current).  
3. EDM valida ACL + MFA obligation.  
4. EDM genera estampa (nombre, rol, fecha, hash corto, QR).  
5. Se crea **nueva versión** `SIGNED_RENDER` (el original permanece).  
6. `SignatureRecord` + eventos `DocumentSigned`.  
7. BPM recibe outcome `SIGN` y continúa.

## 5.4 Reglas

1. No firmar `DRAFT` sin checklist de metadatos.  
2. No alterar versión firmada.  
3. Multi-firma: cada firma sobre la última signed render o co-sign sobre el mismo base según policy.  
4. Rechazo de firma no borra el documento; deja motivo.  
5. Toda firma → AuditFact.

## 5.5 Empresarial vs gubernamental

| Tema | Empresa | Gobierno |
|------|---------|----------|
| Default | Simple stamp + SSO | Simple stamp; avanzada en actos públicos |
| Evidencia | Contrato comercial | Acto administrativo / contrato público |
| QR verify | Portal partners | Portal ciudadano/transparencia (si público) |
