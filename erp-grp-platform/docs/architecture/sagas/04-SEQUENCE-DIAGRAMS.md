# 4. Diagramas de secuencia
## SAGA-MVP-001

## 4.1 Mermaid — Happy path (Budget aprobado)

```mermaid
sequenceDiagram
  autonumber
  actor Capturista
  actor Aprobador
  participant PRO as procurement-service
  participant DOC as document-service
  participant WF as workflow-service
  participant BUD as budget-service
  participant AUD as audit-service
  participant K as Kafka

  Capturista->>PRO: CreatePurchaseRequest
  PRO-->>PRO: DRAFT + sagaId
  PRO->>AUD: IngestAuditFact(CREATED)
  Capturista->>DOC: UploadDocument + LinkDocument
  DOC-->>K: DocumentUploaded / DocumentLinked
  Capturista->>PRO: SubmitPurchaseRequest (Idempotency-Key)
  PRO->>DOC: Validate checklist/links
  PRO->>WF: StartProcess(PO_APPROVAL) (Idempotency-Key)
  WF-->>K: WorkflowStarted
  PRO-->>PRO: state=AWAITING_APPROVAL
  PRO->>AUD: IngestAuditFact(SUBMITTED)

  Aprobador->>WF: CompleteTask(APPROVE) (Idempotency-Key)
  WF-->>K: WorkflowApproved
  K->>PRO: WorkflowApproved
  PRO-->>PRO: state=COMMITTING_BUDGET
  PRO->>BUD: CommitBudget (Idempotency-Key)
  BUD-->>PRO: 200 COMMITTED
  BUD-->>K: BudgetCommitted
  PRO-->>PRO: MarkApproved / state=CONFIRMING_DOCS
  PRO->>DOC: ConfirmDocumentLinkage
  DOC-->>K: DocumentLinked (si aplica)
  PRO-->>K: PurchaseRequestApproved
  PRO->>AUD: IngestAuditFact(APPROVED)
  AUD-->>K: AuditRecordCreated
  PRO-->>PRO: state=COMPLETED
```

## 4.2 Mermaid — Budget rechazado

```mermaid
sequenceDiagram
  autonumber
  participant PRO as procurement-service
  participant WF as workflow-service
  participant BUD as budget-service
  participant AUD as audit-service
  participant K as Kafka

  WF-->>K: WorkflowApproved
  K->>PRO: WorkflowApproved
  PRO->>BUD: CommitBudget (Idempotency-Key)
  BUD-->>PRO: 422 INSUFFICIENT_FUNDS
  BUD-->>K: BudgetCommitFailed
  PRO-->>PRO: MarkRejected
  PRO->>WF: Cancel/Close process (si aplica)
  PRO->>AUD: IngestAuditFact(COMMIT_FAILED / REJECTED)
  PRO-->>PRO: state=COMPENSATED_BUDGET_REJECTED
```

## 4.3 Mermaid — Compensación post-commit (cancelación)

```mermaid
sequenceDiagram
  autonumber
  actor Director
  participant PRO as procurement-service
  participant BUD as budget-service
  participant WF as workflow-service
  participant AUD as audit-service
  participant K as Kafka

  Director->>PRO: CancelPurchaseOrder (Idempotency-Key)
  PRO->>BUD: ReleaseBudget (Idempotency-Key)
  BUD-->>PRO: 200 RELEASED
  BUD-->>K: BudgetReleased
  PRO->>WF: CancelProcess (si abierto)
  PRO-->>PRO: MarkCancelled
  PRO->>AUD: IngestAuditFact(CANCELLED)
  PRO-->>PRO: state=COMPENSATED_CANCELLED
```

## 4.4 Mermaid — Timeout CommitBudget (estado desconocido)

```mermaid
sequenceDiagram
  autonumber
  participant PRO as procurement-service
  participant BUD as budget-service
  participant REC as recovery-job

  PRO->>BUD: CommitBudget (Key=K1)
  BUD--xPRO: timeout / 504
  PRO-->>PRO: state=NEEDS_RECOVERY
  loop retry <= 3
    PRO->>BUD: CommitBudget (Key=K1)
  end
  REC->>BUD: GET by referenceId / replay Key=K1
  alt already COMMITTED
    BUD-->>REC: COMMITTED
    REC->>PRO: Resume MarkApproved
  else never committed
    BUD-->>REC: not found / fail
    REC->>PRO: MarkRejected or retry policy
  end
```

## 4.5 UML Sequence (PlantUML) — Happy path

```plantuml
@startuml PurchaseApprovalSagaHappy
actor Capturista
actor Aprobador
participant "procurement-service\n<<Saga Orchestrator>>" as PRO
participant "document-service" as DOC
participant "workflow-service" as WF
participant "budget-service" as BUD
participant "audit-service" as AUD
queue Kafka

Capturista -> PRO: CreatePurchaseRequest()
activate PRO
PRO -> AUD: IngestAuditFact(CREATED)
Capturista -> DOC: UploadDocument()/LinkDocument()
DOC -> Kafka: DocumentUploaded/DocumentLinked
Capturista -> PRO: SubmitPurchaseRequest(idemKey)
PRO -> WF: StartProcess(PO_APPROVAL, idemKey)
WF -> Kafka: WorkflowStarted
PRO -> AUD: IngestAuditFact(SUBMITTED)
deactivate PRO

Aprobador -> WF: CompleteTask(APPROVE, idemKey)
WF -> Kafka: WorkflowApproved
Kafka -> PRO: WorkflowApproved
activate PRO
PRO -> BUD: CommitBudget(idemKey)
BUD --> PRO: COMMITTED
BUD -> Kafka: BudgetCommitted
PRO -> PRO: MarkApproved()
PRO -> DOC: ConfirmDocumentLinkage()
PRO -> Kafka: PurchaseRequestApproved
PRO -> AUD: IngestAuditFact(APPROVED)
AUD -> Kafka: AuditRecordCreated
deactivate PRO
@enduml
```

## 4.6 UML Sequence (PlantUML) — Budget rechazado

```plantuml
@startuml PurchaseApprovalSagaBudgetRejected
participant PRO
participant BUD
participant WF
participant AUD
queue Kafka

Kafka -> PRO: WorkflowApproved
PRO -> BUD: CommitBudget(idemKey)
BUD --> PRO: INSUFFICIENT_FUNDS
BUD -> Kafka: BudgetCommitFailed
PRO -> PRO: MarkRejected()
PRO -> WF: CancelProcess()
PRO -> AUD: IngestAuditFact(REJECTED)
@enduml
```
