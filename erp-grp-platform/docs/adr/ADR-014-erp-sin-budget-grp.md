# ADR-014 — ERP comercial sin dependencia de budget-service (GRP)

| Campo | Valor |
|-------|--------|
| Estado | **Aceptado** |
| Fecha | 2026-11-08 |
| Decisores | Dueño de producto · Arquitectura (Cloud Agent feat-ERP) |
| Relacionado | ERP-SF-001 · ERP-AC-001 · SA-MS-001 · DDD-PORT-001 |

## Contexto

El piloto histórico unía `procurement-service` con `budget-service` (compromiso de partida pública CONAC).  
El congelamiento **ERP-SF-001** declara producto **solo ERP** comercial: no debe mezclarse con GRP.

Mantener `CommitBudget` como prerrequisito de `APPROVED` en OC **bloquea** un ERP funcional privado/PyME y contamina el bounded context de compras.

## Decisión

1. En el track **ERP (`feat-ERP` y contratos bajo `shared/openapi/erp/`)**:  
   - `procurement-service` **no** llama a `budget-service`.  
   - **No** existen campos `allocationId` / `budgetMovementId` en contratos ERP.  
   - La aprobación de OC depende de **workflow + umbrales + Control Pack**, no de fondos públicos.  
   - Control de gasto ERP (si aplica) = centro de costo / políticas internas, **no** partida presupuestal GRP.

2. `budget-service` y OpenAPI `shared/openapi/budget/` quedan **exclusivos del track GRP** (otra rama/iniciativa).

3. Eventos `BudgetCommitted` / `BudgetReleased` / `BudgetCommitFailed` **no** son consumidores obligatorios del ERP.

## Consecuencias

- Reescribir contratos y docs de procurement ERP sin budget.  
- Gateway / JWT `modules` del cliente ERP: solo `erp.*` + `core.*` (sin `grp.budget` en menú).  
- Código backend existente acoplado a budget debe ramificarse o feature-flaggearse; el camino feliz ERP no lo invoca.  
- GRP puede seguir usando el contrato legado P2P+budget en su propia línea.

## Alternativas rechazadas

| Alternativa | Motivo de rechazo |
|-------------|-------------------|
| Feature-flag “budget opcional” en el mismo contrato | Sigue mezclando modelos y confunde al equipo |
| Emular budget vacío siempre COMMITTED | Deuda técnica y mentira de dominio |
| Un solo procurement compartido ERP+GRP | Viola Freeze y DDD-PORT |

## Cumplimiento

Verificado en: ERP-AC-001 checklist · `docs/erp/09-MAPA-SERVICIOS-ERP.md` · OpenAPI `shared/openapi/erp/*`.
