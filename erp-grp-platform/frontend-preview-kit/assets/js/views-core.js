window.ERPViews = window.ERPViews || {};

ERPViews.dashboard = () => {
  const d = ERP.dashboard;
  const kpis = d.kpis.map((k) => `
    <div class="kpi">
      <div class="label">${k.label}</div>
      <div class="value">${k.value}</div>
      <div class="delta ${k.tone}">${k.delta}</div>
    </div>`).join('');
  const bars = d.budgetConsumption.map((b) => `
    <div class="bar"><i style="height:${b.pct}%"></i><span>${b.name}</span></div>`).join('');
  const ou = d.purchasesByOu.map((x) => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px">
        <strong>${x.name}</strong><span>${ERPUI.money(x.amount * 1e6)}</span>
      </div>
      <div class="progress"><span style="width:${x.pct}%"></span></div>
    </div>`).join('');
  return `
    ${ERPUI.crumbs([{ label: 'Inicio', href: '#/dashboard' }, { label: 'Dashboard ejecutivo' }])}
    ${ERPUI.pageHeader('Dashboard ejecutivo', 'Municipio de Ejemplo · Vista del Director de Administración · Ejercicio 2026', `
      <button class="btn btn-secondary btn-sm" onclick="location.hash='#/escenarios'">Escenarios demo</button>
      <button class="btn btn-primary btn-sm" onclick="location.hash='#/compras/solicitudes/nueva'">Nueva solicitud</button>
    `)}
    <div class="scenario-strip">
      <a href="#/escenarios/crear-solicitud">Caso 1 · Crear SC</a>
      <a href="#/escenarios/aprobar">Caso 2 · Aprobar</a>
      <a href="#/escenarios/commit">Caso 3 · Commit budget</a>
      <a href="#/escenarios/evidencia">Caso 4 · Evidencia</a>
      <a href="#/escenarios/auditoria">Caso 5 · Auditoría</a>
    </div>
    <div class="kpi-grid">${kpis}</div>
    <div class="panel-grid" style="margin-bottom:14px">
      <div class="panel">
        <div class="panel-hd"><h3>Consumo presupuestal 2026</h3><span class="chip">Acumulado</span></div>
        <div class="panel-bd"><div class="bar-chart">${bars}</div></div>
      </div>
      <div class="panel">
        <div class="panel-hd"><h3>Compras por dependencia</h3></div>
        <div class="panel-bd">${ou}</div>
      </div>
    </div>
    <div class="panel-grid triple">
      <div class="panel">
        <div class="panel-hd"><h3>Alertas críticas</h3></div>
        <div class="panel-bd" style="display:grid;gap:8px">
          ${d.alerts.map((a) => `<div class="alert ${a.level}">${a.text}</div>`).join('')}
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd"><h3>Últimas aprobaciones</h3></div>
        <div class="panel-bd">
          ${d.approvals.map((a) => `<div class="list-row">
            <div style="flex:1"><strong>${a.id}</strong><div style="font-size:12px;color:var(--ink-3)">${a.who} · ${a.action}</div></div>
            <div style="text-align:right"><div>${a.amount}</div><div style="font-size:11px;color:var(--ink-3)">${a.when}</div></div>
          </div>`).join('')}
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd"><h3>Actividad reciente</h3></div>
        <div class="panel-bd">
          ${d.activity.map((a) => `<div class="list-row"><div style="flex:1;font-size:13px">${a.text}</div><time style="font-size:11px;color:var(--ink-3)">${a.when}</time></div>`).join('')}
        </div>
      </div>
    </div>`;
};

ERPViews.orgList = (typeLabel, typeFilter) => {
  const rows = ERPUI.orgFiltered(typeFilter);
  return `
    ${ERPUI.crumbs([{ label: 'Organización', href: '#/org/dependencias' }, { label: typeLabel }])}
    ${ERPUI.pageHeader(typeLabel, 'Estructura orgánica del Municipio de Ejemplo — padrón vigente 2026.', `
      <button class="btn btn-secondary btn-sm" onclick="ERPUI.toast('Exportación simulada (CSV)')">Exportar</button>
      <button class="btn btn-primary btn-sm" onclick="location.hash='#/org/form/${encodeURIComponent(typeFilter)}'">Alta</button>
    `)}
    <div class="toolbar">
      <div class="field" style="min-width:220px"><input class="control" placeholder="Buscar por nombre o código…" oninput="ERPApp.filterTable(this.value)"></div>
      <span class="badge badge-neutral">${rows.length} registros</span>
      <div class="spacer"></div>
      <button class="btn btn-ghost btn-sm">Filtros</button>
    </div>
    ${ERPUI.table(['Código', 'Nombre', 'Tipo', 'Padre', 'Titular', 'Planta', 'Estado', ''],
      rows.map((r) => `<tr class="clickable" onclick="location.hash='#/org/detalle/${r.id}'">
        <td><strong>${r.code}</strong></td><td>${r.name}</td><td>${r.type}</td><td>${r.parent}</td>
        <td>${r.head}</td><td>${r.people}</td><td>${ERPUI.statusBadge(r.status)}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();location.hash='#/org/form/${r.id}'">Editar</button></td>
      </tr>`).join('') || `<tr><td colspan="8">${ERPUI.empty('Sin registros')}</td></tr>`
    )}
    <div style="margin-top:14px">${ERPUI.historyPanel(typeLabel)}</div>`;
};

ERPViews.orgDetail = (id) => {
  const r = ERP.orgUnits.find((x) => x.id === id) || ERP.orgUnits[0];
  return `
    ${ERPUI.crumbs([{ label: 'Organización', href: '#/org/dependencias' }, { label: r.name }])}
    ${ERPUI.pageHeader(r.name, `${r.type} · ${r.code}`, `
      <button class="btn btn-secondary btn-sm" onclick="location.hash='#/org/form/${r.id}'">Editar</button>
      <button class="btn btn-ghost btn-sm" onclick="history.back()">Volver</button>
    `)}
    <div class="split">
      <div class="panel"><div class="panel-hd"><h3>Consulta</h3></div><div class="panel-bd">
        <div class="form-grid">
          <div class="field"><label>Código</label><div>${r.code}</div></div>
          <div class="field"><label>Estado</label><div>${ERPUI.statusBadge(r.status)}</div></div>
          <div class="field full"><label>Nombre</label><div>${r.name}</div></div>
          <div class="field"><label>Tipo</label><div>${r.type}</div></div>
          <div class="field"><label>Unidad padre</label><div>${r.parent}</div></div>
          <div class="field"><label>Titular</label><div>${r.head}</div></div>
          <div class="field"><label>Planta</label><div>${r.people} personas</div></div>
        </div>
      </div></div>
      ${ERPUI.historyPanel(r.id)}
    </div>`;
};

ERPViews.orgForm = (idOrType) => {
  const existing = ERP.orgUnits.find((x) => x.id === idOrType);
  const title = existing ? `Editar · ${existing.name}` : `Alta · ${idOrType}`;
  return `
    ${ERPUI.crumbs([{ label: 'Organización', href: '#/org/dependencias' }, { label: title }])}
    ${ERPUI.pageHeader(title, 'Formulario de mantenimiento estructural. Campos marcados son obligatorios.', `
      <button class="btn btn-secondary btn-sm" onclick="history.back()">Cancelar</button>
      <button class="btn btn-primary btn-sm" onclick="ERPUI.toast('Guardado simulado (preview)');history.back()">Guardar</button>
    `)}
    <div class="panel"><div class="panel-bd"><div class="form-grid">
      <div class="field"><label>Código *</label><input class="control" value="${existing?.code || ''}" placeholder="EJ. OBP"><span class="hint">Único en el tenant</span></div>
      <div class="field"><label>Tipo *</label>
        <select class="control">
          ${['Dependencia', 'Dirección', 'Coordinación', 'Departamento'].map((t) =>
            `<option ${((existing?.type || idOrType) === t) ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="field full"><label>Nombre *</label><input class="control" value="${existing?.name || ''}"></div>
      <div class="field"><label>Unidad padre *</label>
        <select class="control"><option>Municipio</option>${ERP.orgUnits.map((o) => `<option ${existing?.parent === o.name ? 'selected' : ''}>${o.name}</option>`).join('')}</select>
      </div>
      <div class="field"><label>Titular</label><input class="control" value="${existing?.head || ''}"></div>
      <div class="field"><label>Estado</label><select class="control"><option>Activa</option><option>Inactiva</option></select></div>
      <div class="field full"><label>Descripción / objeto</label><textarea class="control" placeholder="Objeto administrativo según reglamento interior…"></textarea></div>
    </div></div></div>`;
};

ERPViews.positions = () => `
  ${ERPUI.crumbs([{ label: 'Organización' }, { label: 'Puestos' }])}
  ${ERPUI.pageHeader('Puestos', 'Catálogo de puestos vinculados a la estructura orgánica.', `<button class="btn btn-primary btn-sm" onclick="ERPUI.toast('Alta de puesto (simulado)')">Alta</button>`)}
  ${ERPUI.table(['ID', 'Puesto', 'Unidad', 'Nivel', 'Ocupado'],
    ERP.positions.map((p) => `<tr><td>${p.id}</td><td><strong>${p.name}</strong></td><td>${p.ou}</td><td>${p.level}</td><td>${ERPUI.statusBadge(p.occupied ? 'Activo' : 'Vacante')}</td></tr>`).join(''))}
  <div style="margin-top:14px">${ERPUI.historyPanel('Puestos')}</div>`;

ERPViews.officials = () => `
  ${ERPUI.crumbs([{ label: 'Organización' }, { label: 'Funcionarios' }])}
  ${ERPUI.pageHeader('Funcionarios', 'Personas asignadas a puestos del Municipio de Ejemplo.', `<button class="btn btn-primary btn-sm">Alta</button>`)}
  ${ERPUI.table(['ID', 'Nombre', 'Puesto', 'Unidad', 'Correo', 'Estado', ''],
    ERP.officials.map((f) => `<tr class="clickable" onclick="location.hash='#/org/funcionarios/${f.id}'">
      <td>${f.id}</td><td><strong>${f.name}</strong></td><td>${f.position}</td><td>${f.ou}</td><td>${f.email}</td>
      <td>${ERPUI.statusBadge(f.status)}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();location.hash='#/org/funcionarios/${f.id}/editar'">Editar</button></td>
    </tr>`).join(''))}`;

ERPViews.officialDetail = (id) => {
  const f = ERP.officials.find((x) => x.id === id) || ERP.officials[0];
  return `
    ${ERPUI.crumbs([{ label: 'Funcionarios', href: '#/org/funcionarios' }, { label: f.name }])}
    ${ERPUI.pageHeader(f.name, f.position, `<button class="btn btn-secondary btn-sm">Editar</button>`)}
    <div class="split">
      <div class="panel"><div class="panel-bd" class="form-grid"><div class="form-grid">
        <div class="field"><label>Correo</label><div>${f.email}</div></div>
        <div class="field"><label>Estado</label><div>${ERPUI.statusBadge(f.status)}</div></div>
        <div class="field full"><label>Unidad</label><div>${f.ou}</div></div>
        <div class="field full"><label>Puesto</label><div>${f.position}</div></div>
      </div></div></div>
      ${ERPUI.historyPanel(f.id)}
    </div>`;
};

ERPViews.iamUsers = () => `
  ${ERPUI.crumbs([{ label: 'IAM' }, { label: 'Usuarios' }])}
  ${ERPUI.pageHeader('Usuarios', 'Administración de identidades del tenant municipal.', `
    <button class="btn btn-primary btn-sm" onclick="location.hash='#/iam/usuarios/nuevo'">Alta usuario</button>
  `)}
  ${ERPUI.table(['ID', 'Usuario', 'Nombre', 'Roles', 'OU', 'Estado', 'Último acceso', ''],
    ERP.users.map((u) => `<tr>
      <td>${u.id}</td><td><strong>${u.username}</strong></td><td>${u.name}</td><td><span class="chip">${u.roles}</span></td>
      <td>${u.ou}</td><td>${ERPUI.statusBadge(u.status)}</td><td>${u.lastLogin}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="location.hash='#/iam/usuarios/${u.id}'">Ver</button></td>
    </tr>`).join(''))}`;

ERPViews.iamUserDetail = (id) => {
  const u = ERP.users.find((x) => x.id === id) || ERP.users[0];
  return `
    ${ERPUI.crumbs([{ label: 'Usuarios', href: '#/iam/usuarios' }, { label: u.username }])}
    ${ERPUI.pageHeader(u.name, `Cuenta ${u.username} · ${u.id}`, `
      <button class="btn btn-danger btn-sm" onclick="ERPUI.toast('Lock simulado')">Bloquear</button>
      <button class="btn btn-primary btn-sm" onclick="ERPUI.toast('Roles actualizados (simulado)')">Guardar roles</button>
    `)}
    <div class="panel-grid">
      <div class="panel"><div class="panel-hd"><h3>Datos</h3></div><div class="panel-bd form-grid">
        <div class="field"><label>Estado</label><div>${ERPUI.statusBadge(u.status)}</div></div>
        <div class="field"><label>OU</label><div>${u.ou}</div></div>
        <div class="field full"><label>Roles asignados</label>
          <div style="display:flex;flex-wrap:gap:6px;gap:6px;flex-wrap:wrap">
            ${u.roles.split(',').map((r) => `<span class="badge badge-brand">${r.trim()}</span>`).join('')}
          </div>
        </div>
        <div class="field full"><label>Agregar rol</label>
          <select class="control">${ERP.roles.map((r) => `<option>${r.code} — ${r.name}</option>`).join('')}</select>
        </div>
      </div></div>
      <div class="panel"><div class="panel-hd"><h3>Organization Scope</h3></div><div class="panel-bd">
        <div class="field"><label>Tipo de alcance</label><select class="control"><option>OU_SUBTREE</option><option>OU_EXACT</option></select></div>
        <div class="field" style="margin-top:10px"><label>Unidad</label>
          <select class="control">${ERP.orgUnits.map((o) => `<option>${o.name}</option>`).join('')}</select>
        </div>
        <p class="hint" style="margin-top:12px">Claims JWT: <code>org_scopes</code>, <code>roles</code>, <code>tenant_id</code></p>
      </div></div>
    </div>`;
};

ERPViews.iamRoles = () => `
  ${ERPUI.crumbs([{ label: 'IAM' }, { label: 'Roles' }])}
  ${ERPUI.pageHeader('Roles', 'Catálogo de roles del piloto municipal (RBAC + OrgScope).')}
  ${ERPUI.table(['Código', 'Nombre', 'Permisos', 'Usuarios', ''],
    ERP.roles.map((r) => `<tr class="clickable" onclick="location.hash='#/iam/roles/${r.code}'">
      <td><strong>${r.code}</strong></td><td>${r.name}</td><td>${r.perms}</td><td>${r.users}</td>
      <td><button class="btn btn-ghost btn-sm">Asignar permisos</button></td></tr>`).join(''))}`;

ERPViews.iamRoleDetail = (code) => {
  const r = ERP.roles.find((x) => x.code === code) || ERP.roles[0];
  const perms = ERP.permissions;
  return `
    ${ERPUI.crumbs([{ label: 'Roles', href: '#/iam/roles' }, { label: r.code }])}
    ${ERPUI.pageHeader(r.name, `Código ${r.code} · asignación de permisos`)}
    <div class="panel"><div class="panel-hd"><h3>Matriz de permisos</h3><button class="btn btn-primary btn-sm" onclick="ERPUI.toast('Permisos guardados (simulado)')">Guardar</button></div>
    <div class="panel-bd">
      <div class="perm-matrix">
        <div class="hd">Permiso</div>
        <div class="hd">Crear</div><div class="hd">Leer</div><div class="hd">Actualizar</div><div class="hd">Eliminar</div><div class="hd">Aprobar</div>
        ${perms.slice(0, 8).map((p, i) => `
          <div><code>${p}</code></div>
          ${[0, 1, 2, 3, 4].map((c) => `<div><input type="checkbox" ${(i + c) % 3 !== 0 ? 'checked' : ''}></div>`).join('')}
        `).join('')}
      </div>
    </div></div>`;
};

ERPViews.iamPerms = () => `
  ${ERPUI.crumbs([{ label: 'IAM' }, { label: 'Permisos' }])}
  ${ERPUI.pageHeader('Permisos', 'Códigos canónicos expuestos a roles (sin motor ABAC en S1).')}
  <div class="panel"><div class="panel-bd" style="display:flex;flex-wrap:wrap;gap:8px">
    ${ERP.permissions.map((p) => `<span class="badge badge-neutral">${p}</span>`).join('')}
  </div></div>`;

ERPViews.iamOrgs = () => `
  ${ERPUI.crumbs([{ label: 'IAM' }, { label: 'Organizaciones' }])}
  ${ERPUI.pageHeader('Organizaciones (tenants)', 'Plano multi-tenant · piloto Shared DB + RLS.')}
  <div class="panel"><div class="panel-bd form-grid">
    <div class="field"><label>Tenant ID</label><div><code>ten_mun_ejemplo</code></div></div>
    <div class="field"><label>Nombre</label><div>Municipio de Ejemplo</div></div>
    <div class="field"><label>Modo</label><div><span class="badge badge-brand">Shared + RLS</span></div></div>
    <div class="field"><label>Plane dedicado</label><div>Reservado (ADR-013) — no activo en piloto</div></div>
    <div class="field full"><label>Módulos habilitados</label>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${['IAM', 'Catalog', 'Audit', 'Workflow', 'Documents', 'Budget', 'Procurement'].map((m) => `<span class="chip">${m}</span>`).join('')}
      </div>
    </div>
  </div></div>`;

ERPViews.iamProfile = () => {
  const s = ERP.session.user;
  return `
    ${ERPUI.crumbs([{ label: 'IAM' }, { label: 'Mi perfil' }])}
    ${ERPUI.pageHeader('Mi perfil', 'Sesión simulada del Director de Administración Municipal.')}
    <div class="split">
      <div class="panel"><div class="panel-bd">
        <div style="display:flex;gap:16px;align-items:center;margin-bottom:18px">
          <div class="avatar" style="width:56px;height:56px;font-size:18px">${s.short}</div>
          <div><strong style="font-size:18px">${s.name}</strong><div style="color:var(--ink-3)">${s.role}</div></div>
        </div>
        <div class="form-grid">
          <div class="field"><label>Correo</label><div>${s.email}</div></div>
          <div class="field"><label>Tenant</label><div>${s.tenant}</div></div>
          <div class="field"><label>OU</label><div>${s.orgUnit}</div></div>
          <div class="field"><label>Roles</label><div>${s.roles.map((r) => `<span class="badge badge-brand">${r}</span> `).join('')}</div></div>
        </div>
      </div></div>
      <div class="panel"><div class="panel-hd"><h3>Favoritos</h3></div><div class="panel-bd">
        ${ERP.session.favorites.map((f) => `<div class="list-row"><span class="fav-star">★</span><a href="${f.href}">${f.label}</a></div>`).join('')}
      </div></div>
    </div>`;
};

ERPViews.catalogsHome = () => `
  ${ERPUI.crumbs([{ label: 'Catálogos' }])}
  ${ERPUI.pageHeader('Catálogos generales', 'Datos maestros compartidos por los dominios MVP.')}
  <div class="panel-grid triple">
    ${[
      ['Partidas presupuestales', ERP.catalogs.BUDGET_LINE.length, '#/catalogos/partidas'],
      ['Tipos de documento', ERP.catalogs.DOC_TYPE.length, '#/catalogos/documentos'],
      ['Tipos de solicitud', ERP.catalogs.REQUEST_TYPE.length, '#/catalogos/solicitudes'],
      ['Estados P2P', ERP.catalogs.STATUS.length, '#/catalogos/estados'],
      ['Dependencias (ref)', ERP.orgUnits.length, '#/org/dependencias'],
      ['Roles IAM', ERP.roles.length, '#/iam/roles']
    ].map(([t, n, h]) => `<a class="panel" href="${h}"><div class="panel-bd"><div class="label" style="color:var(--ink-3);font-size:12px">Catálogo</div><h3 style="margin:6px 0">${t}</h3><div class="value" style="font-size:28px;font-weight:780">${n}</div></div></a>`).join('')}
  </div>`;

ERPViews.catalogTable = (title, rows, cols) => `
  ${ERPUI.crumbs([{ label: 'Catálogos', href: '#/catalogos' }, { label: title }])}
  ${ERPUI.pageHeader(title, 'Mantenimiento de catálogo · cambios auditados.', `<button class="btn btn-primary btn-sm" onclick="ERPUI.toast('Alta de catálogo (simulado)')">Alta</button>`)}
  ${ERPUI.table(cols.headers, rows.map(cols.row).join(''))}`;

ERPViews.notifications = () => `
  ${ERPUI.crumbs([{ label: 'Notificaciones' }])}
  ${ERPUI.pageHeader('Notificaciones', 'Centro de alertas de la sesión actual.')}
  <div class="panel"><div class="panel-bd">
    ${ERP.session.notifications.map((n) => `
      <a class="list-row" href="${n.href}">
        <div style="flex:1">
          <div style="display:flex;gap:8px;align-items:center">
            ${n.critical ? '<span class="badge badge-danger">Crítica</span>' : '<span class="badge badge-info">Info</span>'}
            <strong>${n.title}</strong>
          </div>
        </div>
        <span style="color:var(--ink-3);font-size:12px">${n.time}</span>
      </a>`).join('')}
  </div></div>`;
