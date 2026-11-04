# 10. Perfiles empresarial y gubernamental
## EDM-001

Mismo motor EDM; **policy packs** distintos.

## 10.1 Comparativa

| Dimensión | Empresarial (ERP) | Gubernamental (GRP) |
|-----------|-------------------|---------------------|
| Contenedor | Vendor file / Project docs | **Expediente** administrativo |
| Clasificación | INTERNAL default | INTERNAL + series públicas |
| Firma default | Simple stamp | Simple → avanzada en actos |
| QR | Verificación partners | Verificación pública selectiva |
| Retención | Fiscal/comercial | Cuadro de clasificación + normativa local |
| Transparencia | N/A o limitada | Paquetes publicables (metadatos) |
| OCR | Productividad búsqueda | + modernización de acervo |
| Ownership | OU / LegalEntity | OU + posible expediente ciudadano (F3) |

## 10.2 Policy Pack `PRIVATE_CORPORATE`

- Tipos: contrato, factura, PO, cotización, KYC proveedor  
- Checklist OC: cotización + PO PDF  
- Retención facturas según país  
- QR internal-only  

## 10.3 Policy Pack `PUBLIC_MUNICIPAL` (piloto)

- Tipos: oficio, suficiencia, OC, dictamen, anexos, acta  
- CaseType `PROCUREMENT_FILE` + `BUDGET_FILE`  
- Checklist obligatorio pre-approve/sign  
- Hash+QR en documentos firmados  
- Retención larga en compras/presupuesto  
- Auditoría de descargas CONFIDENTIAL  
- OCR async deseable en oficios escaneados  

## 10.4 Capability roadmap EDM

| Fase | Entrega |
|------|---------|
| MVP | Upload, version, metadata, link, case file mínimo, hash, firma simple, QR básico, audit events, storage layout |
| F1 | Checklist estricto, OCR on, retención básica, manifests de expediente |
| F2 | Firma avanzada, records disposition, búsqueda full-text, series documentales formales |
| F3 | Expediente ciudadano, publicación transparencia, verificación pública masiva |

## 10.5 Justificación final

Un EDM enterprise unificado evita el anti-patrón “cada módulo guarda archivos a su modo”. Con hash, versiones, expediente, firma y retención, la plataforma soporta tanto compliance corporativo como control gubernamental — reutilizando el mismo Bounded Context Document del DDD-001.
