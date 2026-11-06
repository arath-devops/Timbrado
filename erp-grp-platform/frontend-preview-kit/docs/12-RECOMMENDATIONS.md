# Entregable 12 — Recomendaciones UX (revisión crítica)

Análisis del diseño propuesto en este Preview Kit, desde CPO · UX · ERP/GRP · Fiori/Fusion/D365 · Angular Enterprise.

## Complejidad innecesaria

1. **Demasiados niveles orgánicos en menú** (Dependencia / Dirección / Coordinación / Departamento como pantallas hermanas). En Fiori/Dynamics suele bastar un **árbol único de OU** con filtros por tipo.
2. **Catálogo “Dependencias” duplicado** bajo Catálogos y Organización — confunde ownership del maestro.
3. **Estados P2P como catálogo editable** en UI de negocio: mejor configuración de plataforma (solo ADMIN), no menú diario del Director.
4. **Matriz CRUD 5 columnas de permisos** por código fino: saturante para municipio. Preferir **paquetes de rol** + excepciones.
5. **KPIs 8 tarjetas** en primer viewport del dashboard: exceso cognitivo. Fiori Launchpad / D365 suelen mostrar 4 primarios + “más métricas”.

## Campos sobrantes (formularios SC)

- Proveedor sugerido en la *solicitud* (pertenece más a cotización/OC).
- Prioridad libre sin regla de SLA (congelamos SLA OUT) — o se quita o se vuelve etiqueta informativa.
- Condiciones de pago en OC *y* de nuevo en pago: un solo lugar de verdad (OC).

## Mejoras UX prioritarias

| # | Mejora | Impacto |
|---|--------|---------|
| 1 | **Object page** (cabecera sticky + tabs: Datos / Líneas / Workflow / Docs / Auditoría) para SC y OC | Alto — patrón Fiori/Fusion |
| 2 | Dashboard con **4 KPIs + cola “Requiere su acción”** como hero de trabajo | Alto — adopción directivos |
| 3 | Bandeja workflow estilo **Jira/ServiceNow**: filtros saved, bulk approve con confirmación | Alto |
| 4 | Commit Budget como **stepper** post-aprobación (no pantalla huérfana) | Medio-Alto |
| 5 | Visor documental con **preview + acciones** sin salir del expediente | Medio |
| 6 | Empty states con CTA (“No hay tareas — crear SC”) | Medio |
| 7 | Reducir chrome: menos chips/badges simultáneos; color solo para estado semántico | Medio |

## Riesgos de adopción (gobierno municipal)

1. **Miedo al “sistema complejo”**: menú lateral denso → capacitación cara. Mitigar con roles que vean solo 5–7 entradas.
2. **Lenguaje técnico** (`CommitBudget`, `Idempotency-Key`, códigos de permiso): ocultar jerga en UI de negocio; dejarla en tooltips/admin.
3. **Doble captura** (papel + sistema) si el visor/expediente no es el sistema de record oficial.
4. **Tema oscuro**: útil en demos; en gabinete municipal el default debe ser **claro** con contraste WCAG AA.
5. **Password grant en login demo**: no educar al sponsor como flujo final; alinear a PKCE cuando exista FE real.

## Problemas de usabilidad detectados en el kit

- Búsqueda global solo con keywords demo (no full-text) — documentar como mock.
- Click derecho contextual genérico — útil como teaser, poco descubrible.
- Algunas rutas de “Historial” de org son stubs repetidos — unificar componente.
- Responsive OK hasta ~960px; tablas anchas requieren scroll (aceptable enterprise, pero añadir column picker en v2).

## Propuesta de versión mejorada (IA — Information Architecture)

```text
Inicio
  · Hoy (cola personal + 4 KPIs)
  · Escenarios / Ayuda

Trabajar
  · Solicitudes de compra
  · Aprobaciones (bandeja)
  · Expedientes

Control
  · Presupuesto (disponibilidad + compromisos)
  · Órdenes / Recepciones / Pagos
  · Auditoría (solo Contraloría / Admin)

Configurar (ADMIN)
  · Usuarios y roles
  · Estructura orgánica (árbol)
  · Catálogos
```

**Principio:** separar *Trabajar* (diario) de *Control* (seguimiento) y *Configurar* (pocas veces).

## Criterios para el FE Angular definitivo

1. Design system único (tokens de este kit → CSS variables / theme Angular Material 3 o CDK).
2. Object pages + smart tables (filters, density comfortable/compact).
3. Microcopy en español llano gubernamental (“Comprometer presupuesto”, no “Commit”).
4. Progressive disclosure: avanzado colapsado.
5. Medir adopción: tiempo a primera aprobación, % bandeja &lt; 24 h, tasa de rechazo por documentación incompleta.

---

**Veredicto CPO:** el kit es apto para **validar narrativa P2P y alcance de pantallas** con el municipio piloto. No es el IA final: antes de Angular, congelar la IA “Trabajar / Control / Configurar” y el object page de Solicitud.
