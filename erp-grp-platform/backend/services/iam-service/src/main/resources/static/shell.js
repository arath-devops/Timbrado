(() => {
  const LOGIN_HREF = '/login.html';

  const DEMO_MENUS = {
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

  const DEMO_HOME = {
    'admin.acme': {
      roleLabel: 'Administrador',
      kpis: [
        { label: 'OC por aprobar', value: '7', hint: 'Compras', tone: 'warn', route: '/compras' },
        { label: 'Por recibir', value: '4', hint: 'Inventario', tone: '', route: '/inventarios' },
        { label: 'CxP esta semana', value: '$182k', hint: 'Cuentas por pagar', tone: 'danger', route: '/cxp' },
        { label: 'CxC vencido', value: '$96k', hint: 'Cuentas por cobrar', tone: 'warn', route: '/cxc' },
        { label: 'Efectivo', value: '$1.2M', hint: 'Tesorería', tone: 'ok', route: '/tesoreria' },
        { label: 'Alertas abiertas', value: '3', hint: 'Prioridad alta', tone: 'danger', route: '/bandeja' }
      ],
      inbox: [
        { title: 'OC-1042 · ACME Aceros', detail: 'Monto $248,000 · requiere 2º aprobador', tag: 'Alta', tone: 'high', route: '/compras' },
        { title: 'Factura proveedor FP-889', detail: 'UUID CFDI pendiente de validar', tag: 'Media', tone: 'med', route: '/cxp' },
        { title: 'Pedido SO-331', detail: 'Cliente cerca del límite de crédito', tag: 'Alta', tone: 'high', route: '/ventas' },
        { title: 'Pago tesorería PT-77', detail: 'Sobre umbral · doble control', tag: 'Media', tone: 'med', route: '/tesoreria' }
      ],
      alerts: [
        { title: 'Crédito bloqueado', detail: 'Cliente Norte SA — no confirmar pedidos', tone: 'high' },
        { title: '3 OC sin recepción', detail: 'Antigüedad > 5 días', tone: 'med' },
        { title: '2 CFDI sin UUID en CxP', detail: 'Política fiscal MX activa', tone: 'info' }
      ]
    },
    'compras.acme': {
      roleLabel: 'Compras',
      kpis: [
        { label: 'Mis requisiciones', value: '5', hint: 'Borrador / enviadas', tone: '', route: '/compras' },
        { label: 'OC abiertas', value: '9', hint: 'Cantidad pendiente', tone: 'warn', route: '/compras' },
        { label: 'Por recibir', value: '3', hint: 'Entradas esperadas', tone: '', route: '/inventarios' },
        { label: 'Pendientes míos', value: '2', hint: 'Aprobaciones', tone: 'danger', route: '/bandeja' }
      ],
      inbox: [
        { title: 'RQ-220 · Empaques', detail: 'Espera tu envío a aprobación', tag: 'Media', tone: 'med', route: '/compras' },
        { title: 'OC-1038 · Tornillería', detail: 'Listo para seguimiento de recepción', tag: 'Baja', tone: 'low', route: '/inventarios' }
      ],
      alerts: [
        { title: 'Artículo SKU-441 bajo ATP', detail: 'Disponible 12 · reservado 10', tone: 'med' },
        { title: 'Proveedor con RFC por completar', detail: 'Bloquea factura si aplica política', tone: 'info' }
      ]
    }
  };

  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem('erp_user') || 'null');
  } catch {
    user = null;
  }
  if (!user) {
    user = {
      username: 'admin.acme',
      displayName: 'Administrador ACME',
      companyName: 'Empresa demo'
    };
  }

  const userKey = user.username === 'compras.acme' ? 'compras.acme' : 'admin.acme';
  const home = DEMO_HOME[userKey];

  const companyLabel = document.getElementById('companyLabel');
  const userLabel = document.getElementById('userLabel');
  const menuNav = document.getElementById('menuNav');
  const drawer = document.getElementById('drawer');
  const scrim = document.getElementById('scrim');
  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const kpiGrid = document.getElementById('kpiGrid');
  const quickTiles = document.getElementById('quickTiles');
  const statusLine = document.getElementById('statusLine');
  const inboxList = document.getElementById('inboxList');
  const inboxCount = document.getElementById('inboxCount');
  const alertsList = document.getElementById('alertsList');
  const greetTitle = document.getElementById('greetTitle');
  const greetSub = document.getElementById('greetSub');
  const todayLabel = document.getElementById('todayLabel');
  const companyPill = document.getElementById('companyPill');
  const rolePill = document.getElementById('rolePill');
  const pages = {
    dashboard: document.querySelector('[data-page="dashboard"]'),
    stub: document.querySelector('[data-page="stub"]')
  };
  const stubTitle = document.getElementById('stubTitle');
  const backHomeBtn = document.getElementById('backHomeBtn');

  const firstName = (user.displayName || user.username || 'Usuario').split(/\s+/)[0];
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  todayLabel.textContent = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  greetTitle.textContent = hello + ', ' + firstName;
  greetSub.textContent = 'Resumen del día · solo ves lo permitido para tu perfil.';
  companyLabel.textContent = user.companyName || user.companyCode || 'Empresa';
  userLabel.textContent = user.displayName || user.username || 'Usuario';
  companyPill.textContent = user.companyName || 'Empresa';
  rolePill.textContent = home.roleLabel;

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
    document.title = 'ERP · Inicio';
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

  const renderKpis = () => {
    kpiGrid.innerHTML = home.kpis.map((k) => `
      <button type="button" class="kpi ${k.tone || ''}" data-route="${k.route || ''}" data-label="${k.label}">
        <div class="label">${k.label}</div>
        <div class="value">${k.value}</div>
        <div class="hint">${k.hint}</div>
      </button>
    `).join('');
    kpiGrid.querySelectorAll('.kpi').forEach((el) => {
      el.addEventListener('click', () => {
        const route = el.dataset.route;
        const label = el.dataset.label;
        if (!route || route === '/dashboard') {
          showDashboard();
          return;
        }
        showStub(label, route);
      });
    });
  };

  const renderInbox = () => {
    inboxCount.textContent = String(home.inbox.length);
    if (!home.inbox.length) {
      inboxList.innerHTML = '<li class="empty">No tienes pendientes por ahora.</li>';
      return;
    }
    inboxList.innerHTML = home.inbox.map((item) => `
      <li>
        <button type="button" class="inbox-item linkish" data-route="${item.route}" data-label="${item.title}">
          <div>
            <strong>${item.title}</strong>
            <span>${item.detail}</span>
          </div>
          <span class="tag ${item.tone}">${item.tag}</span>
        </button>
      </li>
    `).join('');
    inboxList.querySelectorAll('.inbox-item').forEach((el) => {
      el.addEventListener('click', () => showStub(el.dataset.label, el.dataset.route));
    });
  };

  const renderAlerts = () => {
    if (!home.alerts.length) {
      alertsList.innerHTML = '<li class="empty">Sin alertas.</li>';
      return;
    }
    alertsList.innerHTML = home.alerts.map((a) => `
      <li class="alert-item">
        <div>
          <strong>${a.title}</strong>
          <span>${a.detail}</span>
        </div>
        <span class="tag ${a.tone}">!</span>
      </li>
    `).join('');
  };

  const renderTiles = (sections) => {
    const items = flattenItems(sections).filter((i) => i.id !== 'dashboard');
    quickTiles.innerHTML = '';
    if (!items.length) {
      quickTiles.innerHTML = '<p class="empty">No hay módulos disponibles.</p>';
      return;
    }
    items.slice(0, 8).forEach((item) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'tile';
      tile.innerHTML = `<div class="tile-code">${(item.module || '').replace('erp.', '').replace('core.', '') || 'app'}</div>
        <div class="tile-name">${item.label}</div>`;
      tile.addEventListener('click', () => showStub(item.label, item.route));
      quickTiles.appendChild(tile);
    });
  };

  let sections = null;
  try {
    sections = JSON.parse(sessionStorage.getItem('erp_menus') || 'null');
  } catch {
    sections = null;
  }
  if (!sections || !sections.length) {
    sections = DEMO_MENUS[userKey];
  }

  renderMenu(sections);
  renderKpis();
  renderInbox();
  renderAlerts();
  renderTiles(sections);
  statusLine.textContent =
    (user.displayName || 'Usuario') + ' · carcasa dashboard · ' +
    flattenItems(sections).length + ' accesos de menú';
  showDashboard();
})();
