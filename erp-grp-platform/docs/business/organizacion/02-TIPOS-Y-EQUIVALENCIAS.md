# 2. Tipos organizacionales y equivalencias
## ORG-001

## 2.1 Catálogo canónico de `OrgUnitType`

Todos los términos solicitados se modelan como **tipos** del metamodelo:

| Código tipo | Nombre | Nivel típico | Sector |
|-------------|--------|--------------|--------|
| `HOLDING` | Holding | 0–1 (cúspide grupo) | Privado / mixto |
| `ENTERPRISE` / `COMPANY` | Empresa | 1 (Legal Entity operativa) | Privado |
| `ORGANIZATION` | Organización | 0–1 (ente raíz del tenant) | Ambos |
| `AGENCY` / `DEPENDENCY` | Dependencia | 1–2 | Público |
| `SECRETARIAT` | Secretaría | 2–3 | Público |
| `DIRECTORATE` | Dirección | 3–4 | Ambos |
| `SUBDIRECTORATE` | Subdirección | 4–5 | Ambos |
| `COORDINATION` | Coordinación | 4–6 | Público (también privado) |
| `DEPARTMENT` | Departamento | 5–7 | Ambos |
| `AREA` | Área | Hoja / casi hoja | Ambos |

> **Nota:** `ORGANIZATION` es el nodo raíz lógico del organigrama del tenant. En un municipio suele equivaler al Ayuntamiento / Municipio; en privado, al Grupo u Organización matriz visible.

---

## 2.2 Relación con `LegalEntity`

| Tipo organizacional | ¿Es también LegalEntity? | Regla |
|---------------------|--------------------------|-------|
| Holding | Opcional (a veces es holding legal; a veces solo reporting) | Puede existir `LegalEntity(HOLDING)` + `OrgUnit(HOLDING)` enlazados |
| Empresa | **Sí, normalmente** | 1 `LegalEntity(COMPANY)` ↔ 1..n `OrgUnit` operativos |
| Organización | A veces | Raíz org; puede mapear al ente público |
| Dependencia | Frecuente en público | Dependencia = ente o sub-ente con autonomía relativa |
| Secretaría → Área | **No** | Unidades administrativas internas |

**Justificación (SAP/Oracle):** no todas las OU tienen libros contables. Solo las *Legal Entities* / *Company Codes* son sujetos contables/fiscales. Las secretarías son OU.

---

## 2.3 Matriz de equivalencia Público ↔ Privado

| Público (GRP) | Privado (ERP) | Tipo canónico |
|---------------|---------------|---------------|
| Grupo / Sector (raro) | Holding | `HOLDING` |
| Ente público / Municipio / Organismo | Empresa / Compañía | `ORGANIZATION` + `LegalEntity` |
| Dependencia | Filial / Business Unit | `DEPENDENCY` o `BUSINESS_UNIT`* |
| Secretaría | División / Vicepresidencia | `SECRETARIAT` ≈ `DIVISION` |
| Dirección | Dirección / Gerencia Sr. | `DIRECTORATE` |
| Subdirección | Subgerencia | `SUBDIRECTORATE` |
| Coordinación | Coordinación / Office | `COORDINATION` |
| Departamento | Departamento | `DEPARTMENT` |
| Área | Área / Team | `AREA` |

\*Se recomienda agregar `BUSINESS_UNIT` como alias tipado en perfil privado si se desea naming más natural; internamente es el mismo metamodelo.

---

## 2.4 Atributos mínimos de OrgUnit

| Atributo | Descripción |
|----------|-------------|
| `code` | Código estable único por tenant |
| `name` / `labels[]` | Nombre multiidioma |
| `orgUnitType` | Tipo canónico |
| `legalEntityId` | Dueño legal (obligatorio salvo nodos puramente de reporting) |
| `parentOrgUnitId` | Padre en jerarquía estructural default |
| `costCenterRef` / `budgetResponsible` | Enlace a finanzas/presupuesto (opcional) |
| `managerPositionId` | Plaza jefatural de la unidad |
| `status` | ACTIVE / INACTIVE |
| `validFrom` / `validTo` | Vigencia |
| `sectorTags` | p.ej. `MUNICIPAL_TREASURY`, `PUBLIC_WORKS` |

---

## 2.5 Reglas de tipado (reutilizables)

1. Un tenant declara qué `OrgUnitType` están **habilitados** (`sectorProfile`).  
2. No todos los tipos son obligatorios (una PYME puede usar solo Empresa→Dirección→Área).  
3. El tipo no implica profundidad fija: una “Dirección” puede colgar de Secretaría o directamente de Organización.  
4. Renombrar labels (i18n) no crea nuevo tipo.  
5. Tipos gubernamentales no se usan en tenants `PRIVATE_CORPORATE` salvo activación explícita (y viceversa).
