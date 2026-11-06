# 2. Modelo de Roles
## SEC-ARCH-001

## 2.1 Capas de roles

| Capa | Descripción |
|------|-------------|
| **Platform roles** | Administración de la plataforma / tenant |
| **Business roles ERP** | Operación privada/administrativa |
| **Business roles GRP** | Operación pública municipal |
| **External roles** | Ciudadano/Proveedor (fuera F1, reservados) |

Un usuario puede tener **N roles**; la autorización efectiva es la unión, limitada por OrgScope y políticas ABAC.

## 2.2 Roles de plataforma

| Código | Nombre | Descripción | MFA |
|--------|--------|-------------|-----|
| `SUPER_ADMIN` | Super Administrador | Tenants, licencias, break-glass global | Obligatorio |
| `ADMIN` | Administrador de tenant | Usuarios, roles, catálogos, OU, módulos | Obligatorio |
| `AUDITOR` | Auditor | Lectura de trails, reportes de control | Recomendado |
| `SECURITY_OFFICER` | Oficial de seguridad | Políticas, SoD, revisiones de acceso | Obligatorio |

## 2.3 Roles jerárquicos operativos

| Código | Nombre | Alcance típico OrgScope |
|--------|--------|-------------------------|
| `DIRECTOR` | Director / Titular de Dirección | `OU_SUBTREE` dirección |
| `AREA_MANAGER` | Jefe de Área / Departamento | `OU_SUBTREE` depto/área |
| `CLERK` | Capturista | `OU_EXACT` |
| `OPERATOR` | Operador | `OU_EXACT` o subtree limitado |
| `VIEWER` | Consulta | subtree read-only |

## 2.4 Roles ERP

| Código | Dominio | Función |
|--------|---------|---------|
| `FIN_ANALYST` | Finanzas | Estructura, FX, análisis |
| `ACC_ACCOUNTANT` | Contabilidad | Captura asientos |
| `ACC_CHIEF` | Contabilidad | Posteo/cierre |
| `TRE_OPERATOR` | Tesorería | Programar cobros/pagos |
| `TRE_PAYMASTER` | Tesorería | Ejecutar pagos |
| `PUR_REQUESTER` | Compras | Requisiciones |
| `PUR_BUYER` | Compras | OC / negociación |
| `PUR_RECEIVER` | Compras/Almacén | Recepciones |
| `PUR_AP_CLERK` | CXP | Matching factura |
| `INV_STOREKEEPER` | Inventarios | Movimientos |
| `HR_OFFICER` | RRHH | Altas/movimientos |
| `PAY_ANALYST` | Nómina | Cálculo (OUT-F1) |
| `PAY_APPROVER` | Nómina | Aprobación (OUT-F1) |
| `FA_CUSTODIAN` | Activos | Custodia |
| `CRM_AGENT` | CRM | Pipeline |

## 2.5 Roles GRP

| Código | Dominio | Función |
|--------|---------|---------|
| `BUD_ANALYST` | Presupuesto | Partidas, disponibilidad, propuestas |
| `BUD_APPROVER` | Presupuesto | Aprobar ciclo/modificaciones/compromisos sensibles |
| `PRC_OFFICER` | Contrataciones | Procedimientos |
| `PRC_COMMITTEE` | Contrataciones | Evaluación/fallo |
| `TRA_OFFICER` | Transparencia | Publicaciones |
| `CIT_AGENT` | Ciudadanía | Ventanilla (OUT-F1) |
| `TAX_COLLECTOR` | Recaudación | Liquidación/cobro (OUT-F1) |
| `SOC_OFFICER` | Programas | Padrones (OUT-F1) |
| `OVR_AUDITOR` | Fiscalización | Hallazgos |
| `DOC_MANAGER` | Documentos | Expedientes / retención |

## 2.6 Roles externos (reservados)

| Código | Uso futuro |
|--------|------------|
| `CITIZEN` | Portal ciudadano |
| `SUPPLIER_PORTAL` | Portal proveedor |
| `TAXPAYER` | Autogestión contribuyente |

## 2.7 Roles mínimos del piloto municipal (MVP)

| Persona | Roles | OrgScope |
|---------|-------|----------|
| Capturista de área | `CLERK` + `PUR_REQUESTER` | OU_EXACT área |
| Jefe de depto | `AREA_MANAGER` + `PUR_REQUESTER` | OU_SUBTREE depto |
| Director de obras | `DIRECTOR` | OU_SUBTREE dirección |
| Comprador | `PUR_BUYER` | TENANT o SERVICED units |
| Analista presupuesto | `BUD_ANALYST` | LEGAL_ENTITY / subtree finanzas |
| Aprobador presupuesto | `BUD_APPROVER` + MFA | LEGAL_ENTITY |
| Admin TI municipal | `ADMIN` + MFA | TENANT_ALL |
| Contraloría | `AUDITOR` + `OVR_AUDITOR`(read) | TENANT_ALL read |

## 2.8 Justificación

Se separan roles **operativos genéricos** de roles **de dominio** para no explotar combinaciones (patrón Dynamics/SAP composites). El alcance lo da OrgScope, no un rol “Director_Obras_Compras” por cada secretaría.
