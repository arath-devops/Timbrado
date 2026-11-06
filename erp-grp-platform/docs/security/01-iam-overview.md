# Identity and Access Management

## Objetivos
- Autenticación fuerte (MFA) para privilegios
- Autorización fina RBAC + ABAC (tenant, módulo, unidad administrativa, monto)
- SSO federado con IdP institucionales (SAML/OIDC)
- Zero Trust: cada request valida JWT + política

## Componentes
| Componente | Rol |
|------------|-----|
| iam-service | Authorization Server (Spring Authorization Server) |
| API Gateway | Validación JWT, rate limit, route guards |
| Microservicios | Resource Servers (JWT + method security) |
| Angular Shell | PKCE public client + silent renew |
| Portal Ciudadano | Cliente OIDC separado (scopes limitados) |

## Justificación
Alineado a patrones Microsoft Entra ID / Oracle IAM / SAP IAS: un IdP central, apps como resource servers, claims enriquecidos (`tenant_id`, `modules`, `roles`, `ou`).
