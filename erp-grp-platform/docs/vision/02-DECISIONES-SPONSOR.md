# Registro de Decisiones de Sponsor  
## EA-DEC-001 — Alineación de alcance (Piloto Municipal)

| Campo | Valor |
|-------|--------|
| Documento | EA-DEC-001 |
| Relacionado | EA-VIS-001 |
| Estado | **Cerrado** |
| Fecha | 2026-11-04 |
| Segmento piloto | Dependencia / organismo **municipal** |

---

## 1. Decisiones aprobadas

| ID | Tema | Decisión | Implicación arquitectónica |
|----|------|----------|----------------------------|
| D-01 | Piloto | **Municipal** | Catálogos, presupuesto y compras alineados a estructura municipal; normativa local parametrizable |
| D-02 | Arquitectura de tenancy | **Multi-Tenant** (capacidad de plataforma) | Modelo de datos, IAM claims, auditoría y aislamiento diseñados multi-tenant desde el origen |
| D-03 | Implementación inicial | **Tenant dedicado** | Primer despliegue: instancia/aislado dedicado para el municipio piloto (sin co-location con otros tenants en el mismo runtime de datos sensibles) |
| D-04 | Alcance MVP | Ver sección 2 | MVP de valor municipal, no solo “core vacío” |
| D-05 | Prioridad post-MVP | **P2P + Presupuesto** | Profundizar Procure-to-Pay integrado al ciclo presupuestal |
| D-06 | Fuera de Fase 1 | Ver sección 3 | Congelamiento explícito de alcance |

### Nota de arquitectura (D-02 + D-03)

> La plataforma es **multi-tenant by design**; el piloto opera como **tenant dedicado** (dedicated tenancy).  
> Esto permite cumplir expectativas municipales de aislamiento/residencia sin renunciar a un futuro SaaS compartido para otros municipios.

```text
Control Plane (multi-tenant capable)
        │
        ▼
Data Plane piloto: Tenant dedicado "Municipio X"
  - IAM / Audit / Catalog / Workflow
  - Documentos
  - Presupuesto + Compras
```

---

## 2. MVP aprobado

| Módulo | Rol en el MVP | Resultado de negocio |
|--------|---------------|----------------------|
| **IAM** | Identidad, roles, permisos, tenant | Acceso controlado al municipio |
| **Catálogos** | Maestros municipales | Datos de referencia gobernados |
| **Auditoría** | Trail inmutable | Evidencia para control interno |
| **Workflow** | Aprobaciones | Gobernanza de requisiciones/OC/presupuesto |
| **Documentos** | Gestión documental básica | Anexos de OC, dictámenes, evidencias |
| **Presupuesto** | Ciclo y partidas (base) | Disponibilidad y afectación inicial |
| **Compras** | Requisición / OC (base) | Demanda administrativa ligada a partida |

### Criterios de aceptación del MVP (negocio)

1. Usuarios municipales autenticados con roles (p. ej. Capturista, Jefe de Área, Director, Auditor, Administrador).  
2. Catálogos maestros operables (unidades administrativas, rubros, proveedores básicos, etc.).  
3. Toda mutación relevante deja rastro en Auditoría.  
4. Flujo de aprobación (Workflow) sobre requisición/OC y/o movimiento presupuestal.  
5. Adjuntar y recuperar **Documentos** asociados a la transacción.  
6. Consultar disponibilidad presupuestal y registrar compromiso básico al aprobar compra.  
7. Operar en **tenant dedicado** sin contaminar el diseño multi-tenant de la plataforma.

### Dependencias internas del MVP

```text
IAM ──► todos
Catálogos ──► Presupuesto, Compras, Documentos
Workflow ──► Compras, Presupuesto
Documentos ──► Compras, Presupuesto
Compras ──► Presupuesto (afectación)
Auditoría ◄── todos (eventos de mutación)
```

---

## 3. Fuera de Fase 1 (congelado)

Los siguientes dominios **no** forman parte de la Fase 1 ni del MVP:

| Dominio excluido | Motivo de diferimiento |
|------------------|------------------------|
| Nómina | Complejidad laboral/fiscal; no bloquea piloto P2P-presupuestal |
| Ciudadanía / Gestión ciudadana | Canal externo; post control interno |
| Recaudación | Requiere padrones y canales de cobro maduros |
| Programas Sociales | Dependiente de padrones y reglas de elegibilidad |
| BI | Requiere datos operativos estables primero |
| IA | Fuera de horizonte de control administrativo inicial |

**También fuera de Fase 1 (implícito por prioridad):** portal ciudadano completo, programas de transparencia avanzada como producto separado, fiscalización avanzada, inventarios/logística completa, CRM, proyectos, activos fijos.

---

## 4. Prioridad inmediata después del MVP

**P2P + Presupuesto** (profundización):

| Incremento | Contenido típico |
|------------|------------------|
| P2P maduro | Recepción, factura/3-way match básico, estatus de pago |
| Presupuesto maduro | Momentos contables completos (compromiso/devengado/ejercido), modificaciones |
| Integración | Trazabilidad compra → partida → documento → auditoría |
| Contabilidad/Tesorería ligera | Solo si es indispensable para cerrar el ciclo de pago del municipio (decisión de diseño en Architecture Vision) |

---

## 5. Impacto en riesgos

| Riesgo | Cambio tras decisión |
|--------|----------------------|
| R-01 Alcance inflado | **Mitigado parcialmente** por exclusiones D-06; MVP sigue siendo amplio (7 módulos) → requiere gobierno de scope semanal |
| R-02 Normativa | **Enfocado** a marco municipal del piloto (reduce heterogeneidad inicial) |
| R-08 Multitenancy | **Diseño multi-tenant + runtime dedicado** reduce riesgo de fuga en piloto; mantener pruebas de aislamiento igual |

### Riesgo nuevo

| ID | Riesgo | Mitigación |
|----|--------|------------|
| R-11 | MVP sobrecargado (Core + Documentos + Presupuesto + Compras) | Entregar MVP en **dos drops internos** (Core → Valor municipal) sin relajar criterios de aceptación globales |

---

## 6. Próximos artefactos EA (sin código)

1. Actualización de EA-VIS-001 (roadmap alineado) — hecha en paralelo.  
2. Capability Map municipal del MVP.  
3. Matriz de procesos P2P–B2R del piloto.  
4. NFR de tenant dedicado vs multi-tenant.  
5. Definition of Ready del primer municipio (datos maestros, organigrama, partidas).

---

## Control

| Versión | Fecha | Cambio |
|---------|-------|--------|
| 1.0 | 2026-11-04 | Decisiones de sponsor registradas y cerradas |
