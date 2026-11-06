# Frontend Preview Kit — ERP+GRP Municipal

Demo visual **standalone** (HTML + CSS + JS puro) del producto final para validar UX, navegación y procesos **antes** de Angular/backend.

> Rama: `feature-mock-preview`  
> Sin Angular · sin APIs · sin microservicios.

## Cómo abrir

```bash
cd erp-grp-platform/frontend-preview-kit
python3 -m http.server 4173
# Abrir http://127.0.0.1:4173/
```

1. `index.html` — Login (cualquier contraseña)  
2. Entra a `app.html#/dashboard` como **Lic. Mariana Ríos**, Director de Administración, Municipio de Ejemplo.

## Contenido

| Entregable | Ubicación |
|------------|-----------|
| 1 Sitemap / menús / flujo | `docs/01-SITEMAP.md` + `#/mapa` |
| 2 Dashboard ejecutivo | `#/dashboard` |
| 3 Organización | `#/org/*` |
| 4 IAM | `#/iam/*` + login |
| 5 Catálogos | `#/catalogos/*` |
| 6 Workflow + timeline | `#/workflow/*` |
| 7 Gestión documental + visor | `#/documentos/*` |
| 8 Presupuesto | `#/presupuesto/*` |
| 9 Compras P2P | `#/compras/*` |
| 10 Auditoría | `#/auditoria/*` |
| 11 Escenarios guiados | `#/escenarios` |
| 12 Recomendaciones UX | `docs/12-RECOMMENDATIONS.md` |

## Tema

Claro / oscuro — botón en header (`localStorage: erpgrp-preview-theme`).

## Stack visual

Material 3 tokens · tipografía Manrope · acento teal municipal · layout tipo Fiori/D365 (sidebar + shell).
