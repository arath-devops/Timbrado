# 6. Permisos organizacionales
## ORG-001

## 6.1 Modelo: RBAC + ABAC organizacional

```text
Permitido si:
  (1) Usuario tiene Rol/Permiso funcional
  AND
  (2) Recurso.tenantId == Usuario.tenantId
  AND
  (3) Recurso.orgScope ∈ Usuario.OrgScopes (OU exacta o subtree)
  AND
  (4) Policies ABAC adicionales (monto, módulo, MFA, SoD)
```

**Justificación:** es el patrón de *security profiles* Oracle / *derived roles* + data security, y de authorization scopes en Dynamics. El rol solo no basta en multi-unidad.

---

## 6.2 OrgScope

| Atributo | Descripción |
|----------|-------------|
| `scopeType` | `OU_EXACT`, `OU_SUBTREE`, `LEGAL_ENTITY`, `TENANT_ALL` |
| `orgUnitId` | Ancla (si aplica) |
| `legalEntityId` | Para multi-empresa |
| `includesInactive` | Default false |
| `validFrom` / `validTo` | Delegaciones temporales |

### Scopes típicos por actor

| Actor | Scope sugerido |
|-------|----------------|
| Capturista de un Área | `OU_EXACT` de su área (+ tal vez padre para consultas) |
| Jefe de Departamento | `OU_SUBTREE` de su depto |
| Director | `OU_SUBTREE` de su Dirección |
| Secretario | `OU_SUBTREE` de su Secretaría |
| Administrador municipal | `TENANT_ALL` o `LEGAL_ENTITY` |
| Auditor | `TENANT_ALL` **read-only** o subtree fiscalizable |
| Comprador central | `TENANT_ALL` en compras + `SERVICED_BY` routing |
| Usuario Holding (corporativo) | Múltiples `LEGAL_ENTITY` grants explícitos |

---

## 6.3 Matriz de permisos organizacionales (muestra MVP)

| Permiso funcional | Capturista Área | Jefe Depto | Director | Secretaría | Admin Tenant | Auditor |
|-------------------|-----------------|------------|----------|------------|--------------|---------|
| Crear requisición propia OU | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Ver requisiciones subtree | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Aprobar requisición/OC | — | ✓* | ✓ | ✓ | ✓** | — |
| Ver disponibilidad presupuestal OU | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Comprometer presupuesto | — | — | ✓* | ✓ | ✓** | — |
| Modificar estructura OU hija | — | — | ✓ | ✓ | ✓ | — |
| Subir documentos del caso | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Consultar auditoría del scope | — | — | ✓*** | ✓*** | ✓ | ✓ |
| Alta usuarios del scope | — | — | — | ✓**** | ✓ | — |

\*según umbral de monto / responsabilidad  
\*\*break-glass auditado  
\*\*\*opcional  
\*\*\*si tiene `IAM_ADMIN_LOCAL`

---

## 6.4 Herencia y excepciones

| Regla | Detalle |
|-------|---------|
| Herencia subtree | Si scope es `OU_SUBTREE`, incluye hijos estructurales ACTIVE |
| No herencia cross-company | Subtree no cruza `LegalEntity` distinta salvo grant |
| Deny overrides | Un deny explícito (raro) gana a allow heredado |
| Delegación | Agrega scope temporal sin cambiar Assignment |
| SoD | Reglas de separación (crear vs aprobar) se evalúan dentro del mismo scope |

---

## 6.5 Vinculación con menús y módulos

```text
Menú visible = módulos del tenant ∩ permisos funcionales ∩ scope no vacío
```

Ejemplo municipal: un usuario del Área de Parques ve Compras (requisitar) y Documentos; no ve configuración IAM global.

---

## 6.6 Permisos sobre el propio modelo organizacional

| Permiso | Quién |
|---------|-------|
| `org:unit:read` | Todos autenticados (limitado a su scope) |
| `org:unit:write` | Admin / Secretario / Director (hijos) |
| `org:position:write` | HR / Admin (F2+) o Admin en MVP |
| `org:assignment:write` | HR / Admin |
| `org:scope:grant` | Admin tenant (y nunca auto-grant `TENANT_ALL` sin MFA) |

**Justificación de control estricto en `org:scope:grant`:** es el control que previene escalamiento de privilegios en multi-unidad (riesgo clásico en ERP gubernamentales).
