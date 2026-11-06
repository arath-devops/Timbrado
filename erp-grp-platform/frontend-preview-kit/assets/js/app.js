(function () {
  const $ = (sel, el = document) => el.querySelector(sel);

  function renderNav() {
    const root = $('#nav-root');
    if (!root) return;
    const hash = location.hash || '#/dashboard';
    root.innerHTML = ERP.nav.map((sec) => `
      <div class="nav-section-title">${sec.section}</div>
      ${sec.items.map((item) => {
        if (item.children) {
          const open = item.children.some((c) => hash.startsWith(c.href)) || hash.includes(`/${item.id}`);
          return `
            <a class="nav-item ${open ? 'expanded active' : ''}" href="${item.children[0].href}" data-parent="${item.id}">
              <span class="nav-ico">${item.icon}</span><span class="nav-label">${item.label}</span>
            </a>
            <div class="nav-sub ${open ? 'open' : ''}">
              ${item.children.map((c) => `
                <a class="nav-item ${hash.startsWith(c.href) ? 'active' : ''}" href="${c.href}">
                  <span class="nav-label">${c.label}</span>
                  ${c.badge ? `<span class="nav-badge">${c.badge}</span>` : ''}
                </a>`).join('')}
            </div>`;
        }
        return `<a class="nav-item ${hash.startsWith(item.href) ? 'active' : ''}" href="${item.href}">
          <span class="nav-ico">${item.icon}</span><span class="nav-label">${item.label}</span>
        </a>`;
      }).join('')}`).join('');
  }

  function renderHeaderChrome() {
    const u = ERP.session.user;
    $('#user-name') && ($('#user-name').textContent = u.name.split(' ').slice(0, 2).join(' '));
    $('#user-role') && ($('#user-role').textContent = u.role);
    $('#user-avatar') && ($('#user-avatar').textContent = u.short);
    const n = ERP.session.notifications.filter((x) => x.critical).length;
    const btn = $('#btn-notif');
    if (btn) btn.classList.toggle('notif-dot', n > 0);
  }

  function route() {
    let path = (location.hash || '#/dashboard').replace(/^#/, '');
    if (!path.startsWith('/')) path = '/' + path;
    const parts = path.split('/').filter(Boolean);
    let html = '';

    const match = (a, b) => a === b;

    if (match(parts[0], 'dashboard') || parts.length === 0) html = ERPViews.dashboard();
    else if (parts[0] === 'mapa') html = ERPViews.sitemap();
    else if (parts[0] === 'escenarios') {
      if (!parts[1]) html = ERPViews.scenariosHome();
      else if (parts[1] === 'crear-solicitud') html = ERPViews.scenarioStep('Caso 1 · Crear Solicitud', [
        { t: 'Abrir Nueva Solicitud', d: 'Compras → Nueva solicitud', href: '#/compras/solicitudes/nueva' },
        { t: 'Completar formulario', d: 'Título, tipo, partida, justificación y líneas' },
        { t: 'Adjuntar cotización', d: 'Evidencia DOC_TYPE=COT', href: '#/documentos/subir/EXP-COMP-0148' },
        { t: 'Enviar a aprobación', d: 'Genera WorkflowStarted y tarea en bandeja' }
      ], '#/compras/solicitudes/nueva', 'Ir al formulario');
      else if (parts[1] === 'aprobar') html = ERPViews.scenarioStep('Caso 2 · Aprobar Solicitud', [
        { t: 'Entrar a bandeja', d: 'Workflow → Bandeja de entrada', href: '#/workflow/bandeja' },
        { t: 'Abrir T-8841', d: 'SC-2026-0148 pendiente DIR_ADMIN', href: '#/workflow/tarea/T-8841' },
        { t: 'Revisar expediente y montos', d: 'Lateral timeline + vínculo a SC' },
        { t: 'CompleteTask APPROVE', d: 'Comentario obligatorio · evento WorkflowApproved' }
      ], '#/workflow/tarea/T-8841', 'Abrir tarea');
      else if (parts[1] === 'commit') html = ERPViews.scenarioStep('Caso 3 · Commit Budget', [
        { t: 'Verificar disponibilidad', d: 'Presupuesto → Disponibilidad', href: '#/presupuesto/disponibilidad' },
        { t: 'Ejecutar CommitBudget', d: 'Operación idempotente', href: '#/compras/commit/SC-2026-0148' },
        { t: 'Registrar compromiso', d: 'CP + movimiento presupuestal', href: '#/presupuesto/compromisos' },
        { t: 'Continuar a OC', d: 'Habilita orden de compra', href: '#/compras/ordenes/OC-NUEVA' }
      ], '#/compras/commit/SC-2026-0148', 'Ir a Commit');
      else if (parts[1] === 'evidencia') html = ERPViews.scenarioStep('Caso 4 · Subir Evidencia', [
        { t: 'Abrir expediente', d: 'EXP-COMP-0148', href: '#/documentos/expedientes/EXP-COMP-0148' },
        { t: 'Subir archivo', d: 'PDF/XML ≤ 20MB', href: '#/documentos/subir/EXP-COMP-0148' },
        { t: 'Revisar en visor', d: 'Metadatos + versiones', href: '#/documentos/visor/DOC-9912' }
      ], '#/documentos/subir/EXP-COMP-0148', 'Subir evidencia');
      else if (parts[1] === 'auditoria') html = ERPViews.scenarioStep('Caso 5 · Consultar Auditoría', [
        { t: 'Trazabilidad de la SC', d: 'Cadena de custodia', href: '#/auditoria/trazabilidad/SC-2026-0148' },
        { t: 'Abrir evento AUD', d: 'Diff antes / después', href: '#/auditoria/detalle/AUD-6995' },
        { t: 'Filtrar por usuario', d: 'Bitácora por actor', href: '#/auditoria/usuario' }
      ], '#/auditoria/trazabilidad/SC-2026-0148', 'Ver trazabilidad');
      else html = ERPViews.scenariosHome();
    } else if (parts[0] === 'org') {
      if (parts[1] === 'dependencias') html = ERPViews.orgList('Dependencias', 'Dependencia');
      else if (parts[1] === 'direcciones') html = ERPViews.orgList('Direcciones', 'Dirección');
      else if (parts[1] === 'coordinaciones') html = ERPViews.orgList('Coordinaciones', 'Coordinación');
      else if (parts[1] === 'departamentos') html = ERPViews.orgList('Departamentos', 'Departamento');
      else if (parts[1] === 'puestos') html = ERPViews.positions();
      else if (parts[1] === 'funcionarios' && parts[2]) html = ERPViews.officialDetail(parts[2]);
      else if (parts[1] === 'funcionarios') html = ERPViews.officials();
      else if (parts[1] === 'detalle') html = ERPViews.orgDetail(parts[2]);
      else if (parts[1] === 'form') html = ERPViews.orgForm(decodeURIComponent(parts[2] || 'Dependencia'));
      else html = ERPViews.orgList('Dependencias', 'Dependencia');
    } else if (parts[0] === 'iam') {
      if (parts[1] === 'usuarios' && parts[2] === 'nuevo') html = ERPViews.iamUserDetail('USR-0003');
      else if (parts[1] === 'usuarios' && parts[2]) html = ERPViews.iamUserDetail(parts[2]);
      else if (parts[1] === 'usuarios') html = ERPViews.iamUsers();
      else if (parts[1] === 'roles' && parts[2]) html = ERPViews.iamRoleDetail(parts[2]);
      else if (parts[1] === 'roles') html = ERPViews.iamRoles();
      else if (parts[1] === 'permisos') html = ERPViews.iamPerms();
      else if (parts[1] === 'organizaciones') html = ERPViews.iamOrgs();
      else if (parts[1] === 'perfil') html = ERPViews.iamProfile();
      else html = ERPViews.iamUsers();
    } else if (parts[0] === 'catalogos') {
      if (parts[1] === 'partidas') html = ERPViews.catalogTable('Partidas presupuestales', ERP.catalogs.BUDGET_LINE, {
        headers: ['Código', 'Nombre', 'Disponible', 'Comprometido', 'Ejercido'],
        row: (l) => `<tr><td><strong>${l.code}</strong></td><td>${l.name}</td><td>${ERPUI.money(l.available)}</td><td>${ERPUI.money(l.committed)}</td><td>${ERPUI.money(l.spent)}</td></tr>`
      });
      else if (parts[1] === 'documentos') html = ERPViews.catalogTable('Tipos de documento', ERP.catalogs.DOC_TYPE, {
        headers: ['Código', 'Nombre', 'Activo'],
        row: (l) => `<tr><td>${l.code}</td><td>${l.name}</td><td>${ERPUI.statusBadge(l.active ? 'Activa' : 'Inactiva')}</td></tr>`
      });
      else if (parts[1] === 'solicitudes') html = ERPViews.catalogTable('Tipos de solicitud', ERP.catalogs.REQUEST_TYPE, {
        headers: ['Código', 'Nombre', 'Activo'],
        row: (l) => `<tr><td>${l.code}</td><td>${l.name}</td><td>${ERPUI.statusBadge(l.active ? 'Activa' : 'Inactiva')}</td></tr>`
      });
      else if (parts[1] === 'estados') html = ERPViews.catalogTable('Estados P2P', ERP.catalogs.STATUS, {
        headers: ['Código', 'Nombre'],
        row: (l) => `<tr><td>${l.code}</td><td>${ERPUI.statusBadge(l.code)}</td></tr>`
      });
      else html = ERPViews.catalogsHome();
    } else if (parts[0] === 'workflow') {
      if (parts[1] === 'tarea') html = ERPViews.wfTask(parts[2]);
      else if (parts[1] === 'pendientes') html = ERPViews.wfList('Pendientes', (t) => t.status === 'OPEN');
      else if (parts[1] === 'aprobados') html = ERPViews.wfList('Aprobados', (t) => t.status === 'APPROVED');
      else if (parts[1] === 'rechazados') html = ERPViews.wfList('Rechazados', (t) => t.status === 'REJECTED');
      else if (parts[1] === 'historial') html = ERPViews.wfList('Historial', () => true);
      else html = ERPViews.wfList('Bandeja de entrada', (t) => t.status === 'OPEN' && t.assignee.includes('Mariana'));
    } else if (parts[0] === 'documentos') {
      if (parts[1] === 'expedientes' && parts[2]) html = ERPViews.docExpediente(parts[2]);
      else if (parts[1] === 'expedientes') html = ERPViews.docExpedientes();
      else if (parts[1] === 'visor') html = ERPViews.docViewer(parts[2]);
      else if (parts[1] === 'subir') html = ERPViews.docUpload(parts[2] || 'EXP-COMP-0148');
      else html = ERPViews.docList();
    } else if (parts[0] === 'presupuesto') {
      if (parts[1] === 'partidas') html = ERPViews.budgetPartidas();
      else if (parts[1] === 'disponibilidad') html = ERPViews.budgetDisponibilidad();
      else if (parts[1] === 'reservas') html = ERPViews.budgetReservas();
      else if (parts[1] === 'compromisos') html = ERPViews.budgetCompromisos();
      else if (parts[1] === 'movimientos') html = ERPViews.budgetMovimientos();
      else html = ERPViews.budgetHome();
    } else if (parts[0] === 'compras') {
      if (parts[1] === 'solicitudes' && parts[2] === 'nueva') html = ERPViews.scNew();
      else if (parts[1] === 'solicitudes' && parts[2]) html = ERPViews.scDetail(parts[2]);
      else if (parts[1] === 'solicitudes') html = ERPViews.scList();
      else if (parts[1] === 'aprobacion') html = ERPViews.scApproval(parts[2]);
      else if (parts[1] === 'commit') html = ERPViews.scCommit(parts[2]);
      else if (parts[1] === 'ordenes' && parts[2]) html = ERPViews.poDetail(parts[2]);
      else if (parts[1] === 'ordenes') html = ERPViews.poList();
      else if (parts[1] === 'recepciones') html = ERPViews.receipts();
      else if (parts[1] === 'pagos') html = ERPViews.payments();
      else html = ERPViews.scList();
    } else if (parts[0] === 'auditoria') {
      if (parts[1] === 'detalle') html = ERPViews.auditDetail(parts[2]);
      else if (parts[1] === 'usuario') html = ERPViews.auditList('Auditoría por usuario', (a) => a.user === 'mrios' || a.user === 'abeltran');
      else if (parts[1] === 'documento') html = ERPViews.auditList('Auditoría por documento', (a) => a.entity.includes('Document') || a.action === 'READ');
      else if (parts[1] === 'compra') html = ERPViews.auditList('Auditoría por compra', (a) => a.entity.includes('Purchase') || a.action === 'COMMIT_BUDGET');
      else if (parts[1] === 'trazabilidad') html = ERPViews.auditTrace(parts[2] || 'SC-2026-0148');
      else html = ERPViews.auditList();
    } else if (parts[0] === 'notificaciones') html = ERPViews.notifications();
    else html = `<div class="panel"><div class="panel-bd">${ERPUI.empty('Ruta no encontrada en el preview kit.')}<p style="text-align:center"><a href="#/dashboard">Volver al dashboard</a></p></div></div>`;

    const main = $('#main-view');
    if (main) {
      main.classList.remove('fade-in');
      void main.offsetWidth;
      main.innerHTML = html;
      main.classList.add('fade-in');
    }
    renderNav();
    document.title = 'ERP+GRP Preview · Municipio de Ejemplo';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ERPViews.sitemap = () => `
    ${ERPUI.crumbs([{ label: 'Mapa del sistema' }])}
    ${ERPUI.pageHeader('Sitemap & árbol de navegación', 'Entregable 1 · mapa completo del Preview Kit.', `
      <a class="btn btn-secondary btn-sm" href="docs/01-SITEMAP.md" target="_blank">Abrir MD</a>
    `)}
    <div class="panel-grid">
      ${ERP.nav.map((sec) => `
        <div class="panel"><div class="panel-hd"><h3>${sec.section}</h3></div><div class="panel-bd">
          <ul style="margin:0;padding-left:18px;line-height:1.7;font-size:13.5px">
            ${sec.items.map((it) => it.children
              ? `<li><strong>${it.label}</strong><ul>${it.children.map((c) => `<li><a href="${c.href}">${c.label}</a></li>`).join('')}</ul></li>`
              : `<li><a href="${it.href}">${it.label}</a></li>`).join('')}
          </ul>
        </div></div>`).join('')}
    </div>
    <div class="panel" style="margin-top:14px"><div class="panel-hd"><h3>Flujo de navegación principal (P2P)</h3></div>
    <div class="panel-bd"><div class="timeline">
      <div class="tl-item done"><div class="tl-dot"></div><h4>Login</h4><p>index.html → sesión Director</p></div>
      <div class="tl-item done"><div class="tl-dot"></div><h4>Dashboard</h4><p>KPIs + alertas + atajos</p></div>
      <div class="tl-item done"><div class="tl-dot"></div><h4>Nueva SC</h4><p>Compras / formularios</p></div>
      <div class="tl-item done"><div class="tl-dot"></div><h4>Workflow bandeja</h4><p>Aprobación</p></div>
      <div class="tl-item done"><div class="tl-dot"></div><h4>Commit Budget</h4><p>Presupuesto</p></div>
      <div class="tl-item done"><div class="tl-dot"></div><h4>OC → Recepción → Pago</h4><p>P2P</p></div>
      <div class="tl-item done"><div class="tl-dot"></div><h4>Evidencia + Auditoría</h4><p>EDM + bitácora</p></div>
    </div></div></div>`;

  function bindChrome() {
    $('#btn-sidebar')?.addEventListener('click', () => {
      const shell = $('#app-shell');
      if (window.matchMedia('(max-width: 960px)').matches) shell.classList.toggle('mobile-nav-open');
      else shell.classList.toggle('sidebar-collapsed');
    });
    $('#btn-theme')?.addEventListener('click', () => ERPTheme.toggle());
    $('#btn-notif')?.addEventListener('click', () => { location.hash = '#/notificaciones'; });
    $('#btn-profile')?.addEventListener('click', () => { location.hash = '#/iam/perfil'; });
    $('#global-search')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = e.target.value.toLowerCase();
        if (q.includes('sc-') || q.includes('solicitud')) location.hash = '#/compras/solicitudes';
        else if (q.includes('tarea') || q.includes('workflow')) location.hash = '#/workflow/bandeja';
        else if (q.includes('doc') || q.includes('exp')) location.hash = '#/documentos/expedientes';
        else ERPUI.toast('Búsqueda demo: pruebe “SC-”, “workflow” o “exp”');
      }
    });
    document.addEventListener('contextmenu', (e) => {
      const row = e.target.closest('tr.clickable, .nav-item');
      if (!row) return;
      e.preventDefault();
      const menu = $('#context-menu');
      menu.style.left = e.clientX + 'px';
      menu.style.top = e.clientY + 'px';
      menu.classList.add('open');
    });
    document.addEventListener('click', () => $('#context-menu')?.classList.remove('open'));
  }

  window.ERPApp = {
    filterTable(q) {
      q = (q || '').toLowerCase();
      document.querySelectorAll('table.data tbody tr').forEach((tr) => {
        tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    },
    init() {
      if (!sessionStorage.getItem('erp-preview-auth')) {
        location.href = 'index.html';
        return;
      }
      ERPTheme.init();
      renderHeaderChrome();
      bindChrome();
      route();
      window.addEventListener('hashchange', route);
    }
  };

  document.addEventListener('DOMContentLoaded', () => ERPApp.init());
})();
