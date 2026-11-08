# 2. Backlog detallado — IAM
## BL-S1-CORE-001

**Epic:** `E-IAM-S1` — Identidad municipal Sprint 1  
**Servicio:** `iam-service`  
**DoD:** DoD-001 · OpenAPI `shared/openapi/iam/v1.yaml` · DDL `database/flyway/iam/`

Leyenda prioridad: **P0** Must demo · **P1** Must módulo · **P2** Should  
Estimación: puntos relativos (1–8)

---

### IAM-001 — Provisionar schema y bootstrap tenant
| Campo | Valor |
|-------|--------|
| Tipo | Enabler |
| Prioridad | P0 |
| Pts | 3 |
| Como | equipo |
| Quiero | Flyway V1 (+ V2 RLS) y seed del tenant piloto |
| Para | tener base autenticable |
| AC | DB `iam_db` migrada; tenant UUID estable; roles seed ADMIN, PUR_CLERK, PUR_MANAGER, PUR_DIRECTOR, AUDITOR, BUDGET_OPS; 1 admin ACTIVE |
| Out | MFA seed |

### IAM-002 — Login password grant + JWT
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 5 |
| Como | usuario municipal |
| Quiero | autenticarme con usuario/password y tenant |
| Para | obtener access token |
| AC | `POST /oauth2/token` OK; JWT con `sub`, `tenant_id`, `roles`, `org_scopes`, `modules`, `sid`, `exp`; credenciales inválidas → 401; usuario LOCKED → 401/403 |
| Depende | IAM-001 |

### IAM-003 — JWKS
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 2 |
| Como | resource server |
| Quiero | publicar JWKS |
| Para | validar firmas |
| AC | `GET /oauth2/jwks` público; clave alinea con tokens emitidos |
| Depende | IAM-002 |

### IAM-004 — Alta y listado de usuarios
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P1 |
| Pts | 5 |
| Como | ADMIN |
| Quiero | crear y listar usuarios del tenant |
| Para | operar el piloto |
| AC | `POST/GET /api/v1/users`; unique username/email por tenant; paginación; solo ADMIN; audit fields |
| Depende | IAM-002 |

### IAM-005 — Lock de usuario
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P1 |
| Pts | 2 |
| Como | ADMIN |
| Quiero | bloquear un usuario |
| Para | impedir accesos |
| AC | `POST /users/{id}/lock`; status LOCKED; login falla; evento `UserLocked` (o UserCreated path) |
| Depende | IAM-004 |

### IAM-006 — Roles: listar y crear
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 3 |
| Como | ADMIN |
| Quiero | gestionar roles del tenant |
| Para | controlar acceso |
| AC | `GET/POST /api/v1/roles`; code único; permissions[] JSON/códigos; seed no se corrompe |
| Depende | IAM-001 |

### IAM-007 — Asignar roles a usuario (permisos vía rol)
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 3 |
| Como | ADMIN |
| Quiero | asignar el set de roles a un usuario |
| Para | que el JWT/me refleje permisos efectivos |
| AC | `POST /users/{id}/roles`; reemplazo del set; JWT siguiente login incluye roles; evento `RoleAssigned`; permisos efectivos = unión de permissions de roles |
| Depende | IAM-004, IAM-006 |

### IAM-008 — Organization Scope grants
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 5 |
| Como | ADMIN |
| Quiero | otorgar OrgScope OU_SUBTREE/OU_EXACT |
| Para | delimitar unidades visibles |
| AC | `POST /api/v1/scopes`; unique grant; claim `org_scopes` en JWT; visible en `/me` |
| Depende | IAM-004 |

### IAM-009 — GET /me
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 2 |
| Como | usuario autenticado |
| Quiero | ver mi perfil, roles, scopes y módulos |
| Para | que el cliente arme contexto |
| AC | `GET /api/v1/me` 200 con campos API-001; 401 sin token |
| Depende | IAM-002, IAM-007, IAM-008 |

### IAM-010 — GET /me/menus
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P1 |
| Pts | 3 |
| Como | usuario autenticado |
| Quiero | menú filtrado por módulos/roles |
| Para | navegación mínima |
| AC | Árbol incluye solo módulos habilitados del tenant; sin ítems MFA/SSO |
| Depende | IAM-009 |

### IAM-011 — Eventos IAM + outbox
| Campo | Valor |
|-------|--------|
| Tipo | Enabler |
| Prioridad | P1 |
| Pts | 3 |
| Como | plataforma |
| Quiero | publicar UserCreated y RoleAssigned |
| Para | auditoría/proyección |
| AC | Outbox; schemas EDA-MVP; key tenantId:userId |
| Depende | IAM-004, IAM-007 |

### IAM-012 — Seguridad tenant + tests DoD
| Campo | Valor |
|-------|--------|
| Tipo | Enabler |
| Prioridad | P0 |
| Pts | 5 |
| Como | equipo |
| Quiero | RLS, coverage gate, test cross-tenant |
| Para | cumplir DoD/CA-TEN |
| AC | FORCE RLS; test rechazo cross-tenant; coverage ≥ umbral DoD; OpenAPI alineada |
| Depende | IAM-002–011 |

### IAM-013 (Spike/OUT) — MFA/SSO/Federation
| Campo | Valor |
|-------|--------|
| Tipo | **Excluido** |
| Prioridad | — |
| Pts | 0 |
| Nota | No crear tareas de implementación; backlog futuro post Sprint 1 |

---

## Totales IAM (implementables)

| Prioridad | Pts aprox. |
|-----------|------------|
| P0 | 25 |
| P1 | 13 |
| **Total** | **~38** |
