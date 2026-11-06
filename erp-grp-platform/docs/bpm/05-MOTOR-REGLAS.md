# 5. Motor de Reglas
## BPM-001

## 5.1 Rol del motor

El Workflow Engine **no hardcodea** “si monto > 80 mil va a Director”. Delega en un **Rule Engine** (módulo del BC Workflow o servicio de decisiones) que evalúa:

- Routing (qué nodo sigue / qué nivel de aprobación)
- Candidatos (quién puede atender la task)
- Obligations (MFA, dual approval, firma obligatoria, documentos mínimos)
- SLA profile (qué política de tiempo aplicar)

**Justificación:** mismos umbrales que SEC-ARCH-001; un cambio de política municipal no redeploya Compras.

## 5.2 Fuentes de hechos (facts)

| Fact | Origen |
|------|--------|
| `amount`, `currency` | Payload / aggregate snapshot |
| `orgUnitId`, `departmentId`, `legalEntityId` | ORG-001 |
| `module`, `processKey` | Definición |
| `requesterId`, `createdBy` | IAM |
| `documentCompleteness` | Document BC |
| `budgetAvailability` | Budget read model (opcional pre-check) |
| `subject.roles`, `approvalLimit`, `orgScopes` | Token / IAM |
| `tenant.thresholds U0..U4` | Configuration |
| `calendar` | Calendario laboral municipal |

## 5.3 Decisiones tipadas

| decisionId | Entrada | Salida |
|------------|---------|--------|
| `resolveApprovalLevel` | amount, module | `L1|L2|L3|L4` + chain |
| `resolveCandidates` | level, orgUnitId, processKey | userIds / groups / positions |
| `requiresSignature` | amount, module, docType | boolean + signaturePolicy |
| `requiresDualApproval` | amount | boolean |
| `requiresMfa` | amount, action | boolean |
| `resolveSlaProfile` | level, module, priority | slaPolicyRef |
| `allowAutoApprove` | amount, requesterRole | boolean (raro; default false en público) |

## 5.4 Ejemplo de reglas municipales (declarativo)

```text
rule "PO_L1":
  when processKey == "PO_APPROVAL" && amount <= threshold.U0
  then approvalLevel = L1; candidates = managerOf(departmentId)

rule "PO_L2":
  when processKey == "PO_APPROVAL" && amount > threshold.U0 && amount <= threshold.U1
  then approvalLevel = L2; candidates = managerOf(directorateOf(orgUnitId))

rule "PO_L3_BUDGET":
  when processKey == "PO_APPROVAL" && amount > threshold.U1
  then chain = [L2_DIRECTOR, L3_BUD_APPROVER]; requiresMfa = true

rule "PO_SIGNATURE":
  when processKey == "PO_APPROVAL" && amount > threshold.U0
  then requiresSignature = true

rule "BUDGET_MODIFY":
  when processKey == "BUDGET_MODIFICATION"
  then candidates = role("BUD_APPROVER") in legalEntity; requiresMfa = amount > threshold.U2
```

## 5.5 Resolución de candidatos (routing organizacional)

Orden de resolución reutilizable:

1. Position manager de la OU solicitante  
2. Si ausente/delegado → Delegation activa  
3. Si level L2 → manager de OU padre tipo DIRECTORATE  
4. Si level L3 → grupo rol `BUD_APPROVER` / Secretaría de Finanzas  
5. Fallback → `ADMIN` pool (alertado)  

Filtros: OrgScope, SoD (`candidate != createdBy`), usuario ACTIVE, MFA enrolled si required.

## 5.6 Integración con ABAC de seguridad

El motor de reglas **propone** candidatos y caminos; el **PDP de seguridad** sigue autorizando `CompleteTask`.  
Doble control: regla de routing + SEC-ARCH-001.

## 5.7 Gobernanza de reglas

| Práctica | Detalle |
|----------|---------|
| Versionado | `ruleset:po-approval:v5` ligado a ProcessDefinition version |
| Simulación | Dry-run con montos/OU de prueba antes de publicar |
| Auditoría | Qué reglas dispararon en cada transición |
| Owner | SECURITY_OFFICER + dueño de proceso del módulo |
