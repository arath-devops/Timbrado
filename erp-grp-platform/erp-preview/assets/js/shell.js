(function () {
  const DEPTH = document.body.getAttribute('data-depth') || '..';
  const A = (p) => `${DEPTH}/${p}`.replace(/\/+/g, '/');

  /* nav keys map to role.nav filters */
  const NAV = [
    { sec: 'Inicio', items: [
      { key: 'dashboard', href: 'dashboard/index.html', label: 'Dashboard', ico: '▣' }
    ]},
    { sec: 'Operación', items: [
      { key: 'compras', href: 'compras/index.html', label: 'Compras', ico: '◇', match: ['compras','requisiciones','ordenes','recepcion','proveedores','detalle-oc','detalle-pr','nueva'] },
      { key: 'ventas', href: 'ventas/index.html', label: 'Ventas', ico: '▤', match: ['ventas','pedidos','entregas','detalle-pedido','nuevo-pedido'] },
      { key: 'inventarios', href: 'inventarios/index.html', label: 'Inventarios', ico: '▦', match: ['inventarios','articulos','existencias','movimientos','recepcion-inv'] }
    ]},
    { sec: 'Finanzas', items: [
      { key: 'contabilidad', href: 'finanzas/contabilidad.html', label: 'Contabilidad (GL)', ico: '◈', match: ['plan-cuentas','periodos','asientos','mayor','contabilidad'] },
      { key: 'cxp', href: 'finanzas/cxp.html', label: 'CxP · Cuentas por pagar', ico: '⇩', match: ['cxp','facturas-ap','captura-factura-ap','detalle-factura-ap','programacion-pagos','aging-ap'] },
      { key: 'facturacion', href: 'finanzas/facturacion.html', label: 'Facturación', ico: '▤', match: ['facturacion','emitir-factura'] },
      { key: 'cxc', href: 'finanzas/cxc.html', label: 'CxC · Cuentas por cobrar', ico: '⇧', match: ['cxc','facturas-ar','cobros','aging-ar','estado-cuenta'] },
      { key: 'tesoreria', href: 'finanzas/tesoreria.html', label: 'Tesorería', ico: '₩', match: ['tesoreria','bancos','ordenes-pago','conciliacion'] },
      { key: 'finanzas', href: 'finanzas/index.html', label: 'Finanzas (hub)', ico: '◇', match: ['finanzas/index'] },
      { key: 'activos', href: 'activos/index.html', label: 'Activos', ico: '▣', stub: true }
    ]},
    { sec: 'Personas', items: [
      { key: 'rh', href: 'rh/index.html', label: 'RRHH', ico: '♟' },
      { key: 'nomina', href: 'nomina/index.html', label: 'Nómina', ico: '₮', stub: true }
    ]},
    { sec: 'Plataforma', items: [
      { key: 'bandeja', href: 'administracion/bandeja.html', label: 'Bandeja aprobación', ico: '⟳', badge: 3 },
      { key: 'admin', href: 'administracion/index.html', label: 'Administración', ico: '⬡', match: ['administracion'] },
      { key: 'reportes', href: 'reportes/index.html', label: 'Reportes', ico: '▥' }
    ]}
  ];

  function pathMatch(it) {
    const loc = location.pathname.replace(/\\/g, '/');
    const leaf = it.href.split('/').slice(-2).join('/');
    if (loc.endsWith(it.href) || loc.includes('/' + leaf)) return true;
    return (it.match || []).some((k) => loc.includes('/' + k) || loc.endsWith(k + '.html'));
  }

  function filteredNav(session) {
    const allow = new Set(session.nav || []);
    // always allow admin if ADM-like; DG/CFO get finanzas keys already
    return NAV.map((sec) => ({
      sec: sec.sec,
      items: sec.items.filter((it) => allow.has(it.key) || (it.key === 'proveedores' && allow.has('compras')))
    })).filter((sec) => sec.items.length);
  }

  function injectShell() {
    if (!sessionStorage.getItem('erp-demo-auth') && !document.body.dataset.public) {
      location.href = A('index.html');
      return;
    }
    const s = ERPDemo.restoreSession();
    const app = document.getElementById('app');
    if (!app) return;

    const nav = filteredNav(s);
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
      <div class="brand">
        <div class="brand-mark">ERP</div>
        <div class="brand-text">ACME Industrial<span>Preview · P0 UX</span></div>
      </div>
      <nav class="nav">${nav.map((sec) => `
        <div class="nav-sec">${sec.sec}</div>
        ${sec.items.map((it) => `
          <a class="${pathMatch(it) ? 'active' : ''}" href="${A(it.href)}">
            <span class="ico">${it.ico}</span><span class="nav-label">${it.label}${it.stub ? ' · stub' : ''}</span>
            ${it.badge ? `<span class="badge">${it.badge}</span>` : ''}
          </a>`).join('')}
      `).join('')}</nav>`;

    const top = document.createElement('header');
    top.className = 'topbar';
    top.innerHTML = `
      <button class="icon-btn" id="btn-side" type="button" title="Menú">☰</button>
      <div class="search"><span class="si">⌕</span>
        <input placeholder="Buscar folio OC, factura, pedido…" id="q"/>
      </div>
      <div class="top-actions">
        <label class="switcher" title="Empresa">
          <select id="co-switch">${ERPDemo.companies.map((c) =>
            `<option value="${c.id}" ${c.id === s.company_id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </label>
        <label class="switcher" title="Rol demo">
          <select id="role-switch">${ERPDemo.roles.map((r) =>
            `<option value="${r.id}" ${r.id === s.role_id ? 'selected' : ''}>${r.label}</option>`).join('')}
          </select>
        </label>
        <button class="icon-btn" id="btn-theme" type="button" title="Tema">◐</button>
        <button class="icon-btn dot-alert" type="button" title="Notificaciones"
          onclick="location.href='${A('administracion/notificaciones.html')}'">🔔</button>
        <button class="user-chip" type="button" onclick="location.href='${A('administracion/perfil.html')}'">
          <div class="avatar">${s.short}</div>
          <div class="user-meta"><strong>${s.display_name}</strong><span>${s.role}</span></div>
        </button>
        <button class="icon-btn" type="button" title="Salir" id="btn-out">⎋</button>
      </div>`;

    app.prepend(top);
    app.prepend(sidebar);

    document.getElementById('btn-side').onclick = () => {
      if (matchMedia('(max-width:960px)').matches) app.classList.toggle('mobile-open');
      else app.classList.toggle('collapsed');
    };
    document.getElementById('btn-theme').onclick = () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('erp-preview-theme', next);
    };
    document.getElementById('btn-out').onclick = () => {
      sessionStorage.clear();
      location.href = A('index.html');
    };
    document.getElementById('role-switch').onchange = (e) => {
      ERPDemo.applyRole(e.target.value, document.getElementById('co-switch').value);
      toast('Rol: ' + ERPDemo.session.role);
      location.href = A('dashboard/index.html');
    };
    document.getElementById('co-switch').onchange = (e) => {
      ERPDemo.applyRole(document.getElementById('role-switch').value, e.target.value);
      toast('Empresa: ' + ERPDemo.session.company);
      location.reload();
    };
    document.getElementById('q').onkeydown = (e) => {
      if (e.key !== 'Enter') return;
      const v = e.target.value.toLowerCase();
      if (v.includes('po') || v.includes('oc') || v.includes('pr')) location.href = A('compras/index.html');
      else if (v.includes('ap') || v.includes('cxp')) location.href = A('finanzas/cxp.html');
      else if (v.includes('ar') || v.includes('cxc')) location.href = A('finanzas/cxc.html');
      else if (v.includes('so') || v.includes('pedido')) location.href = A('ventas/index.html');
      else toast('Pruebe OC, CxP, CxC o pedido');
    };

    const theme = localStorage.getItem('erp-preview-theme');
    if (theme) document.documentElement.setAttribute('data-theme', theme);

    if (!document.getElementById('toast-host')) {
      const th = document.createElement('div');
      th.id = 'toast-host'; th.className = 'toast-host';
      document.body.appendChild(th);
    }
  }

  window.toast = function (msg) {
    const host = document.getElementById('toast-host');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    host.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  };

  window.crumbs = function (items) {
    return `<nav class="crumbs">${items.map((c, i) =>
      i < items.length - 1
        ? `<a href="${c.href}">${c.label}</a><span class="sep">/</span>`
        : `<span>${c.label}</span>`
    ).join('')}</nav>`;
  };

  window.pageHead = function (title, sub, actionsHtml) {
    return `<div class="page-hd"><div><h1>${title}</h1><p>${sub || ''}</p></div>
      <div class="page-actions">${actionsHtml || ''}</div></div>`;
  };

  window.scriptStack = function () {
    /* helper comment: pages should load data → i18n → components → shell */
  };

  document.addEventListener('DOMContentLoaded', injectShell);
})();
