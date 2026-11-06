# Git Flow / Branch Strategy

```
main              # producción
develop           # integración
feature/*         # features
bugfix/*         # fixes
release/x.y.z     # estabilización
hotfix/x.y.z      # prod hotfixes
```

Cloud agents usan: `cursor/<descripcion>-xxxx`.

Protecciones:
- PR obligatorio a `main`/`develop`
- CI green + 1 review (2 en prod release)
- No force-push a main
