# 7. Ejemplos de aplicación del metamodelo
## ORG-001

## 7.1 Ejemplo A — Holding privado multi-empresa

```text
Tenant: grupo-acme
LegalEntity: HOLDING-ACME, EMP-ACME-MX, EMP-ACME-CO

Org (STRUCTURAL):
HOLDING-ACME
 ├─ EMP-ACME-MX (ENTERPRISE)
 │   ├─ DIR-FIN (DIRECTORATE)
 │   │   ├─ DEP-CONTABILIDAD (DEPARTMENT)
 │   │   └─ DEP-TESORERIA (DEPARTMENT)
 │   ├─ DIR-COMPRAS (DIRECTORATE)
 │   │   └─ AREA-ABASTECIMIENTO (AREA)
 │   └─ DIR-OPS (DIRECTORATE)
 └─ EMP-ACME-CO (ENTERPRISE)
     └─ DIR-FIN-CO (DIRECTORATE)

Relations:
EMP-ACME-MX CONSOLIDATED_INTO HOLDING-ACME
EMP-ACME-CO CONSOLIDATED_INTO HOLDING-ACME
```

**Permisos:** un Director de Finanzas MX tiene `OU_SUBTREE` en `DIR-FIN` y `LEGAL_ENTITY=EMP-ACME-MX`. No ve Colombia salvo grant.

---

## 7.2 Ejemplo B — Municipio piloto (tenant dedicado)

```text
Tenant: mun-ejemplo (dedicated)
LegalEntity: MUNICIPIO-EJEMPLO
sectorProfile: PUBLIC_MUNICIPAL

Org (STRUCTURAL):
ORG-MUNICIPIO (ORGANIZATION)
 ├─ SEC-AYUNTAMIENTO / PRESIDENCIA (SECRETARIAT o tipo raíz municipal)
 ├─ SEC-ADMINISTRACION (SECRETARIAT)
 │   ├─ DIR-COMPRAS (DIRECTORATE)        ← SERVICED_BY para otras secretarías
 │   ├─ DIR-RECURSOS-HUMANOS (DIRECTORATE)
 │   └─ DIR-TI (DIRECTORATE)
 ├─ SEC-FINANZAS (SECRETARIAT)
 │   ├─ DIR-PRESUPUESTO (DIRECTORATE)   ← BUDGET responsible central
 │   ├─ DIR-TESORERIA (DIRECTORATE)
 │   └─ DIR-CONTABILIDAD (DIRECTORATE)
 ├─ SEC-OBRAS (SECRETARIAT)
 │   ├─ DIR-CONSTRUCCION (DIRECTORATE)
 │   │   ├─ COO-SUPERVISION (COORDINATION)
 │   │   └─ DEP-PROYECTOS (DEPARTMENT)
 │   │       └─ AREA-EXPEDIENTES (AREA)
 │   └─ DIR-MANTENIMIENTO (DIRECTORATE)
 └─ CTR-CONTRALORIA (DIRECTORATE / DEPENDENCY interna)
```

### Flujo MVP sobre esta estructura

1. `AREA-EXPEDIENTES` crea requisición (scope OU_EXACT).  
2. Jefe de `DEP-PROYECTOS` / Director de Construcción aprueba (subtree).  
3. `DIR-COMPRAS` emite OC (unidad `SERVICED_BY`).  
4. `DIR-PRESUPUESTO` / sistema ejecuta `CommitBudget` sobre partida con `responsibleOrgUnitId` compatible.  
5. Documentos quedan ACL a OU solicitante + compras + auditoría.  
6. Contraloría consulta trails con scope amplio read-only.

---

## 7.3 Ejemplo C — Dependencia estatal / secretaría

```text
ORG-DEPENDENCIA-SALUD (DEPENDENCY + LegalEntity)
 └─ SUBSECRETARIA-ADMIN (SUBDIRECTORATE / SECRETARIAT según marco)
     ├─ DIR-GENERAL-ADMIN (DIRECTORATE)
     │   ├─ DIR-ADQUISICIONES
     │   └─ DIR-RECURSOS-MATERIALES
     └─ DIR-GENERAL-FINANZAS
         └─ DIR-PRESUPUESTO
```

Mismo metamodelo; solo cambian tipos habilitados y profundidad.

---

## 7.4 Cómo “cabe” cualquier entidad

| Si la entidad es… | Configurar |
|-------------------|------------|
| PYME 1 empresa | 1 LegalEntity + OU Empresa + 2–3 niveles |
| Corporativo | Holding + N LegalEntity + consolidation relations |
| Municipio | 1 LegalEntity pública + Secretarías/Direcciones… |
| Organismo autónomo | Dependency/Organization como raíz |
| Empresa paraestatal | Mixto: LegalEntity pública + tipos gubernamentales |

---

## 7.5 Checklist de adopción (Definition of Ready org)

1. Definir `sectorProfile` y tipos habilitados.  
2. Cargar LegalEntity raíz.  
3. Cargar árbol `STRUCTURAL` mínimo hasta Área operativa del piloto.  
4. Definir positions manager por OU del hot path.  
5. Asignar personas/usuarios y OrgScopes.  
6. Mapear OU responsables de presupuesto y unidad de compras (`SERVICED_BY`).  
7. Probar matriz de permisos del MVP con 3 usuarios (capturista, jefe, director).
