# 6. Restricciones por organización, departamento y monto
## SEC-ARCH-001

## 6.1 Restricciones por organización (OrgScope)

| Scope | Significado | Ejemplo municipal |
|-------|-------------|-------------------|
| `OU_EXACT` | Solo su unidad | Área de Expedientes |
| `OU_SUBTREE` | Unidad + hijas estructurales | Dirección de Construcción |
| `LEGAL_ENTITY` | Todo el municipio/empresa | Ente MUNICIPIO-EJEMPLO |
| `TENANT_ALL` | Todo el tenant | Admin / Auditor |

### Reglas
1. Toda transacción de negocio lleva `orgUnitId` (solicitante) y opcional `servingOrgUnitId` (compras central).  
2. Lecturas filtran por scope en query (no solo en UI).  
3. Subtree no cruza LegalEntity.  
4. Grants `TENANT_ALL` requieren MFA + permiso `iam.scope:grant` + auditoría.

## 6.2 Restricciones por departamento

“Departamento” = OrgUnit de tipo `DEPARTMENT` (u OU ancla departamental).

| Control | Regla |
|---------|-------|
| Captura | `CLERK` solo crea en su `departmentId` |
| Aprobación L1 | `AREA_MANAGER` del mismo departamento/subtree |
| Aprobación L2 | `DIRECTOR` de la dirección padre |
| Excepción | `PUR_BUYER` central puede operar cross-dept para emitir OC, pero la requisición conserva OU origen |
| Reportes | Default = departamento del usuario; expandir exige scope |

### Policy

```text
Deny purchasing.requisition:create
if resource.departmentId not in subject.departmentsScoped
```

**Justificación:** reduce fraude interno y fugas de información entre secretarías.

## 6.3 Restricciones por monto (umbrales)

Umbrales configurables por **tenant** (y opcionalmente por LegalEntity). Moneda del tenant (MXN en piloto).

| Umbral | Código | Valor ejemplo* | Autoridad mínima | Controles extra |
|--------|--------|----------------|------------------|-----------------|
| U0 | `U0_MICRO` | ≤ 10,000 | `AREA_MANAGER` | — |
| U1 | `U1_LOW` | ≤ 80,000 | `DIRECTOR` | Documento soporte |
| U2 | `U2_MID` | ≤ 400,000 | `DIRECTOR` + `BUD_ANALYST` check | MFA step-up |
| U3 | `U3_HIGH` | ≤ 1,500,000 | `BUD_APPROVER` / Secretaría | Dual approval + MFA |
| U4 | `U4_CRITICAL` | > 1,500,000 | Cabildo/autoridad + sistema | Dual + MFA + notify contraloría |

\*Ejemplos ilustrativos; el municipio define montos reales en configuración.

### approval_limit en el sujeto

Cada Assignment/RoleGrant puede portar `approvalLimit` (Money).  
ABAC: `resource.amount <= subject.approvalLimit`.

### Aplicación por acción

| Acción | ¿Aplica umbral? |
|--------|-----------------|
| Crear requisición | Informativo (routing de workflow) |
| Aprobar requisición / OC | **Sí** |
| Commit presupuestal | Sí si modify/ampliación |
| Ejecutar pago | **Sí** (posiblemente umbrales propios) |
| Adjudicar contrato | Sí (F2+) |

## 6.4 Matriz combinada (Org × Depto × Monto)

| Rol | OrgScope | Depto | Monto máx. ejemplo |
|-----|----------|-------|--------------------|
| Capturista | OU_EXACT Área | Propio | Crea cualquier; no aprueba |
| Jefe depto | OU_SUBTREE Depto | Propio subtree | U0 |
| Director | OU_SUBTREE Dirección | Direcciones bajo su cargo | U1/U2 según grant |
| Comprador central | TENANT (compras) | Cross-dept emisión | No auto-aprueba U2+ sin rol director |
| Aprobador presupuesto | LEGAL_ENTITY | Finanzas | U3/U4 según política |
| Admin | TENANT_ALL | Todos | Break-glass solo + audit |

## 6.5 Justificación

Los tres ejes (organización, departamento, monto) cubren el 90% de controls de autoridad en ERP/GRP municipales y corporativos sin multiplicar roles por cada secretaría.
