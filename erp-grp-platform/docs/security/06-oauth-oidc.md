# OAuth2 / OIDC / JWT / MFA / SSO

## Authorization Server
Spring Authorization Server en `iam-service`:
- Grant types: `authorization_code` + PKCE, `client_credentials` (M2M), `refresh_token`
- Scopes: `openid`, `profile`, `erp.read`, `erp.write`, `grp.read`, `grp.write`, `audit.read`
- Tokens: JWT RS256 (keys en JWKS `/oauth2/jwks`), access TTL 15m, refresh 8h rotativo

## Claims JWT
```json
{
  "sub": "user-uuid",
  "tenant_id": "dep-xyz",
  "preferred_username": "jperez",
  "roles": ["AREA_MANAGER","BUD_APPROVER"],
  "modules": ["erp.finance","erp.accounting","grp.budget"],
  "ou": "DG-FIN-001",
  "amr": ["pwd","otp"],
  "sid": "session-id"
}
```

## MFA
- TOTP (default) + WebAuthn opcional
- Step-up MFA para: pagos, adjudicaciones, cierre de periodo, export masivo PII

## SSO
- Federation: OIDC/SAML IdP institucionales
- Just-In-Time provisioning de usuarios
- Single Logout (back-channel)

## Hardening
- Token revocation list en Redis (sid)
- Brute-force protection
- Passwordless opcional para ciudadanos (magic link + OTP)
