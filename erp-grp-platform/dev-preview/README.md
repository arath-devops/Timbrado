# ERP · Dev Preview (local)

Preview **acumulativa** de la interfaz conforme se termina cada módulo.  
**No publicar.** Solo para revisar UX, botones y flujos en local.

## Arranque

```bash
cd erp-grp-platform/dev-preview
python3 -m http.server 4175 --bind 127.0.0.1
```

Abrir: http://127.0.0.1:4175/

## Módulos

El índice lee `modulos.json`. Al cerrar una fase:

1. Agregar la pantalla en `modulos/<nombre>/`
2. Registrar la entrada en `modulos.json`
3. Probar botones/estados en el navegador (y ajustar)

## Login (Fase A)

- Ruta: `/modulos/login/`
- Modo **demo** (default): simula login sin backend para probar toggle, ripple y spinner
- Modo **API**: `?api=http://localhost:8081` con `iam-service` en perfil `local`
- Tras login exitoso redirige a **Shell**

Credenciales demo: empresa `ACME` · `admin.acme` / `compras.acme` · `demo1234`

## Shell · Menú · Dashboard (Fase 1)

- Ruta: `/modulos/shell/` (también tras login)
- Hamburguesa con menú filtrado por permisos
- Dashboard stub (KPIs + accesos rápidos)
- Comparar: `admin.acme` ve Finanzas/Admin; `compras.acme` ve menos opciones
