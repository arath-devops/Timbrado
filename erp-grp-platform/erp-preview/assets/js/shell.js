(function () {
  const DEPTH = document.body.getAttribute('data-depth') || '..';
  const A = (p) => `${DEPTH}/${p}`.replace(/\/+/g, '/');

  const NAV = [
    { sec: 'Inicio', items: [
      { href: 'dashboard/index.html', label: 'Dashboard', ico: '▣' }
    ]},
    { sec: 'Operación', items: [
      { href: 'compras/index.html', label: 'Compras', ico: '◇' },
      { href: 'ventas/index.html', label: 'Ventas', ico: '▤' },
      { href: 'inventarios/index.html', label: 'Inventarios', ico: '▦' }
    ]},
    { sec: 'Finanzas', items: [
      { href: 'finanzas/contabilidad.html', label: 'Contabilidad (GL)', ico: '◈', match: ['plan-cuentas','periodos','asientos','mayor','contabilidad'] },
      { href: 'finanzas/cxp.html', label: 'CxP · Cuentas por pagar', ico: '⇩', match: ['cxp','facturas-ap','captura-factura-ap','detalle-factura-ap','programacion-pagos','aging-ap'] },
      { href: 'finanzas/facturacion.html', label: 'Facturación', ico: '▤', match: ['facturacion','emitir-factura'] },
      { href: 'finanzas/cxc.html', label: 'CxC · Cuentas por cobrar', ico: '⇧', match: ['cxc','facturas-ar','cobros','aging-ar','estado-cuenta'] },
      { href: 'finanzas/tesoreria.html', label: 'Tesorería', ico: '₩', match: ['tesoreria','bancos','ordenes-pago','conciliacion'] },
      { href: 'finanzas/index.html', label: 'Finanzas (hub)', ico: '◇', match: ['finanzas/index'] },
      { href: 'activos/index.html', label: 'Activos', ico: '▣' },
      { href: 'proyectos/index.html', label: 'Proyectos', ico: '◎' }
    ]},
    { sec: 'Personas', items: [
      { href: 'rh/index.html', label: 'RRHH', ico: '♟' },
      { href: 'nomina/index.html', label: 'Nómina', ico: '₮' }
    ]},
    { sec: 'Plataforma', items: [
      { href: 'administracion/bandeja.html', label: 'Bandeja aprobación', ico: '⟳', badge: 3 },
      { href: 'administracion/index.html', label: 'Administración', ico: '⬡' },
      { href: 'reportes/index.html', label: 'Reportes', ico: '▥' }
    ]}
  ];

  function pathMatch(it) {
    const loc = location.pathname.replace(/\\/g, '/');
    const href = typeof it === 'string' ? it : it.href;
    const leaf = href.split('/').slice(-2).join('/');
    if (loc.endsWith(href) || loc.includes('/' + leaf)) return true;
    const keys = (it && it.match) || [];
    return keys.some((k) => loc.includes('/' + k) || loc.endsWith(k + '.html'));
  }

  function injectShell() {
    if (!sessionStorage.getItem('erp-demo-auth') && !document.body.dataset.public) {
      location.href = A('index.html');
      return;
    }
    const s = ERPDemo.session;
    const app = document.getElementById('app');
    if (!app) return;

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
      <div class="brand">
        <div class="brand-mark">ERP</div>
        <div class="brand-text">ACME Industrial<span>ERP Preview · demo</span></div>
      </div>
      <nav class="nav">${NAV.map((sec) => `
        <div class="nav-sec">${sec.sec}</div>
        ${sec.items.map((it) => `
          <a class="${pathMatch(it) ? 'active' : ''}" href="${A(it.href)}">
            <span class="ico">${it.ico}</span><span class="nav-label">${it.label}</span>
            ${it.badge ? `<span class="badge">${it.badge}</span>` : ''}
          </a>`).join('')}
      `).join('')}</nav>`;

    const top = document.createElement('header');
    top.className = 'topbar';
    top.innerHTML = `
      <button class="icon-btn" id="btn-side" type="button" title="Menú">☰</button>
      <div class="search"><span class="si">⌕</span>
        <input placeholder="Buscar folio PO, AP, SO, proveedor…" id="q"/>
      </div>
      <div class="top-actions">
        <button class="icon-btn" id="btn-theme" type="button" title="Tema">◐</button>
        <button class="icon-btn dot-alert" type="button" title="Notificaciones"
          onclick="location.href='${A('administracion/notificaciones.html')}'">🔔</button>
        <button class="user-chip" type="button" onclick="location.href='${A('administracion/perfil.html')}'">
          <div class="avatar">${s.short}</div>
          <div class="user-meta"><strong>${s.display_name}</strong><span>${s.role}</span></div>
        </button>
        <button class="icon-btn" type="button" title="Salir" id="btn-out">⎋</button>
      </div>`;

    const main = document.getElementById('main');
    app.prepend(top);
    app.prepend(sidebar);

    document.getElementById('btn-side').onclick = () => {
      if (matchMedia('(max-width:960px)').matches) app.classList.toggle('mobile-open');
      else app.classList.toggle('collapsed');
    };
    document.getElementById('btn-theme').onclick = () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('erp-preview-theme', next);
    };
    document.getElementById('btn-out').onclick = () => {
      sessionStorage.clear();
      location.href = A('index.html');
    };
    document.getElementById('q').onkeydown = (e) => {
      if (e.key !== 'Enter') return;
      const v = e.target.value.toLowerCase();
      if (v.includes('po') || v.includes('oc') || v.includes('pr')) location.href = A('compras/index.html');
      else if (v.includes('ap') || v.includes('factura')) location.href = A('finanzas/facturas-ap.html');
      else if (v.includes('so') || v.includes('pedido')) location.href = A('ventas/index.html');
      else toast('Búsqueda demo: pruebe PO, AP o SO');
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

  document.addEventListener('DOMContentLoaded', injectShell);
})();
