(() => {
  const LOGIN_HREF = '../login/';
  const token = sessionStorage.getItem('erp_access_token');
  const userRaw = sessionStorage.getItem('erp_user');
  if (!token || !userRaw) {
    location.replace(LOGIN_HREF);
    return;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    location.replace(LOGIN_HREF);
    return;
  }

  const MENU_BY_USER = {
    'admin.acme': [
      {
        id: 'Inicio', label: 'Inicio', children: [
          { id: 'dashboard', label: 'Inicio', route: '/dashboard', module: 'core.shell' },
          { id: 'bandeja', label: 'Bandeja de aprobación', route: '/bandeja', module: 'core.workflow' }
        ]
      },
      {
        id: 'Administración', label: 'Administración', children: [
          { id: 'catalogos', label: 'Catálogos', route: '/catalogos', module: 'core.catalog' },
          { id: 'usuarios', label: 'Usuarios y permisos', route: '/usuarios', module: 'core.iam' }
        ]
      },
      {
        id: 'Operación', label: 'Operación', children: [
          { id: 'compras', label: 'Compras', route: '/compras', module: 'erp.procurement' },
          { id: 'inventarios', label: 'Inventarios', route: '/inventarios', module: 'erp.inventory' },
          { id: 'ventas', label: 'Ventas', route: '/ventas', module: 'erp.ar' }
        ]
      },
      {
        id: 'Finanzas', label: 'Finanzas', children: [
          { id: 'cxp', label: 'Cuentas por pagar', route: '/cxp', module: 'erp.ap' },
          { id: 'facturacion', label: 'Facturación', route: '/facturacion', module: 'erp.billing' },
          { id: 'cxc', label: 'Cuentas por cobrar', route: '/cxc', module: 'erp.ar' },
          { id: 'contabilidad', label: 'Contabilidad', route: '/contabilidad', module: 'erp.accounting' },
          { id: 'tesoreria', label: 'Tesorería', route: '/tesoreria', module: 'erp.treasury' }
        ]
      },
      {
        id: 'Plataforma', label: 'Plataforma', children: [
          { id: 'documentos', label: 'Documentos', route: '/documentos', module: 'core.document' },
          { id: 'auditoria', label: 'Auditoría', route: '/auditoria', module: 'core.audit' },
          { id: 'reportes', label: 'Reportes', route: '/reportes', module: 'core.report' }
        ]
      }
    ],
    'compras.acme': [
      {
        id: 'Inicio', label: 'Inicio', children: [
          { id: 'dashboard', label: 'Inicio', route: '/dashboard', module: 'core.shell' },
          { id: 'bandeja', label: 'Bandeja de aprobación', route: '/bandeja', module: 'core.workflow' }
        ]
      },
      {
        id: 'Administración', label: 'Administración', children: [
          { id: 'catalogos', label: 'Catálogos', route: '/catalogos', module: 'core.catalog' }
        ]
      },
      {
        id: 'Operación', label: 'Operación', children: [
          { id: 'compras', label: 'Compras', route: '/compras', module: 'erp.procurement' },
          { id: 'inventarios', label: 'Inventarios', route: '/inventarios', module: 'erp.inventory' }
        ]
      }
    ]
  };

  const companyLabel = document.getElementById('companyLabel');
  const userLabel = document.getElementById('userLabel');
  const menuNav = document.getElementById('menuNav');
  const drawer = document.getElementById('drawer');
  const scrim = document.getElementById('scrim');
  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const kpiGrid = document.getElementById('kpiGrid');
  const quickLinks = document.getElementById('quickLinks');
  const statusLine = document.getElementById('statusLine');
  const pages = {
    dashboard: document.querySelector('[data-page="dashboard"]'),
    stub: document.querySelector('[data-page="stub"]')
  };
  const stubTitle = document.getElementById('stubTitle');
  const backHomeBtn = document.getElementById('backHomeBtn');

  companyLabel.textContent = user.companyName || user.companyCode || 'Empresa';
  userLabel.textContent = user.displayName || user.username || 'Usuario';

  const setDrawer = (open) => {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    scrim.hidden = !open;
    requestAnimationFrame(() => scrim.classList.toggle('is-open', open));
  };

  menuBtn.addEventListener('click', () => setDrawer(true));
  closeMenuBtn.addEventListener('click', () => setDrawer(false));
  scrim.addEventListener('click', () => setDrawer(false));
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('erp_access_token');
    sessionStorage.removeItem('erp_user');
    sessionStorage.removeItem('erp_menus');
    location.replace(LOGIN_HREF);
  });
  backHomeBtn.addEventListener('click', () => showDashboard());

  const showDashboard = () => {
    pages.dashboard.hidden = false;
    pages.stub.hidden = true;
    document.title = 'ERP · Inicio (preview)';
    menuNav.querySelectorAll('.menu-link').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.route === '/dashboard');
    });
  };

  const showStub = (label, route) => {
    pages.dashboard.hidden = true;
    pages.stub.hidden = false;
    stubTitle.textContent = label || 'Módulo';
    document.title = 'ERP · ' + (label || 'Módulo');
    menuNav.querySelectorAll('.menu-link').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.route === route);
    });
    setDrawer(false);
  };

  const flattenItems = (sections) => {
    const items = [];
    (sections || []).forEach((section) => {
      (section.children || []).forEach((child) => items.push(child));
    });
    return items;
  };

  const renderMenu = (sections) => {
    menuNav.innerHTML = '';
    (sections || []).forEach((section) => {
      const title = document.createElement('div');
      title.className = 'menu-section';
      title.textContent = section.label || section.id;
      menuNav.appendChild(title);
      (section.children || []).forEach((item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'menu-link';
        btn.textContent = item.label;
        btn.dataset.route = item.route || '';
        btn.addEventListener('click', () => {
          if ((item.route || '') === '/dashboard' || item.id === 'dashboard') {
            showDashboard();
            setDrawer(false);
            return;
          }
          showStub(item.label, item.route);
        });
        menuNav.appendChild(btn);
      });
    });
  };

  const renderDashboard = (sections) => {
    const items = flattenItems(sections);
    const moduleCount = new Set(items.map((i) => i.module).filter(Boolean)).size;
    const sectionCount = (sections || []).length;
    const kpis = [
      { label: 'Módulos visibles', value: String(moduleCount), hint: 'Según tus permisos' },
      { label: 'Secciones de menú', value: String(sectionCount), hint: 'Menú hamburguesa' },
      { label: 'Pendientes', value: '—', hint: 'Stub · workflow después' },
      { label: 'Alertas', value: '0', hint: 'Sin alertas demo' }
    ];
    kpiGrid.innerHTML = kpis.map((k) => `
      <article class="kpi">
        <div class="label">${k.label}</div>
        <div class="value">${k.value}</div>
        <div class="hint">${k.hint}</div>
      </article>
    `).join('');

    quickLinks.innerHTML = '';
    items.filter((i) => i.id !== 'dashboard').slice(0, 6).forEach((item) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = item.label;
      chip.addEventListener('click', () => showStub(item.label, item.route));
      quickLinks.appendChild(chip);
    });
  };

  let sections = null;
  try {
    sections = JSON.parse(sessionStorage.getItem('erp_menus') || 'null');
  } catch {
    sections = null;
  }
  if (!sections || !sections.length) {
    const userKey = user.username
      || (user.displayName === 'Carlos López' || user.displayName === 'Compras ACME' ? 'compras.acme' : 'admin.acme');
    sections = MENU_BY_USER[userKey] || MENU_BY_USER['admin.acme'];
  }

  renderMenu(sections);
  renderDashboard(sections);
  statusLine.textContent =
    (user.displayName || 'Usuario') + ' · ' +
    flattenItems(sections).length + ' opciones de menú (preview demo).';
  showDashboard();
})();
