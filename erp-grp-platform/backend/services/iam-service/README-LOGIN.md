# Login + menú (carcasa UI · feat-menu)

Pantallas estáticas para ir ajustando UX. En perfil **`local`** no hay JWT en las pantallas.

## Arranque

```bash
cd erp-grp-platform/backend
mvn -pl services/iam-service -am spring-boot:run "-Dspring-boot.run.profiles=local"
```

Windows PowerShell/CMD: las comillas del `-D` son obligatorias.

IntelliJ: Run `IamServiceApplication` con **Active profiles = `local`**.

## URLs

| Pantalla | URL |
|----------|-----|
| Login | http://localhost:8081/login.html |
| Menú / dashboard | http://localhost:8081/shell.html |
| Bandeja | Desde menú o tiles → **Bandeja de aprobación** |

Tras Entrar → `shell.html` (hamburguesa, lanzador por bloques, bandeja demo).

Demo: empresa `ACME` · `admin.acme` / `compras.acme` · `demo1234`.

## Nota

`/app/` redirige a `/shell.html`. No uses Postgres en local: el perfil `local` usa H2.
