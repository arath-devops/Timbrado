# Diagrama de microservicios por fases
## ERP-ARCH-DIAG-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-ARCH-DIAG-001 |
| Propósito | Validar el mapa de servicios **antes** de desarrollar |
| Alineado a | ERP-MS-001 · ADR-014 · login 3 campos (empresa/usuario/password) |

---

## 1. Vista rápida — dos momentos

```text
FASE A (arranque)          FASE B (ERP dominio)
─────────────────          ────────────────────
Browser / Angular          + Compras
    │                      + Inventario
    ▼                      + CxP
 API Gateway               + CxC / Facturación (+ puerto CFDI)
    │                      + Contabilidad
    ├─ IAM (usuarios+seg)  + Tesorería
    ├─ Catálogos           + Documentos
    ├─ Workflow            + Reportes (lectura)
    └─ Auditoría
```

---

## 2. Fase A — Login y shell (probar en línea)

Solo lo necesario para: **empresa + usuario + password** → JWT → menú por permisos.

```mermaid
flowchart TB
  subgraph Cliente
    UI[Angular · Login 3 campos<br/>Empresa · Usuario · Password]
    SHELL[Shell · Dashboard · Menú hamburguesa]
  end

  subgraph Borde
    GW[API Gateway<br/>JWT · rutas · rate limit]
  end

  subgraph Plataforma
    IAM[IAM<br/>Usuarios + Seguridad + Roles/Permisos]
    CAT[Catálogos<br/>UOM · TAX · series · umbrales]
    WF[Workflow<br/>bandeja de aprobación]
    AUD[Auditoría<br/>rastro append-only]
  end

  DB1[(iam_db)]
  DB2[(catalog_db)]
  DB3[(workflow_db)]
  DB4[(audit_db)]

  UI -->|POST login| GW
  GW --> IAM
  IAM --> DB1
  IAM -->|JWT + modules| UI
  UI --> SHELL
  SHELL --> GW
  GW --> CAT
  GW --> WF
  GW --> AUD
  CAT --> DB2
  WF --> DB3
  AUD --> DB4
```

**Permisos:** el admin (dentro de IAM) asigna a cada usuario qué módulos ve (Catálogos, Facturación, CxC…). El login **no** pide rol.

---

## 3. Fase B — Dominios ERP (sin un solo “Core” dios)

Cada caja = microservicio + su propia BD. El Gateway sigue siendo la puerta.

```mermaid
flowchart TB
  UI[Angular Object Pages]
  GW[API Gateway]

  UI --> GW

  subgraph Plataforma
    IAM[IAM]
    CAT[Catálogos]
    WF[Workflow]
    AUD[Auditoría]
    DOC[Documentos / expediente]
    REP[Reportes · solo lectura]
  end

  subgraph ERP["Dominios ERP — no un Core único"]
    PROC[Compras · procurement]
    INV[Inventario]
    AP[CxP]
    AR[CxC / Facturación]
    GL[Contabilidad]
    TRE[Tesorería]
  end

  GW --> IAM & CAT & WF & AUD & DOC & REP
  GW --> PROC & INV & AP & AR & GL & TRE

  PROC -.->|eventos GR| INV
  PROC -.->|refs OC/GR| AP
  AP -.->|propuesta pago| TRE
  AR -.->|Delivery / cobros| INV & TRE
  AP & AR & TRE & INV -.->|postings| GL
  AR -.->|puerto CFDI| PAC[Adaptador PAC · CFDI 4.0]

  BUD[budget-service GRP]
  PROC -.-x|prohibido ADR-014| BUD
```

---

## 4. Flujo de login (detalle)

```mermaid
sequenceDiagram
  actor U as Usuario
  participant UI as Angular
  participant GW as Gateway
  participant IAM as IAM
  participant DB as iam_db

  U->>UI: Empresa + Usuario + Password
  UI->>GW: POST /api/v1/auth/login
  GW->>IAM: forward
  IAM->>DB: validar tenant + user + hash
  IAM->>DB: cargar roles/permisos/modules
  IAM-->>UI: access_token JWT
  Note over UI: Menú = modules del token<br/>ej. erp.ap, erp.billing, core.catalog
  U->>UI: Abre Dashboard
  UI->>GW: GET /api/v1/... + Bearer
  GW->>GW: valida JWT
```

---

## 5. Comparación: “Core único” vs mapa sugerido

| Enfoque | Riesgo | Recomendación |
|---------|--------|---------------|
| Un microservicio Core con todo el ERP | Deploy/fallo total; SoD débil; BD compartida | **Evitar** |
| Plataforma + dominios (este diagrama) | Más repos/servicios, pero límites claros | **Usar** |
| Empezar solo Fase A y luego Compras | Entrega incremental testeable | **Camino feliz** |

---

## 6. Orden de construcción (recordatorio)

1. Gateway + IAM + seed admin + login 3 campos  
2. Catálogos + menú dinámico + dashboard vacío/KPIs stub  
3. Workflow + Auditoría  
4. Compras → Inventario → CxP → Tesorería → Ventas/AR → CFDI → Contabilidad → Reportes/Documentos  

---

**Fin ERP-ARCH-DIAG-001**
