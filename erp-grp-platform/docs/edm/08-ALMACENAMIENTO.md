# 8. Estructura de almacenamiento
## EDM-001

## 8.1 Principio

| Capa | Tecnología lógica | Contiene |
|------|-------------------|----------|
| Metadatos / versiones / expedientes | PostgreSQL (document_db) | Relacional EDM |
| Binarios | Object Storage (S3-compatible) | Bytes |
| Texto OCR / búsqueda | Elasticsearch | Full-text |
| Colas jobs | Kafka / queue | OCR, virus, disposition |
| Caché URLs firmadas | Redis | Download tokens cortos |

## 8.2 Layout de object keys

```text
s3://{bucket}/
  t/{tenantId}/
    docs/
      {yyyy}/{MM}/{documentId}/
        v{versionNo}/
          content.bin          # o nombre + extensión
          content.sha256       # opcional sidecar
          stamp/
            signed.pdf         # si aplica render firmado
          ocr/
            text.json
            searchable.pdf     # opcional
    cases/
      {caseFileId}/
        manifest.json          # índice + hashes al cierre
    quarantine/
      {documentId}/v{n}/...
```

**Justificación:** prefijo `tenantId` facilita aislamiento y lifecycle rules; partición por fecha mejora listados ops; version path evita overwrite.

## 8.3 Buckets / clases sugeridas

| Bucket lógico | Contenido | Replicación |
|---------------|-----------|-------------|
| `edm-active` | Versiones ACTIVE | Multi-AZ |
| `edm-archive` | ARCHIVED frío | IA/Glacier-like |
| `edm-quarantine` | Sospechosos | Restringido |
| `edm-public-verify` | Solo assets públicos de verificación (si se usa CDN) | Opcional |

## 8.4 Acceso a binarios

1. API autoriza (RBAC+ABAC+ACL doc).  
2. Emite **URL prefirmada** TTL corto (1–5 min) o stream vía API Gateway.  
3. No exponer keys permanentes al browser.  
4. Watermark opcional en descargas CONFIDENTIAL.

## 8.5 Cifrado

| Nivel | Control |
|-------|---------|
| At rest | SSE bucket / CMK por tenant (dedicated) |
| In transit | TLS |
| Application | Opcional envelope encryption para RESTRICTED_PII |

## 8.6 Tenant dedicado vs multi-tenant storage

| Modo | Estrategia |
|------|------------|
| Dedicated (piloto) | Bucket dedicado o prefix exclusivo + KMS key propia |
| Shared SaaS | Prefix `t/{tenantId}` + policies IAM storage estrictas + tests de isolation |

## 8.7 Cuotas

`maxFileSize` (p.ej. 25–50 MB MVP), `maxVersions`, `quotaPerTenant` — configurables.
