# Arquitectura Empresarial (Enterprise Architecture)

## 1. Mapa de capacidades de negocio

```mermaid
mindmap
  root((ERP+GRP Platform))
    Core Plataforma
      IAM / SSO / MFA
      Auditoría
      Catálogos
      Workflow BPM
      Notificaciones
      Reportes / BI
      Configuración Tenant
    ERP
      Finanzas
      Contabilidad
      Tesorería
      Compras / Proveedores
      Ventas / CRM
      Inventarios / Logística
      RRHH / Nómina
      Activos Fijos
      Proyectos
    GRP
      Presupuesto Público
      Recaudación
      Programas Sociales
      Transparencia
      Fiscalización
      Contrataciones Públicas
      Gestión Ciudadana
      Expediente / Documental
      Control Gubernamental
```

## 2. Vista de stakeholders

| Stakeholder | Canal | Necesidad |
|-------------|-------|-----------|
| Ciudadano | Portal / App | Trámites, pagos, transparencia |
| Capturista / Operador | Shell ERP | Captura transaccional |
| Jefe / Director | Dashboards | Aprobaciones, KPIs |
| Auditor interno/externo | Consola auditoría | Trazabilidad inmutable |
| Administrador TI | Consola tenant | Config, roles, módulos |
| Integradores | API Gateway | Bancos, SAT, TESOFE, nómina externa |
| Super Admin plataforma | Control plane | Tenants, licencias, observabilidad |

## 3. Arquitectura de valor (Value Streams)

1. **Procure-to-Pay (P2P):** Requisición → OC → Recepción → Factura → Pago → Contabilización → Afectación presupuestal.
2. **Order-to-Cash (O2C):** Cotización → Pedido → Entrega → Factura → Cobro → Contabilidad.
3. **Hire-to-Retire (H2R):** Reclutamiento → Alta → Nómina → Prestaciones → Baja.
4. **Budget-to-Report (B2R):** Anteproyecto → Aprobación → Liberación → Ejercicio → Cuenta Pública.
5. **Citizen-to-Service (C2S):** Solicitud → Expediente → Resolución → Notificación → Transparencia.

## 4. Modelo de tenancy

```mermaid
flowchart TB
  subgraph ControlPlane["Control Plane"]
    TM[Tenant Manager]
    LM[License / Module Flags]
    CM[Config Service]
  end

  subgraph DataPlane["Data Plane - Tenant N"]
    subgraph ERP_N["ERP Modules"]
      F[Finance]
      A[Accounting]
      I[Inventory]
    end
    subgraph GRP_N["GRP Modules"]
      B[Budget]
      T[Tax]
      P[Procurement]
    end
    CORE_N[Core: IAM claims / Audit / Workflow]
  end

  TM --> DataPlane
  LM --> ERP_N
  LM --> GRP_N
  CM --> CORE_N
```

**Justificación:** Separar *Control Plane* (quién existe, qué módulos tiene) de *Data Plane* (transacciones) al estilo Oracle Fusion / SaaS Hyperscale. Permite onboarding de dependencias sin redeploy global.

### Estrategia multi-tenant elegida: **Hybrid**

| Capa | Estrategia | Motivo |
|------|------------|--------|
| Compute | Shared pods (tenant_id en JWT) | Densidad / costo |
| DB | Schema-per-tenant **o** shared schema + RLS (configurable) | Compliance variable |
| Kafka | Topics compartidos + header `tenantId` + ACLs | Throughput |
| Elasticsearch | Index alias por tenant | Aislamiento búsqueda |
| Object Storage | Prefijo `s3://bucket/{tenantId}/` | Documentos / expediente |

## 5. Modelo de módulos activables

```yaml
# Ejemplo configuración tenant
tenantId: dep-finanzas-estado-xyz
modules:
  erp:
    finance: true
    accounting: true
    treasury: true
    purchasing: true
    inventory: true
    hr: true
    payroll: true
    sales: false        # deshabilitado
    crm: false
  grp:
    budget: true
    tax: false
    procurement: true
    transparency: true
    citizen: true
    socialProgram: true
```

El **API Gateway** y el **Shell Angular** ocultan rutas/menús de módulos `false`. Los microservicios rechazan requests si el claim `modules` no incluye el dominio.

## 6. Diagrama de contexto C4 (Nivel 1)

```mermaid
C4Context
    title Diagrama de Contexto - ERP+GRP Platform

    Person(ciudadano, "Ciudadano", "Usuario externo de trámites y pagos")
    Person(empleado, "Empleado / Funcionario", "Usuario interno operativo")
    Person(auditor, "Auditor", "Revisión y fiscalización")
    Person(admin, "Administrador", "Configuración tenant y seguridad")

    System(platform, "ERP+GRP Platform", "Suite integrada multi-tenant ERP + GRP")

    System_Ext(bancos, "Sistemas Bancarios", "SPEI / Pagos / Conciliación")
    System_Ext(sat, "SAT / Autoridad Fiscal", "CFDI / Declaraciones")
    System_Ext(tesofe, "TESOFE / Hacienda", "Cuenta única / reportes")
    System_Ext(email, "Email / SMS / Push", "Canales de notificación")
    System_Ext(idP, "IdP Federado", "SAML/OIDC institucional")

    Rel(ciudadano, platform, "Trámites, pagos, consultas")
    Rel(empleado, platform, "Opera módulos ERP/GRP")
    Rel(auditor, platform, "Consulta auditoría y reportes")
    Rel(admin, platform, "Administra tenants y roles")

    Rel(platform, bancos, "Pagos / cobros / conciliación")
    Rel(platform, sat, "Timbrado / validación fiscal")
    Rel(platform, tesofe, "Reportes presupuestales")
    Rel(platform, email, "Notificaciones")
    Rel(platform, idP, "SSO federado")
```

> Nota: si el renderer Mermaid no soporta C4Context, usar el equivalente en `c4/context.mmd` (flowchart).
