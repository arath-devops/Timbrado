# 6. Flujos documentales
## EDM-001

## 6.1 Flujo A — Carga y vinculación (MVP)

```mermaid
sequenceDiagram
  participant U as Usuario
  participant EDM as Document BC
  participant AV as Antivirus/OCR
  participant Dom as Purchasing/Budget
  participant AUD as Audit

  U->>EDM: UploadDocument + metadata
  EDM->>EDM: compute SHA-256 + store
  EDM->>AV: scan (+ OCR async)
  EDM->>Dom: LinkDocument(businessRef)
  EDM->>AUD: DocumentUploaded / DocumentLinked
  AV-->>EDM: clean / ocrStatus
```

## 6.2 Flujo B — Expediente de compra

```mermaid
stateDiagram-v2
  [*] --> OPEN: CreateCaseFile(PROCUREMENT_FILE)
  OPEN --> OPEN: Add documents (REQUEST, EVIDENCE...)
  OPEN --> CHECKLIST: PO approval requested
  CHECKLIST --> UNDER_REVIEW: Workflow running
  UNDER_REVIEW --> SIGNING: approvals done / sign required
  SIGNING --> COMPLETE_DOCS: DocumentSigned
  COMPLETE_DOCS --> OPEN: wait reception/payment docs (F1)
  OPEN --> CLOSED: case closed
  CLOSED --> FROZEN: litigation/hold
```

## 6.3 Flujo C — Revisión / aprobación documental (BPM)

Plantilla `GENERIC_REVIEW_APPROVE_SIGN` aplicada a documentos sensibles (`LEGAL_OPINION`, `AWARD_ACT`).

Estados documento: `DRAFT → UNDER_REVIEW → ACTIVE/SIGNED` o rechazo a `DRAFT` con comentarios.

## 6.4 Flujo D — Verificación QR

1. Escaneo QR → token.  
2. API/portal valida token.  
3. Muestra metadatos no sensibles + hash + firmantes + estado.  
4. Si `INTERNAL`, exige login.  
5. Audit `DocumentVerified` (rate-limited).

## 6.5 Flujo E — Retención / disposición

`ACTIVE → ARCHIVED → (review) → DISPOSED` o `RetentionHold` congela disposición.

## 6.6 Eventos de dominio EDM

| Evento | Productores/Consumidores |
|--------|--------------------------|
| `DocumentUploaded` | Audit, OCR, Antivirus |
| `DocumentVersioned` | Audit |
| `DocumentLinked` | Purchasing, Budget, BPM checklist |
| `DocumentSigned` | BPM, Audit, Notification |
| `DocumentQuarantined` | Security, Notify admin |
| `CaseFileOpened` / `CaseFileClosed` | Audit, Transparency(F2) |
| `DocumentIntegrityBroken` | Security alert |
| `DocumentDisposed` | Audit |
