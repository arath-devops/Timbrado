# Arquitectura de Seguridad ERP + GRP
## SEC-ARCH-001 — Security Architect

| Campo | Valor |
|-------|--------|
| Documento | SEC-ARCH-001 |
| Entradas | EA-DEC-001, ORG-001, DDD-001, BA-PROC-001 |
| Piloto | Municipal · Tenant dedicado · Multi-tenant capable |
| Estado | Diseño completo (sin código) |
| Estándares | OAuth 2.1 / OIDC, JWT (RFC 7519), NIST MFA, RBAC+ABAC |

## Contenido

1. [Arquitectura IAM (OAuth2, OIDC, JWT, MFA, SSO)](01-ARQUITECTURA-IAM.md)
2. [Roles](02-ROLES.md)
3. [Permisos](03-PERMISOS.md)
4. [Políticas ABAC](04-POLITICAS-ABAC.md)
5. [Menús dinámicos](05-MENUS-DINAMICOS.md)
6. [Restricciones por organización, departamento y monto](06-RESTRICCIONES.md)
7. [Matrices de autorización ERP](07-MATRIZ-ERP.md)
8. [Matrices de autorización GRP](08-MATRIZ-GRP.md)
9. [SoD y controles](09-SOD-CONTROLES.md)

## Principio rector

> **Autenticación central (OIDC) + Autorización híbrida RBAC (qué) + ABAC (dónde/cuánto/cuándo) + OrgScope (organización/departamento).**
