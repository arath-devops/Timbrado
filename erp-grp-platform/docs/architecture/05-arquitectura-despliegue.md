# Arquitectura de Despliegue

## 1. Entornos

| Entorno | Propósito | Datos | Escala |
|---------|-----------|-------|--------|
| Local | Dev laptop / docker-compose | Synthetic | Mínima |
| Dev | Integración continua equipos | Anonymized | Baja |
| QA | Pruebas funcionales / regresión | Seed + fixtures | Media |
| UAT | Aceptación negocio / carga | Producción-like | Alta |
| Prod | Operación real | Real + cifrado | Full HA |

## 2. Diagrama de despliegue Kubernetes

```mermaid
flowchart TB
  subgraph NS_EDGE["ns: edge"]
    IG[Ingress NGINX / Gateway API]
    GW[api-gateway Deployment]
  end

  subgraph NS_CORE["ns: core"]
    IAM[iam-service]
    AUD[audit-service]
    CAT[catalog-service]
    WF[workflow-service]
    NTF[notification-service]
    RPT[report-service]
    CFG[configuration-service]
    TNT[tenant-service]
  end

  subgraph NS_ERP["ns: erp"]
    FIN[finance-service]
    ACC[accounting-service]
    TRE[treasury-service]
    PUR[purchasing-service]
    INV[inventory-service]
    HR[hr-service]
    PAY[payroll-service]
  end

  subgraph NS_GRP["ns: grp"]
    BUD[budget-service]
    TAX[tax-service]
    PRC[procurement-service]
    CIT[citizen-service]
    DOC[document-service]
    TRN[transparency-service]
  end

  subgraph NS_DATA["ns: data-plane"]
    PG[(PostgreSQL)]
    RD[(Redis)]
    KF[[Kafka]]
    ES[(Elasticsearch)]
  end

  subgraph NS_OBS["ns: observability"]
    OTEL[otel-collector]
    PROM[prometheus]
    GRAF[grafana]
    LOKI[loki]
  end

  IG --> GW
  GW --> NS_CORE
  GW --> NS_ERP
  GW --> NS_GRP
  NS_CORE & NS_ERP & NS_GRP --> NS_DATA
  NS_CORE & NS_ERP & NS_GRP --> OTEL
```

## 3. Estrategia de release

- **Rolling update** default (maxUnavailable=0, maxSurge=25%).
- **Blue/Green** para gateway e iam-service (críticos).
- **Canary** (Flagger / Argo Rollouts) 5% → 25% → 100% en Prod.
- **Feature flags** (configuración tenant) para módulos de negocio.

## 4. Empaquetado

```
Docker image: ghcr.io/org/erpgrp/<service>:<semver>
Helm chart: erp-grp/charts/<service>
Umbrella chart: infrastructure/helm/erp-grp
```

Cada servicio expone probes:

```yaml
livenessProbe:  GET /actuator/health/liveness
readinessProbe: GET /actuator/health/readiness
startupProbe:   GET /actuator/health/readiness
```

## 5. GitOps

```mermaid
flowchart LR
  DEV[Developer PR] --> CI[GitHub Actions CI]
  CI --> REG[Container Registry]
  CI --> HELM[Update Helm values tag]
  HELM --> ARGO[Argo CD]
  ARGO --> DEV_E[Dev]
  ARGO --> QA_E[QA]
  ARGO --> UAT_E[UAT - manual sync]
  ARGO --> PROD_E[Prod - manual + approval]
```
