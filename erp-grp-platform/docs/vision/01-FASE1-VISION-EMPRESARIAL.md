# Fase 1 — Visión Empresarial  
## Plataforma ERP + GRP de Clase Enterprise

| Campo | Valor |
|-------|--------|
| Documento | EA-VIS-001 |
| Tipo | Enterprise Architecture — Vision |
| Clasificación | Estratégico |
| Audiencia | Comité Directivo, TI, Negocio, Cumplimiento |
| Estado | Alineado — decisiones de sponsor cerradas (ver EA-DEC-001) |
| Piloto | Municipal · Multi-Tenant (capacidad) · Tenant dedicado (runtime inicial) |
| Referentes | SAP S/4HANA + IS-PS, Oracle Fusion Cloud ERP / Public Sector, Microsoft Dynamics 365 Finance & SCM + Gov |

---

## 1. Product Vision

### Declaración de visión de producto

> **Construir una plataforma modular, multi-tenant y cloud-native que unifique la gestión operativa-financiera (ERP) con la gobernanza pública (GRP), permitiendo a empresas privadas y a organismos de los tres órdenes de gobierno operar, controlar, transparentar y escalar sus procesos administrativos sobre un mismo núcleo tecnológico, habilitando o deshabilitando capacidades según su naturaleza jurídica y modelo de negocio.**

### Propuesta de valor (Product Value Proposition)

| Segmento | Promesa |
|----------|---------|
| Empresa privada | Suite ERP moderna (finanzas, compras, inventarios, RRHH/nómina, CRM) con time-to-value corto y costo total de propiedad predecible. |
| Gobierno federal / estatal / municipal | GRP nativo: presupuesto, recaudación, contrataciones, transparencia, expediente y control, integrado con finanzas y tesorería. |
| Ambos | Un solo control plane (identidad, auditoría, catálogos, workflow, notificaciones) y módulos de negocio activables por licencia/tenant. |

### Principios de producto

1. **Modularidad real** — cada capacidad se activa sin acoplar al resto (inspirado en *scope items* SAP / *offerings* Oracle / *apps* Dynamics).
2. **Un núcleo, muchos despliegues** — shared platform + configuración por tenant/jurisdicción.
3. **System of Record + System of Engagement** — transacciones confiables + portales (interno y ciudadano).
4. **Cumplimiento by design** — auditoría inmutable, segregación de funciones, multiidioma/multimoneda.
5. **Extensible por contratos** — API First + eventos (no personalizaciones invasivas al core).

### Posicionamiento frente a referentes

| Dimensión | SAP | Oracle Fusion | Dynamics 365 | Esta plataforma |
|-----------|-----|---------------|--------------|-----------------|
| Sector público nativo | IS-PS / add-ons | Public Sector Cloud | Gov Cloud + apps | GRP de primer nivel |
| Multitenant SaaS | Limitado (PCE) | Fuerte | Fuerte | Objetivo nativo |
| Extensibilidad | BAdI / RAP | PaaS extensions | Power Platform | Hexagonal + eventos + API |
| Complejidad de entrada | Alta | Alta | Media-Alta | Media con MVP acotado |
| Diferenciador | Profundidad industria | Suite cloud completa | Ecosistema Microsoft | ERP+GRP unificado para LATAM/México |

---

## 2. Business Vision

### Declaración de visión de negocio

> **Ser la plataforma de referencia para modernizar la gestión administrativa y financiera del sector privado y del sector público, reduciendo fragmentación de sistemas, mejorando el control presupuestal y financiero, elevando la transparencia y acelerando la prestación de servicios a ciudadanos y clientes.**

### Problema de negocio que resuelve

Hoy coexisten:

- ERPs genéricos poco adaptados a presupuesto público, transparencia y contrataciones.
- Soluciones GRP legacy monolíticas, difíciles de evolucionar y de integrar.
- Integraciones punto a punto frágiles entre finanzas, compras, nómina y tesorería.
- Débil trazabilidad para auditoría interna/externa y cuenta pública.
- Duplicidad de identidades, catálogos y flujos de aprobación.

### Visión de capacidad empresarial (Capability Vision)

La organización usuaria podrá:

1. Operar **ciclo administrativo completo** (P2P, O2C, H2R, R2R).
2. Gobernar **ciclo presupuestal público** (formulación → ejercicio → cuenta pública).
3. Atender **ciudadanos y clientes** con expediente, trámites y notificaciones.
4. Demostrar **cumplimiento y transparencia** con evidencia auditable.
5. Escalar de un municipio o PYME a una dependencia multi-unidad / grupo empresarial.

### Modelo de negocio de la plataforma (alto nivel)

| Modelo | Descripción |
|--------|-------------|
| SaaS multi-tenant | Suscripción por tenant + módulos activos + usuarios. |
| Dedicated / Private Cloud | Para federales o datos sensibles (residencia y aislamiento reforzado). |
| On-prem / Gov-cloud | Donde la política institucional lo exija. |
| Servicios profesionales | Implantación, migración, capacitación, AMS. |

---

## 3. Objetivos Estratégicos

Alineados a perspectivas tipo BSC (Balanced Scorecard):

### 3.1 Perspectiva de valor / cliente

| ID | Objetivo | Resultado esperado |
|----|----------|--------------------|
| OE-01 | Unificar ERP y GRP en una plataforma modular | Un System of Record por tenant |
| OE-02 | Reducir tiempo de implantación vs ERP legacy | MVP productivo en horizonte acotado |
| OE-03 | Mejorar experiencia de usuario interno y ciudadano | Menos sistemas satélite; un portal + shell |

### 3.2 Perspectiva financiera / eficiencia

| ID | Objetivo | Resultado esperado |
|----|----------|--------------------|
| OE-04 | Bajar TCO (licencias, integraciones, operación) | Menos interfaces y duplicidad |
| OE-05 | Incrementar control de gasto y ejercicio presupuestal | Compromiso/devengado/pagado confiables |
| OE-06 | Acelerar cierres financieros y cuenta pública | Cierres con menor retrabajo |

### 3.3 Perspectiva de procesos

| ID | Objetivo | Resultado esperado |
|----|----------|--------------------|
| OE-07 | Estandarizar procesos core (P2P, B2R, H2R, C2S) | Procesos medibles y auditables |
| OE-08 | Garantizar trazabilidad end-to-end | Cadena de evidencia 100% en mutaciones |
| OE-09 | Habilitar módulos bajo demanda | Time-to-capability por feature flag |

### 3.4 Perspectiva de aprendizaje / plataforma

| ID | Objetivo | Resultado esperado |
|----|----------|--------------------|
| OE-10 | Arquitectura cloud-native escalable | >100k usuarios concurrentes (meta de diseño) |
| OE-11 | Seguridad Zero Trust y cumplimiento | IAM + ABAC/RBAC + MFA + auditoría |
| OE-12 | Organización de producto por dominios | Equipos autónomos por Bounded Context |

---

## 4. Stakeholders

### Mapa de interesados

| Stakeholder | Interés principal | Influencia | Estrategia de engagement |
|-------------|-------------------|------------|--------------------------|
| Comité Directivo / Sponsor | ROI, riesgo, plazos | Muy alta | Steering mensual; decisiones de alcance |
| Dueños de proceso (Finanzas, Presupuesto, Compras, RRHH) | Procesos correctos y adopción | Alta | Workshops; UAT; champions |
| TI institucional | Operabilidad, seguridad, integración | Alta | Arquitectura, DevOps, runbooks |
| Cumplimiento / Control interno / Auditoría | Trazabilidad, SoD, evidencia | Alta | Requisitos no funcionales de control |
| Jurídico / Transparencia | Marco normativo, publicación | Media-Alta | Validación de obligaciones |
| Usuarios operativos | Usabilidad, productividad | Media | Capacitación; feedback continuo |
| Ciudadanos / Contribuyentes | Trámites y pagos claros | Media | UX portal; SLAs públicos |
| Proveedores / Contratistas | Órdenes, facturas, pagos | Media | Portal proveedor (fases posteriores) |
| Integradores / Partners | Extensiones y AMS | Media | API, sandboxes, certificación |
| Órganos fiscalizadores externos | Cuenta pública, observaciones | Media | Extractores/reportes oficiales |

### Matriz Poder–Interés (resumen)

- **Gestionar de cerca:** Sponsor, Dueños de proceso, TI, Cumplimiento.  
- **Mantener satisfechos:** Jurídico/Transparencia, Fiscalizadores.  
- **Informar:** Usuarios operativos, Ciudadanos (vía comunicación de servicio).  
- **Monitorear:** Partners y proveedores.

---

## 5. Actores del Sistema

### 5.1 Actores humanos

| Actor | Tipo | Descripción | Canales |
|-------|------|-------------|---------|
| Super Administrador | Interno plataforma | Tenants, licencias, break-glass | Consola control plane |
| Administrador de tenant | Interno | Usuarios, roles, módulos, catálogos | Shell admin |
| Auditor | Interno/Externo | Consulta trails, reportes de control | Consola auditoría |
| Director / Aprobador | Interno | Aprobaciones de alto nivel, KPIs | Shell + móvil (futuro) |
| Jefe de área | Interno | Aprobaciones operativas | Shell |
| Capturista | Interno | Alta de transacciones | Shell |
| Operador | Interno | Operación rutinaria | Shell |
| Analista financiero / presupuestal | Interno | Consultas, cierres, disponibilidad | Shell + BI |
| Agente ciudadano / ventanilla | Interno | Atiende trámites | Shell GRP |
| Ciudadano | Externo | Trámites, pagos, consultas | Portal ciudadano |
| Proveedor | Externo | (Fase posterior) cotizaciones, facturas | Portal proveedor |
| Contribuyente | Externo | Padrones y pagos | Portal / recaudación |

### 5.2 Actores de sistema (externos)

| Sistema | Relación |
|---------|----------|
| IdP institucional (OIDC/SAML) | SSO federado |
| Banca / SPEI / tesorería externa | Pagos, cobros, conciliación |
| Autoridad fiscal (p.ej. SAT/CFDI) | Timbrado / validación |
| Hacienda / TESOFE / equivalentes | Reportes y cuenta única |
| Canales de notificación (email/SMS/push) | Comunicación |
| Almacén documental / firma electrónica | Expediente y evidencia |
| Data warehouse / BI externo | Analítica avanzada |

---

## 6. Procesos Core

Value streams prioritarios (inspirados en best practices SAP/Oracle/Dynamics + ciclo presupuestal público):

### 6.1 Privado / transversal (ERP)

| Código | Proceso | Descripción breve |
|--------|---------|-------------------|
| P2P | Procure-to-Pay | Requisición → OC → recepción → factura → pago → contabilización |
| O2C | Order-to-Cash | Cotización → pedido → entrega → factura → cobro |
| H2R | Hire-to-Retire | Alta → incidencias → nómina → baja |
| R2R | Record-to-Report | Asientos → periodos → estados financieros |
| I2R | Inventory-to-Fulfill | Existencias, valuación, surtido |

### 6.2 Público (GRP)

| Código | Proceso | Descripción breve |
|--------|---------|-------------------|
| B2R | Budget-to-Report | Anteproyecto → aprobación → compromiso/devengado/ejercido → cuenta pública |
| S2C | Source-to-Contract (público) | Procedimiento → adjudicación → contrato → enlace a compras/ERP |
| T2C | Tax-to-Cash | Padrón → liquidación → pago → rezagos |
| C2S | Citizen-to-Service | Solicitud → expediente → resolución → notificación → transparencia |
| A2R | Audit-to-Remediate | Hecho auditable → observación → plan → cierre |

### 6.3 Procesos de plataforma (Core habilitador)

| Código | Proceso | Descripción |
|--------|---------|-------------|
| I2A | Identity-to-Access | Alta usuario → roles/políticas → MFA → sesión |
| C2C | Configure-to-Consume | Activar módulos/catálogos → menús → operación |
| W2C | Workflow-to-Complete | Definición → instancia → tareas → SLA |
| N2D | Notify-to-Deliver | Evento → plantilla → canal → acuse |

### Relación ERP ↔ GRP (crítica)

El diferenciador de negocio es la **integración controlada**:

- Una OC / nómina / contrato **compromete y ejerce presupuesto**.  
- Un pago de tesorería **cuadra contabilidad y momento presupuestal**.  
- Un procedimiento público **deriva** en ejecución administrativa ERP sin romper lenguaje ubicuo (ACL).

---

## 7. Beneficios del negocio

### Beneficios cuantitativos (esperados)

| Beneficio | Indicación de valor |
|-----------|---------------------|
| Menor fragmentación de sistemas | Consolidación de 5–15 aplicaciones satélite en una plataforma |
| Reducción de costo de integración | Event bus + APIs estándar vs. interfaces punto a punto |
| Menor tiempo de cierre | Automatización contable/presupuestal y menos conciliación manual |
| Menos observaciones de auditoría | Trazabilidad y SoD embebidos |
| Mayor recaudación / menor rezago | Padrones y liquidaciones integradas a cobro |
| Mejor ejercicio presupuestal | Disponibilidad en tiempo real; bloqueo de sobregiro |
| Time-to-value modular | Activar solo módulos necesarios por entidad |

### Beneficios cualitativos

- Lenguaje común entre áreas administrativas.  
- Mejor gobernanza de datos maestros (catálogos).  
- Experiencia ciudadana/cliente más predecible.  
- Capacidad de evolución continua sin “big bang” permanente.  
- Preparación para analítica y transparencia proactiva.

### Beneficios por segmento

| Segmento | Beneficio distintivo |
|----------|----------------------|
| Privado | ERP moderno con camino claro a cumplimiento fiscal/operativo |
| Municipal | GRP asequible y modular (presupuesto + recaudación + ciudadanía) |
| Estatal / Federal | Escala, multi-unidad, control y cuenta pública |

---

## 8. KPIs estratégicos

### 8.1 KPIs de valor de negocio

| KPI | Definición | Meta indicativa* |
|-----|------------|------------------|
| Adopción de usuarios activos | % usuarios licenciados con login ≥1/semana | ≥ 80% a 6 meses post go-live |
| Ciclo P2P | Días promedio requisición→pago | −30% vs baseline |
| Exactitud presupuestal | % movimientos con disponibilidad validada | ≥ 99% |
| Cierre contable | Días para cierre mensual | ≤ 5 días hábiles (meta madurez) |
| SLA trámites ciudadanos | % resueltos dentro de norma | ≥ 90% |
| Tasa de recaudación | Cobrado / liquidado | +X pp vs baseline |
| Observaciones abiertas | Aging de hallazgos de control | −40% en 12 meses |
| Disponibilidad plataforma | Uptime mensual | ≥ 99.9% (MVP), 99.95% (maduro) |

\*Metas se calibran por tenant en el business case.

### 8.2 KPIs de producto / plataforma

| KPI | Meta de diseño |
|-----|----------------|
| Tiempo de activación de módulo | < 1 día (config, sin redeploy global) |
| Cobertura de auditoría en mutaciones | 100% |
| Incidentes Sev-1 mensuales | Tendencia a la baja; MTTR definido por SRE |
| % APIs versionadas publicadas | 100% de contratos externos |

### 8.3 KPIs de programa (entrega)

| KPI | Uso |
|-----|-----|
| Cumplimiento de hitos de roadmap | Steering |
| Defectos UAT críticos abiertos | Go/No-Go |
| Velocity / predictable delivery | Gestión ágil por dominio |

---

## 9. Riesgos del proyecto

| ID | Riesgo | Prob. | Impacto | Mitigación |
|----|--------|-------|---------|------------|
| R-01 | Alcance inflado (“ERP+GRP completo” desde día 1) | Media | Muy alto | Exclusiones D-06; MVP en drops A/B; governance de cambio semanal |
| R-02 | Complejidad normativa heterogénea (3 órdenes de gobierno) | Media | Alto | Piloto municipal acota marco; parametrizar jurisdicción |
| R-11 | MVP amplio (7 módulos) | Alta | Alto | Entregar MVP-A (core) → MVP-B (presupuesto+compras+docs) |
| R-03 | Resistencia al cambio / baja adopción | Alta | Alto | Change management; champions; UX priorizada |
| R-04 | Integraciones bancarias/fiscales inestables | Media | Alto | Adaptadores aislados; circuit breakers; sandbox |
| R-05 | Calidad de datos maestros legados | Alta | Alto | Programa de cleansing; catálogos gobernados |
| R-06 | Subestimar seguridad y SoD | Media | Muy alto | IAM primero; matrices SoD; pruebas de abuso |
| R-07 | Deuda técnica por atajos en core | Media | Alto | ADRs; arquitectura hexagonal; quality gates |
| R-08 | Multitenancy mal diseñado (fuga de datos) | Media | Crítico | Tests de aislamiento; RLS; revisiones de seguridad |
| R-09 | Dependencia de personal clave | Media | Medio | Pairing; documentación viva; ownership por dominio |
| R-10 | Expectativa de paridad inmediata con SAP/Oracle | Alta | Alto | Posicionamiento claro: valor modular + GRP nativo, no clonar todo el footprint |

### Riesgo estratégico a comunicar al sponsor

> El mayor riesgo no es tecnológico: es **intentar resolver todos los procesos de SAP/Oracle/Dynamics + GRP completo en un solo release**. La estrategia ganadora es **plataforma core sólida + olas de valor**.

---

## 10. Roadmap de implementación

Horizonte orientado a **olas de valor**. Decisiones de alcance: **EA-DEC-001**.

```text
[ MVP Municipal ] → [ Post-MVP / Fase 1 ] → [ Fase 2 ] → [ Fase 3 ]
 Core + Docs +        Profundizar           Operación           Ciudadanía,
 Presupuesto +        P2P + Presupuesto     ampliada            recaudación,
 Compras                                                          escala
```

---

### MVP — “Municipio operable: gobierno del gasto”

**Objetivo:** poner en marcha un **tenant dedicado municipal** sobre arquitectura multi-tenant, con control de identidad, evidencia, documentos y el ciclo básico **compra ↔ presupuesto**.

| Capacidad | Incluye en MVP |
|-----------|----------------|
| IAM | Usuarios, roles, permisos, OAuth2/OIDC/JWT, MFA básico, contexto de tenant |
| Catálogos | Maestros municipales versionados |
| Auditoría | Hechos inmutables + consulta de trail |
| Workflow | Aprobaciones de requisición/OC y/o movimientos presupuestales |
| Documentos | Alta, versión básica, vínculo a transacciones |
| Presupuesto | Ciclo, partidas, disponibilidad, compromiso básico |
| Compras | Requisición y OC básica ligada a partida |
| Ops mínimos | Health, logs, métricas, contenedores; runtime de tenant dedicado |

**Estrategia de entrega interna del MVP (recomendación EA)**

| Drop | Contenido | Para qué |
|------|-----------|----------|
| MVP-A | IAM + Catálogos + Auditoría + Workflow | Base de gobierno y seguridad |
| MVP-B | Documentos + Presupuesto + Compras | Valor municipal observable |

Ambos drops cumplen el mismo Definition of Done de plataforma (tenant, auditoría, APIs).

**Criterio de éxito MVP**

- Tenant dedicado municipal provisionado.  
- Roles operativos municipales funcionando.  
- Requisición/OC aprobada con documento anexado y compromiso presupuestal básico.  
- Trail de auditoría completo en el flujo.  
- Diseño multi-tenant verificado (claims/aislamento), aunque el runtime sea dedicado.

---

### Post-MVP / Fase 1 — “P2P + Presupuesto (profundización)”

**Objetivo prioritario tras el MVP (decisión D-05):** madurar Procure-to-Pay integrado al presupuesto.

| Dominio | Alcance Fase 1 |
|---------|----------------|
| Compras / P2P | Recepción, matching básico, estados hasta pago (según necesidad municipal) |
| Presupuesto | Compromiso / devengado / ejercido, modificaciones, controles de sobregiro |
| Documentos | Plantillas y expediente mínimo de la compra |
| Contabilidad / Tesorería | Solo en la medida indispensable para cerrar el pago (no suite financiera completa) |

**Explícitamente fuera de Fase 1 (D-06):**

- Nómina  
- Ciudadanía  
- Recaudación  
- Programas Sociales  
- BI  
- IA  

**Criterio de éxito Fase 1**

- Ciclo P2P municipal con afectación presupuestal confiable extremo a extremo.  
- Disponibilidad presupuestal en tiempo real con bloqueo de sobregiro.  
- Evidencia documental + auditoría suficientes para control interno del municipio.

---

### Fase 2 — “Operación ampliada (post control del gasto)”

| Dominio | Alcance sugerido |
|---------|------------------|
| Inventarios / almacén municipal básico | Existencias de bienes |
| Proveedores / 3-way match maduro | Calidad P2P |
| Contrataciones públicas | Procedimiento → contrato → compras |
| Transparencia (base) | Obligaciones ligadas a contratos/presupuesto |
| Contabilidad ampliada | Si el municipio lo exige como SoR contable |

> Nómina, BI e IA siguen **fuera** hasta que el steering las readmita formalmente.

---

### Fase 3 — “Servicio al ciudadano y escala”

| Dominio | Alcance sugerido |
|---------|------------------|
| Gestión ciudadana + expediente | C2S |
| Recaudación / programas sociales | Padrones, liquidaciones, beneficios |
| Portal ciudadano | Self-service |
| Fiscalización / control | Hallazgos y seguimiento |
| Multi-tenant compartido (opcional) | Onboarding de más municipios en modelo SaaS |
| HA / DR / performance enterprise | NFR de escala |

---

### Dependencias entre olas

```text
MVP-A (IAM, Catálogos, Auditoría, Workflow)
  └── MVP-B (Documentos, Presupuesto, Compras)   ← MVP aprobado
        └── Fase 1 (P2P + Presupuesto profundidad)
              └── Fase 2 (Inventarios, Contrataciones, Transparencia…)
                    └── Fase 3 (Ciudadanía, Recaudación, Programas, Escala)
```

**Regla de oro:** no abrir Fase 2/3 si el MVP municipal no demuestra aislamiento, auditoría y afectación compra–presupuesto.

---

## Anexos

### A. Decisiones de sponsor — CERRADAS

Registro maestro: **[EA-DEC-001](02-DECISIONES-SPONSOR.md)**

| ID | Decisión |
|----|----------|
| D-01 | Piloto **municipal** |
| D-02 | Arquitectura **multi-tenant** |
| D-03 | Implementación inicial en **tenant dedicado** |
| D-04 | MVP = IAM + Catálogos + Auditoría + Workflow + Documentos + Presupuesto + Compras |
| D-05 | Prioridad post-MVP = **P2P + Presupuesto** |
| D-06 | Fuera de Fase 1 = Nómina, Ciudadanía, Recaudación, Programas Sociales, BI, IA |

### B. Artefactos siguientes (sin código)

- Business Capability Map del MVP municipal.  
- Matriz de proceso P2P–B2R (piloto).  
- NFR: tenant dedicado vs capacidad multi-tenant.  
- Definition of Ready del municipio piloto (organigrama, partidas, catálogos).  
- Architecture Vision técnica (TOGAF Phase A/B) acotada al MVP.

### C. Relación con el arquetipo técnico

La visión de negocio queda **alineada**. El arquetipo técnico se usará como hipótesis de implementación **solo después** de cerrar Capability Map + NFR del MVP. Sin adelantar dominios excluidos (D-06).

---

## Control del documento

| Versión | Fecha | Autor rol | Cambio |
|---------|-------|-----------|--------|
| 0.1 | 2026-11-04 | Enterprise Architect | Visión inicial para alineación |
| 0.2 | 2026-11-04 | Enterprise Architect | Roadmap y alcance alineados a EA-DEC-001 (piloto municipal) |
