# Acoplamiento pre-desarrollo ERP
## ERP-AC-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-AC-001 |
| Título | Qué falta acoplar para respetar el Freeze antes de desarrollar |
| Entrada | Lista funcional VoBo · ERP-SF-001 · ERP-CP-001 · ERP-FM-001 · ERP-SI-001 · preview · arquitectura servicios |
| Estado | **Bloqueantes cerrados** (2026-11-08) — listo para desarrollo ERP |
| Idioma | Español |
| Alcance | **Solo ERP** (sin GRP) |

> Objetivo: que **todas** las funcionalidades del congelamiento tengan dueño, contrato, datos, flujo y UI-spec alineados **antes** de escribir backend/Angular de producto.

---

## 0. Resumen ejecutivo

| Semáforo | Hallazgo |
|----------|----------|
| **Verde** | ADR-014: ERP sin `budget-service`; mapa ERP-MS-001; OpenAPI bajo `shared/openapi/erp/` |
| **Verde** | Eventos ERP-EV-001 · 6 WF ERP-WF-001 · SoD ERP-SOD-001 · seed ACME ERP-CFG-001 |
| Ámbar | Paquete de control aún no repartido pantalla×pantalla en FM §1–§14 ni preview P1 (retenciones, dual UI, folios) |
| Ámbar | Dueños técnicos de servicio: plantilla lista, nombres reales pendientes |
| Verde | Inventario pantallas + Freeze + Control Pack + preview P0 |

**Desarrollo de producto ERP** puede arrancar sobre contratos `shared/openapi/erp/*` y docs 09–13. Ítems ámbar no bloquean el primer sprint de implementación backend.

---

## 1. Matriz funcional → estado de acoplamiento

Leyenda: **OK** listo · **PARCIAL** existe pero incompleto · **FALTA** no acoplado.

### 1.1 Plataforma

| Funcionalidad Freeze | SI/FM | Preview | OpenAPI/servicio | Qué acoplar |
|----------------------|-------|---------|------------------|-------------|
| Login + compañía / entidad legal | OK | PARCIAL | IAM OK + `X-Legal-Entity-Id` en common | Propagar en implementaciones |
| Lanzador por rol | OK | OK | IAM; menú ERP-MS-001 | Sin tiles `grp.*` |
| Bandeja de aprobación | OK | PARCIAL | Workflow + ERP-WF-001 | Deep links |
| Expediente / auditoría / catálogos | OK | OK/stub | Core OK | Tipos DOC + roles Freeze en seed |
| Series de folio | CP OK | FALTA UI | ERP-CFG-001 | Implementar en catalog |

### 1.2 Compras (P2P)

| Funcionalidad | SI/FM | Preview | OpenAPI | Estado |
|---------------|-------|---------|---------|--------|
| PR / OC / GR / Vendors | OK | OK P0 | **`erp/procurement/v1.yaml`** | Desacoplado de budget (ADR-014) |
| OC desde PR | OK | OK UI | `POST /purchase-orders/from-pr` | Contrato listo |
| Match / factura proveedor | OK | OK | **`erp/ap/v1.yaml`** (no en procurement) | Separado CxP |

### 1.3–1.9 Dominios Freeze

| Dominio | OpenAPI ERP | Doc arquitectura |
|---------|-------------|------------------|
| Inventario | `erp/inventory/v1.yaml` | `architecture/erp/inventory-service.md` |
| CxP | `erp/ap/v1.yaml` | `architecture/erp/ap-service.md` |
| CxC / Billing / crédito | `erp/ar-billing/v1.yaml` | `architecture/erp/ar-billing-service.md` |
| Contabilidad | `erp/accounting/v1.yaml` | `architecture/erp/accounting-service.md` |
| Tesorería | `erp/treasury/v1.yaml` | `architecture/erp/treasury-service.md` |

---

## 2. Huecos de arquitectura (ERP vs GRP) — resueltos

| Tema | Resolución |
|------|------------|
| `budget-service` | **Fuera** del camino ERP — [ADR-014](../adr/ADR-014-erp-sin-budget-grp.md) |
| Mapa servicios | [ERP-MS-001](09-MAPA-SERVICIOS-ERP.md) |
| OpenAPI legado `procurement/v1.yaml` + `budget/` | Marcados deprecated / GRP-only |
| Claims menú | Solo `erp.*` + `core.*` en clientes ERP |

---

## 3. Flujos de trabajo

Especificados en [ERP-WF-001](11-WORKFLOWS-ERP-MVP.md):

| processKey | Freeze |
|------------|--------|
| `erp.pr.approve` | PR |
| `erp.po.approve` | OC (sin budget) |
| `erp.ap.match_exception` | Match |
| `erp.ap.payment_dual` | Dual pago |
| `erp.ar.credit_exception` | Crédito |
| `erp.gl.period_close` | Periodo |

---

## 4. Config / SoD / eventos

| Artefacto | Doc |
|-----------|-----|
| Eventos P2P/O2C | [ERP-EV-001](10-EVENTOS-ERP-MVP.md) |
| SoD casos | [ERP-SOD-001](12-SOD-CASOS-PRUEBA.md) |
| Seed ACME | [ERP-CFG-001](13-CONFIG-SEED-ACME.md) |

---

## 5. Lista priorizada — estado

### BLOQUEANTES

1. ~~Desacoplar ERP de GRP-budget~~ → **ADR-014 + contratos erp/procurement**
2. ~~Mapa de servicios ERP~~ → **ERP-MS-001**
3. ~~OpenAPI v0 inventory/ap/ar/accounting/treasury~~ → **`shared/openapi/erp/`**
4. ~~Catálogo eventos P2P/O2C~~ → **ERP-EV-001**
5. Repartir Paquete de control en FM Object Pages — **ámbar (no bloquea código backend)**
6. ~~Definiciones WF 6 procesos~~ → **ERP-WF-001**
7. ~~Matriz SoD ejecutable~~ → **ERP-SOD-001**
8. ~~Config series/umbrales seed ACME~~ → **ERP-CFG-001**

### IMPORTANTES (paralelo / siguiente)

9. Preview P1: retenciones, dual UI, payment_block, FX, folios  
10. Spec ficha cliente/proveedor completa  
11. EEFF/balanza read-model (contrato trial ya en accounting OpenAPI)  
12. Puerto CFDI (operación en ar-billing OpenAPI)  
13. Asignar dueños técnicos (plantilla en ERP-MS-001)

---

## 6. Checklist “listo para desarrollar”

- [x] Documento de desacople procurement↔budget GRP aprobado (ADR-014)
- [x] OpenAPI inventory + ap + ar-billing + accounting + treasury en repo (`shared/openapi/erp/…`)
- [x] Eventos P2P/O2C publicados (ERP-EV-001)
- [ ] FM por Object Page incluye columnas CP (ámbar)
- [x] 6 procesos WF especificados (ERP-WF-001)
- [x] Seeds umbrales/series/tax (ERP-CFG-001)
- [x] SoD con casos Given/When/Then (ERP-SOD-001)
- [ ] Dueños técnicos asignados (nombres reales)

**Veredicto:** bloqueantes de ingeniería **cerrados**. Abrir sprint de implementación backend ERP empezando por `procurement-service` alineado a `shared/openapi/erp/procurement/v1.yaml` (sin budget).

---

## 7. Orden de implementación sugerido

```text
1. Seeds IAM/catalog ACME + definiciones WF JSON
2. procurement-service (ERP contract) + eventos
3. inventory-service
4. ap-service + match + payment proposal
5. treasury-service (execute + SoD)
6. ar-billing-service + crédito
7. accounting-service (postings + periodos)
8. Preview P1 controles (opcional en paralelo)
```

---

**Fin ERP-AC-001**
