# 2. Modelo conceptual MVP
## DA-MVP-001

Lenguaje de negocio (sin atributos técnicos). Un bounded context = un database.

## 2.1 IAM

**Conceptos:** Usuario · Rol · Asignación Usuario-Rol · Grant de alcance organizacional (OrgScope) · Sesión.

**Reglas:** Un usuario pertenece a un tenant. Un usuario puede tener varios roles. OrgScope delimita unidades administrativas visibles. Sesión representa autenticación vigente/revocable.

## 2.2 Catalog

**Conceptos:** Tipo de catálogo · Ítem de catálogo.

**Reglas:** Cada ítem tiene código único por tipo y tenant. Ítems se desactivan (no se borran). Tipos cerrados del piloto: ORG_UNIT, BUDGET_CATEGORY, SUPPLIER_BASIC, CURRENCY, DOC_TYPE.

## 2.3 Audit

**Conceptos:** Hecho auditable (AuditFact / AuditRecord).

**Reglas:** Solo se inserta. Representa quién hizo qué sobre qué entidad, con before/after opcionales y correlación.

## 2.4 Workflow

**Conceptos:** Definición de proceso · Instancia de proceso · Tarea humana.

**Reglas:** Una definición versionada (`PO_APPROVAL`) genera instancias ligadas a un businessRef (agregado externo). Las tareas se completan con APPROVE/REJECT.

## 2.5 Document

**Conceptos:** Expediente (CaseFile) · Documento · Vínculo a negocio.

**Reglas:** El binario vive en object storage; la BD guarda metadatos y checksum. Un documento puede vincularse a un agregado (OC/REQ).

## 2.6 Procurement

**Conceptos:** Requisición (Purchase Request) · Orden de compra · Línea de OC/REQ.

**Reglas:** Estados DRAFT→SUBMITTED→APPROVED|REJECTED|CANCELLED. Referencia lógica a partida (`allocationId`) y expediente (`caseFileId`). Sin APPROVED sin compromiso presupuestal confirmado.

## 2.7 Budget

**Conceptos:** Ciclo presupuestal · Partida (Allocation) · Movimiento (Commit/Release).

**Reglas:** Invariante authorized ≥ committed ≥ accrued ≥ paid. Disponibilidad = authorized − committed (Sprint 1). Movimientos son hechos inmutables.

## 2.8 Mapa conceptual entre contextos (referencias lógicas)

```text
IAM.User ──(actor)──► Audit, Workflow, Document, Procurement, Budget
Catalog.Item ──(codes)──► Procurement.supplier, Document.docType, Budget.category
Document.CaseFile ──(id)──► Procurement
Budget.Allocation ──(id)──► Procurement
Workflow.ProcessInstance ──(businessRef)──► Procurement aggregate
```
