# Mapa General de Procesos
## BA-PROC-001 / Anexo A

## 1. Vista de value streams

```mermaid
flowchart LR
  subgraph CORE["Core plataforma"]
    IAM[IAM]
    CAT[Catálogos]
    AUD[Auditoría]
    WF[Workflow]
    DOC[Documentos]
  end

  subgraph ERP["ERP"]
    FIN[Finanzas]
    ACC[Contabilidad]
    TRE[Tesorería]
    PUR[Compras]
    INV[Inventarios]
    HR[RRHH]
    PAY[Nómina]
    FA[Activos Fijos]
    CRM[CRM]
  end

  subgraph GRP["GRP"]
    BUD[Presupuesto]
    TRA[Transparencia]
    SOC[Programas Sociales]
    FIS[Fiscalización]
    CIT[Gestión Ciudadana]
    TAX[Recaudación]
    PRC[Contrataciones]
  end

  IAM -.-> ERP
  IAM -.-> GRP
  CAT -.-> ERP
  CAT -.-> GRP
  WF --> PUR
  WF --> BUD
  WF --> PRC
  WF --> PAY
  DOC --> PUR
  DOC --> BUD
  DOC --> PRC
  DOC --> CIT

  PRC -->|adjudicación| PUR
  PUR -->|compromiso/devengo| BUD
  PUR -->|entrada| INV
  PUR -->|factura| ACC
  PAY -->|afectación| BUD
  PAY -->|asiento| ACC
  TRE -->|pago/cobro| ACC
  TRE -->|ejercido| BUD
  TAX -->|cobro| TRE
  FIN --> ACC
  FA --> ACC
  INV --> ACC
  CRM --> FIN
  BUD --> TRA
  PRC --> TRA
  CIT --> DOC
  SOC --> BUD
  AUD -.-> ERP
  AUD -.-> GRP
```

## 2. Cadena de valor del piloto municipal (foco)

```mermaid
flowchart TB
  A[Necesidad de área] --> B[Requisición de compra]
  B --> C{Workflow aprobación}
  C -->|rechazo| B
  C -->|ok| D[Verificar disponibilidad presupuestal]
  D -->|sin saldo| C
  D -->|ok| E[Orden de compra]
  E --> F[Documentos / anexos]
  F --> G[Compromiso presupuestal]
  G --> H[Recepción / servicio]
  H --> I[Devengado / factura]
  I --> J[Pago tesorería]
  J --> K[Ejercido + asiento]
  K --> L[Auditoría / control]
```

> En el **MVP** se cubre hasta compromiso + OC + documentos + auditoría.  
> En **Fase 1** se profundiza recepción → matching → pago → momentos presupuestales completos.

## 3. Mapa proceso de procesos por módulo

| Módulo | Procesos nivel 1 | Prioridad piloto |
|--------|------------------|------------------|
| Finanzas | Estructura financiera, periodos, FX, centros de costo | F2+ |
| Contabilidad | Plan de cuentas, asientos, cierre, estados | F1 parcial / F2 |
| Tesorería | Cuentas, pagos, cobros, conciliación | F1 parcial |
| Compras | Requisición, OC, recepción, factura | **MVP + F1** |
| Inventarios | Altas/bajas, traspasos, valuación | F2+ |
| RRHH | Altas, plazas, movimientos | F2+ / OUT nómina |
| Nómina | Incidencias, cálculo, pago, timbrado | **OUT-F1** |
| Activos Fijos | Alta, depreciación, baja | F2+ |
| CRM | Leads, oportunidades, cuentas | F2+ |
| Presupuesto Público | Formulación, aprobación, ejercicio, cuenta pública | **MVP + F1** |
| Transparencia | Obligaciones, publicación, atención | F2+ |
| Programas Sociales | Padrón, elegibilidad, dispersión | **OUT-F1** |
| Fiscalización | Auditorías, hallazgos, seguimiento | F2+ |
| Gestión Ciudadana | Trámites, citas, expediente | **OUT-F1** |
| Recaudación | Padrón, liquidación, cobro, rezago | **OUT-F1** |
| Contrataciones Públicas | Procedimiento, puja, adjudicación, contrato | F2+ |

## 4. Matriz de integración crítica ERP ↔ GRP

| Desde | Hacia | Evento / resultado de negocio |
|-------|-------|-------------------------------|
| Contrataciones | Compras | Contrato → OC / pedido |
| Compras | Presupuesto | Compromiso / ampliación |
| Compras | Inventarios | Entrada por recepción |
| Compras | Contabilidad | Provicion / factura |
| Nómina | Presupuesto + Contabilidad + Tesorería | Devengo y pago de nómina |
| Recaudación | Tesorería | Ingreso |
| Presupuesto | Transparencia | Publicación de ejercicio |
| Gestión Ciudadana | Documentos | Expediente |
| Cualquier mutación | Auditoría | Hecho auditable |

## 5. Actores transversales del mapa

Administrador · Auditor · Director · Jefe de Área · Capturista · Operador · Analista presupuestal · Comprador · Tesorero · Contador · Ciudadano *(fuera F1)* · Proveedor · Contribuyente *(fuera F1)*
