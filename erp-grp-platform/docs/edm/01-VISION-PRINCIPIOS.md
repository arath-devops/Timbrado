# 1. Visión y principios
## EDM-001

## 1.1 Visión

> Convertir el documento en **evidencia de negocio de primera clase**: versionado, íntegro (hash), localizable (metadatos/OCR), vinculable a expedientes y transacciones, firmable, retenible y auditable — tanto en empresas privadas como en organismos públicos.

## 1.2 Referentes

| Referente | Capacidad análoga |
|-----------|-------------------|
| SAP | ArchiveLink / DMS / S/4 document framework |
| Oracle | WebCenter / Content Management + ERP attachments |
| Dynamics 365 | SharePoint / Dataverse files + status |
| ECM clásico | Alfresco / Documentum (expediente, retención, records) |
| Gobierno MX | Expediente electrónico, conservación, firma avanzada (marco legal local parametrizable) |

## 1.3 Principios

| Principio | Justificación |
|-----------|---------------|
| **Content ≠ Transaction** | El binario vive en Object Storage; el dominio EDM posee metadatos/versiones |
| **Immutability of versions** | Una versión publicada no se edita; se crea N+1 |
| **Hash as integrity** | Detección de adulteración y prueba de evidencia |
| **Case file (Expediente) first in public sector** | El trámite/compra se entiende como expediente, no como adjuntos sueltos |
| **Workflow orchestrates, EDM executes** | Firma/OCR/retención son capacidades EDM invocadas por BPM |
| **Same metamodel, sector policies** | Empresa y gobierno comparten modelo; cambian series documentales y retención |
| **Security by ACL + OrgScope** | Hereda SEC-ARCH-001 / ORG-001 |

## 1.4 Alcance MVP vs posterior

| Capacidad | MVP municipal | Posterior |
|-----------|---------------|-----------|
| Upload + versionado + metadatos + link a PO/PR/Budget | **Sí** | |
| Hash SHA-256 por versión | **Sí** | |
| Expediente mínimo de compra | **Sí** | |
| Firma (simple/avanzada según tenant) | **Sí (básica)** | Firma avanzada/HSM |
| QR de verificación | **Sí (básico)** | Portal público verificación |
| OCR | Opcional async | Full-text search enterprise |
| Retención / disposición | Política default | Records management completo |
