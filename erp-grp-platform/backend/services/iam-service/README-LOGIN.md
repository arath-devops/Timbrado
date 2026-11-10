# Login + menú (feat-menu)

Inicio de sesión con **3 campos**: empresa, usuario, contraseña.  
Tras entrar: **shell** con hamburguesa, menú por permisos y dashboard stub.

Los permisos/menú los asigna un administrador; el usuario **no elige rol** al entrar.

## Probar en local

```bash
cd erp-grp-platform/backend
mvn -pl services/iam-service -am spring-boot:run -Dspring-boot.run.profiles=local
```

1. Login: http://localhost:8081/login.html  
2. Tras Entrar → http://localhost:8081/app/ (menú ☰ + dashboard)

```json
{ "company": "ACME", "username": "admin.acme", "password": "demo1234" }
```

Usuarios demo: `admin.acme` (menú completo) · `compras.acme` (menú reducido) · pass `demo1234`.

API: `POST /api/v1/auth/login` · `GET /api/v1/me` · `GET /api/v1/me/menus` con `Authorization: Bearer <token>`.

## Tests

```bash
mvn -pl services/iam-service -am test
```
