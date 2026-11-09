# Login (feat-login)

Inicio de sesión con **3 campos**: empresa, usuario, contraseña.  
Los permisos/menú los asigna un administrador; el usuario **no elige rol** al entrar.

## Probar en local

```bash
cd erp-grp-platform/backend
mvn -pl services/iam-service -am spring-boot:run -Dspring-boot.run.profiles=local
```

- Pantalla: http://localhost:8081/login.html  
- API: `POST http://localhost:8081/api/v1/auth/login`

```json
{ "company": "ACME", "username": "admin.acme", "password": "demo1234" }
```

Usuarios demo: `admin.acme` (menú completo) · `compras.acme` (menú reducido) · pass `demo1234`.

Tras login: `GET /api/v1/me` y `GET /api/v1/me/menus` con `Authorization: Bearer <token>`.

## Tests

```bash
mvn -pl services/iam-service -am test
```
