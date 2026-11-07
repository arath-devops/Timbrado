# ERP Preview Kit — Revisión por roles reales
## ERP-UX-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-UX-001 |
| Título | Análisis UX / productividad del Frontend Preview Kit |
| Tipo | Role-based UX Review (sin backend) |
| Estado | Borrador · `feat-ERP` |
| Artefacto revisado | `erp-grp-platform/erp-preview/` (+ `portable.html`) |
| Base funcional | ERP-SI-001 · ERP-FM-001 · ERP-XR-001 |
| Método | Simulación de usuarios reales por rol; walkthrough de menú, hubs, formularios y listados |
| Fuera de alcance | Calidad de código Angular/prod, performance real de API, accesibilidad WCAG formal |

---

## 0. Veredicto ejecutivo (1 párrafo)

El kit **cubre el mapa funcional MVP** (P2P, O2C light, GL/AP/AR/Billing/Tesorería, INV, RH/Nómina light), pero se siente como **matriz de campos técnica**, no como producto operativo. Los siete roles coinciden en tres dolores: (1) **labels en snake_case inglés** (`vendor_id`, `grand_total`), (2) **un solo usuario/sesión** sin launchpad por rol, (3) **flujos incompletos de object-page** (cabecera+1 línea plana, sin grid de líneas, sin match visual, sin ATP/crédito). Prioridad: humanizar UI y cerrar Control Pack XR **antes** de más pantallas.

---

## 1. Cómo se vivió el kit por rol

### 1.1 Director General

| Qué busca | Qué encuentra | Juicio |
|-----------|---------------|--------|
| “¿Cómo va el negocio?” en 10 s | Dashboard con 4 KPIs + bandeja + alertas | Útil pero genérico; no hay P&L flash, cash runway, ni ranking clientes/proveedores |
| No querer 40 entradas de menú | Sidebar denso (GL/CxP/Facturación/CxC/Tesorería/…) | Tras el fix de CxP/CxC mejoró; aún ve **Admin, Nómina, Proyectos** sin filtro de rol |
| Aprobar excepciones | Bandeja con 3 tareas | OK conceptual; falta monto vs presupuesto, riesgo y “por qué llegó a mí” |

**Confusión DG:** menú completo = producto “para todos” = ruido. Quiere **Home por rol** (tiles CFO / Comercial / Ops).

### 1.2 CFO

| Qué busca | Qué encuentra | Juicio |
|-----------|---------------|--------|
| CxP/CxC/cash en un vistazo | Hubs CxP/CxC/Tesorería + KPIs | Bien encaminado; aging es tabla mínima sin buckets vivos ni drill-down |
| Control Pack (crédito, retenciones, dual control) | Ausente en UI (coherente con FM; contradice XR gate) | **Bloqueante** para firmar Freeze |
| EEFF / balanza | Pantalla filtros sin resultado realista | No confía; parece stub |
| Multi-compañía | Solo login company | Falta switcher visible en topbar |

**Confusión CFO:** Facturación vs CxC vs Ventas — tres puertas al mismo ciclo; falta **mapa O2C** en UI.

### 1.3 Contador (GL / AP / AR)

| Qué busca | Qué encuentra | Juicio |
|-----------|---------------|--------|
| Captura AP rápida con OC+GR | Formulario plano `vendor_id`… `grand_total` | Productividad baja: **totales manuales**, sin líneas-grid, sin preview de match |
| Asiento balanceado | Form con 1 línea Debit/Credit | No se puede cargar asiento real de N líneas |
| Periodo OPEN | Lista periodos + badge | OK; falta warning en posting_date fuera de periodo |
| CFDI UUID | Campo suelto | Sin validación visual / estatus SAT simulado |

**Campos sobrantes (para el contador en captura diaria):** exponer `requester_id` / códigos técnicos en labels.  
**Campos faltantes (productividad):** cuenta GL sugerida, centro de costo en línea, retención, payment_block, indicador 2-way/3-way.

### 1.4 Comprador

| Qué busca | Qué encuentra | Juicio |
|-----------|---------------|--------|
| PR → OC → recepción | Flujos existen y están enlazados | Buen esqueleto |
| Convertir PR aprobada a OC en 1 clic | Hay que ir a “Nueva OC” y elegir PR | Falta acción **“Crear OC desde PR”** en detalle |
| Ver open qty / recibidos | Detalle OC sin líneas ni receipts | No puede operar recepción inteligente |
| Vendor BLOCKED | Alerta en form OC | Bien; falta badge en lista y bloqueo duro UX |

**Confusión:** `line_item_id` vs descripción libre; no hay catálogo con precio histórico.

### 1.5 Vendedor

| Qué busca | Qué encuentra | Juicio |
|-----------|---------------|--------|
| Pedido → entrega → factura | Tres módulos (Ventas / Entregas / Facturación) | Correcto de dominio, **malo de journey** |
| Stock al confirmar | No hay ATP / qty_available | Riesgo promesa falsa |
| Límite de crédito | No existe en UI | Crítico (XR) |
| Lista de precios | `price_list_id` opcional vacío | No hay pantalla Precios MVP visible |

**Flujo innecesario percibido:** salir de Ventas a Finanzas→Facturación para emitir; espera botón **Facturar** en detalle SO (existe link, pero el menú no cuenta la historia).

### 1.6 Encargado de almacén

| Qué busca | Qué encuentra | Juicio |
|-----------|---------------|--------|
| Recibir contra OC | `recepcion.html` genérica | Le falta: líneas abiertas, qty pendiente, tolerancia, lote/serie stub |
| Existencias por almacén | Tabla qty única | Falta reserved/available, ubicación |
| Movimientos ADJUST | Form suelto | Sin Motivo obligatorio UX fuerte ni aprobación visible |
| Escaneo / móvil | UI desktop densa | No pensado para piso |

**Confusión:** Recepción vive en **Compras**, no en Inventarios — aceptable SAP-style, pero el rol no mira Compras primero.

### 1.7 RRHH

| Qué busca | Qué encuentra | Juicio |
|-----------|---------------|--------|
| Directorio + ficha | Lista empleados | Sin ficha detallada, sin org chart usable |
| Ausencias | 3 campos | Sin saldo de vacaciones, sin calendario, sin aprobador |
| Nómina | Corrida + dispersión | Demasiado abstracto; sin incidencias ni recibo |
| Datos fiscales MX | No hay RFC/CURP/NSS | Bloqueante si Nómina IN (XR) |

**Juicio RRHH:** módulo “demo de existencia”, no operable. Preferiría **ocultar Nómina** del menú MVP o marcarla “Professional stub”.

---

## 2. Hallazgos transversales (todos los roles)

### 2.1 Pantallas / patrones confusos

| ID | Hallazgo | Roles afectados | Severidad |
|----|----------|-----------------|-----------|
| C-01 | Labels técnicos (`vendor_id`, `grand_total`, `org_unit_id`) en vez de español de negocio | Todos | **Alta** |
| C-02 | Estados en inglés (`PENDING_APPROVAL`, `SOFT_CLOSE`) sin glosario | Todos | Media |
| C-03 | Un solo perfil (`mhernandez` Controller) para toda la demo | Todos | **Alta** |
| C-04 | Sidebar sin personalización / demasiados ítems Professional mezclados | DG, Almacén, Vendedor | **Alta** |
| C-05 | Hubs Finanzas vs pantallas operativas: doble navegación (hub → lista → form) | Contador, CFO | Media |
| C-06 | Búsqueda global solo redirige por keyword; no abre el documento | Todos | Media |
| C-07 | Object pages sin tabs (Datos / Líneas / WF / Docs / Audit) prometidos en diseño | Comprador, Contador | **Alta** |
| C-08 | Portable vs multi-página: dos shells; riesgo de divergencia | ADM / demo | Baja |

### 2.2 Campos sobrantes o mal priorizados en UI

| ID | Campo / UI | Por qué sobra o estorba | Acción |
|----|------------|-------------------------|--------|
| S-01 | Mostrar `*_id` crudos como label | Usuario no habla IDs | Label humano + ID en secondary |
| S-02 | `cfdi_usage` / `cfdi_uuid` sueltos sin sección “Fiscal MX” | Parecen opcionales raros | Agrupar en panel Fiscal |
| S-03 | Admin Roles/SoD / Auditoría visibles a todos | Ruido para roles ops | Solo ADM / CFO lectura |
| S-04 | Proyectos + Timesheets en menú default | Fuera del día a día de PyME MVP | Mover a “Más módulos” |
| S-05 | Campos Enterprise en misma densidad que MVP | Fatiga cognitiva | Progressive disclosure |

### 2.3 Campos faltantes (UX / productividad — alineado a XR Control Pack)

| ID | Faltante | Dónde | Roles | Prioridad UI |
|----|----------|-------|-------|--------------|
| F-01 | `company` switcher visible | Topbar | Todos | P0 |
| F-02 | Grid de **líneas** (N filas add/remove) | PR, OC, AP, SO, Journal | Contador, Comprador, Vendedor | **P0** |
| F-03 | Open qty / received / billed | Detalle OC / AP match | Comprador, Contador, Almacén | **P0** |
| F-04 | Credit limit / block | Cliente + SO | Vendedor, CFO | **P0** |
| F-05 | qty_available / reserved | Existencias + SO | Almacén, Vendedor | P0 |
| F-06 | cost_center / account assignment | PR/PO/AP lines | Contador, Comprador | P0 |
| F-07 | withholding / payment_block | AP | Contador, CFO | P1 |
| F-08 | dual_control en pagos | Órdenes de pago | CFO, Tesorería | P1 |
| F-09 | RFC/CURP/NSS | Empleado | RRHH | P1 (si Nómina IN) |
| F-10 | Match panel 3-way (PO×GR×INV) | Detalle factura AP | Contador | **P0** |
| F-11 | Saldo vacaciones + aprobador | Ausencias | RRHH | P2 |
| F-12 | Folio / document_number humano | Todas listas | Todos | P1 |

### 2.4 Flujos innecesarios o costosos

| ID | Flujo | Problema | Mejora |
|----|-------|----------|--------|
| U-01 | Login → siempre mismo Controller | No prueba permisos | Selector de rol demo (7 perfiles) |
| U-02 | PR aprobada → Nueva OC manual | Extra clicks | Acción “Crear OC” |
| U-03 | SO → menú Facturación separado | Journey roto | Facturar desde SO + deep link |
| U-04 | Recepción solo desde Compras | Almacén no la encuentra | Tile “Recepciones” en Inventarios (misma pantalla) |
| U-05 | Captura AP totales digitados a mano | Error humano | Totales calculados desde líneas |
| U-06 | Bandeja sin deep-link rico al documento | Contexto pobre | Abrir object page + decisión |
| U-07 | Reportes = lista de links | No es centro de reportes | Parámetros + preview tabla |

### 2.5 Problemas de UX

| ID | Problema | Impacto |
|----|----------|---------|
| X-01 | Densidad de formularios 2-col sin secciones (Cabecera / Líneas / Fiscal / Contable) | Errores de captura |
| X-02 | Botones de acción sin confirmación / undo | Miedo a “Postear” |
| X-03 | Toasts genéricos (“simulado”) | No enseña estado real del documento |
| X-04 | Tablas sin filtros reales ni columnas configurables | Listas muertas |
| X-05 | Breadcrumbs mezclan inglés (AP) y español | Inconsistencia |
| X-06 | Mobile: sidebar ok, pero tablas min-width sin card-alternatives | Almacén/aprobador en celular |
| X-07 | Empty states / help contextual casi nulos | Onboarding cero |
| X-08 | No hay “modo solo lectura” post-posted | Riesgo editar mentalmente docs cerrados |

### 2.6 Problemas de productividad

| ID | Problema | Tiempo perdido típico |
|----|----------|----------------------|
| P-01 | Recaptura de líneas una por una (sin grid) | +2–5 min / documento |
| P-02 | Sin defaults inteligentes (términos del vendor, tax del item) | +30–60 s / doc |
| P-03 | Sin favoritos / recientes (SI Professional) | Navegación repetida |
| P-04 | Sin teclado: Enter/Tab flow / shortcuts Fiori-like | Contadores power users |
| P-05 | Sin bulk actions en listas (pagar selección, aprobar lote) | CxP/CFO |
| P-06 | Match y conciliación sin sugerencias | Horas de cierre |

---

## 3. Lista priorizada de mejoras

Escala: **P0** = bloquearía adopción interna de la demo / Freeze · **P1** = siguiente sprint de preview · **P2** = polish · **P3** = Professional+.

### P0 — Hacer la demo creíble para operación diaria

| # | Mejora | Roles que la piden | Esfuerzo UI (preview) |
|---|--------|--------------------|------------------------|
| 1 | **i18n de labels**: español de negocio + hint técnico | Todos | Bajo |
| 2 | **Role switcher demo** (7 perfiles) + menú filtrado | Todos | Medio |
| 3 | **Line grid** en PR, OC, AP, SO, Journal (add/remove, subtotales auto) | Contador, Comprador, Vendedor | Medio-Alto |
| 4 | **Object page tabs**: Datos · Líneas · Workflow · Documentos · Auditoría | Comprador, Contador | Medio |
| 5 | **Panel 3-way match** en detalle factura AP | Contador, CFO | Medio |
| 6 | **OC open quantities + Crear OC desde PR** | Comprador, Almacén | Medio |
| 7 | **Credit check stub** en SO + ficha cliente | Vendedor, CFO | Bajo-Medio |
| 8 | **Existencias ATP** (on hand / reserved / available) + tile Recepción en Inventarios | Almacén, Vendedor | Medio |
| 9 | **Company switcher** en topbar | DG, CFO | Bajo |
| 10 | Dashboard **por rol** (DG/CFO vs Operación) | DG, CFO | Medio |

### P1 — Controles financieros y cierre (Control Pack XR en UI)

| # | Mejora | Roles |
|---|--------|-------|
| 11 | Retenciones + payment_block en AP | Contador, CFO |
| 12 | Dual control visual en órdenes de pago | CFO |
| 13 | Account assignment / cost center en líneas P2P | Contador, Comprador |
| 14 | Aging con buckets reales y drill a factura | CFO, Contador |
| 15 | EEFF/Balanza con números demo creíbles (no stub vacío) | Contador, CFO |
| 16 | Folios humanos + created_by/posted_at en headers | Todos |
| 17 | Bandeja: deep link + comentario + monto vs política | DG, CFO, Comprador |
| 18 | Glosario de estados (chip ES + código) | Todos |

### P2 — Productividad y claridad

| # | Mejora | Roles |
|---|--------|-------|
| 19 | Defaults de vendor/customer (términos, moneda, tax) | Comprador, Contador, Vendedor |
| 20 | Favoritos / recientes | Todos |
| 21 | Filtros de lista funcionales (status, fechas, texto) | Todos |
| 22 | Confirmación modal en Post/Approve/Reject | Contador, Tesorería |
| 23 | Agrupar sección Fiscal MX | Contador, Facturación |
| 24 | Recibir en Inventarios (alias) + modo “piso” simplificado | Almacén |
| 25 | Journey strip O2C y P2P en hubs | Vendedor, Comprador |
| 26 | Unificar portable ↔ multi-page (generar portable desde fuente única) | ADM |

### P3 — Diferir o recortar en preview MVP

| # | Acción | Motivo |
|---|--------|--------|
| 27 | Marcar Nómina/Proyectos/Activos como **“Professional — stub”** o esconderlos del menú default | Evita falsa expectativa RRHH/DG |
| 28 | No pintar SoD matrix / impersonación | XR: prematuro |
| 29 | Portal proveedor/cliente | OUT MVP |
| 30 | WMS bins / manufactura | OUT spine financiero |

---

## 4. Matriz rol × top 3 dolores

| Rol | Dolor 1 | Dolor 2 | Dolor 3 |
|-----|---------|---------|---------|
| Director General | Menú sin filtro de rol | Dashboard poco ejecutivo | Bandeja sin contexto de negocio |
| CFO | Control Pack ausente en UI | Aging/EEFF stubs | Facturación/CxC/Ventas desconectados |
| Contador | Form AP/GL sin líneas-grid | Totales manuales | Sin match 3-way visual |
| Comprador | Sin OC-from-PR | Detalle OC sin open qty | Labels técnicos |
| Vendedor | Sin crédito/ATP | Facturar fuera del journey | Sin price list usable |
| Almacén | Recepción escondida en Compras | Existencias sin available | UI no “piso” |
| RRHH | Nómina/empleados incompletos | Sin RFC/CURP/NSS | Ausencias sin saldo |

---

## 5. Quick wins recomendados (orden de implementación en el kit)

1. Diccionario de labels ES en `shell.js` / helper `L('vendor_id')`.  
2. `session.role` + filtro NAV (7 perfiles en login).  
3. Componente reutilizable `LinesTable` (preview JS).  
4. Tabs en `detalle-oc`, `detalle-factura-ap`, `detalle-pedido`.  
5. Match strip PO/GR/Invoice en AP detail.  
6. KPIs ATP + credit stub.  
7. Badge “Stub Professional” en Nómina/Proyectos/Activos.

---

## 6. Criterio de “demo lista para stakeholders”

La preview se considera **lista para walkthrough con DG+CFO** cuando:

- [ ] Labels en español de negocio  
- [ ] Switch de rol (mín. CFO, Contador, Comprador, Vendedor, Almacén)  
- [ ] Al menos un documento completo con **N líneas** y totales calculados (OC + Factura AP + SO)  
- [ ] Object page con tabs WF/Docs  
- [ ] CxP muestra match 3-way  
- [ ] SO bloquea/simula crédito insuficiente  
- [ ] Existencias muestran available  
- [ ] Menú MVP no mezcla stubs Professional sin aviso  

---

## 7. Relación con documentos previos

| Doc | Relación |
|------|----------|
| ERP-SI-001 | Cobertura de pantallas: **suficiente** para MVP; problema es presentación, no inventario |
| ERP-FM-001 | Preview es fiel a FM (por eso se ven IDs); UX debe **traducir** FM, no copiar nombres de columna |
| ERP-XR-001 | Hallazgos F-04…F-08 reafirman Control Pack; UI actual **aún no lo incorpora** (correcto hasta Freeze; incorrecto si se vende como ERP completo) |

---

## 8. Firmas de revisión (roles simulados)

| Rol | Conclusión en una frase |
|-----|-------------------------|
| Director General | “Entiendo el mapa, pero no dirigiría la empresa desde este home.” |
| CFO | “Hay CxP/CxC/Facturación; faltan controles para confiar en el número.” |
| Contador | “No puedo cerrar el mes con formularios de una sola línea.” |
| Comprador | “El ciclo PR-OC-GR está; me faltan cantidades abiertas y un clic a OC.” |
| Vendedor | “Vendo a ciegas: sin stock ni crédito.” |
| Encargado de Almacén | “La recepción no está en mi casa (Inventarios).” |
| RRHH | “Esto aún no es RRHH; es un placeholder.” |

---

*Fin ERP-UX-001*
