(() => {
  const LOGIN_HREF = '/login.html';
  const TASKS_KEY = 'erp_bandeja_tasks';

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
        { title: 'OC-1042 · ACME Aceros', detail: 'Monto $248,000 · requiere 2º aprobador', tag: 'Alta', tone: 'high', route: '/bandeja', taskId: 't-oc-1042' },
        { title: 'Factura proveedor FP-889', detail: 'Excepción de match precio', tag: 'Media', tone: 'med', route: '/bandeja', taskId: 't-match-889' },
        { title: 'Pedido SO-331', detail: 'Cliente cerca del límite de crédito', tag: 'Alta', tone: 'high', route: '/bandeja', taskId: 't-credit-331' },
        { title: 'Pago tesorería PT-77', detail: 'Sobre umbral · doble control', tag: 'Media', tone: 'med', route: '/bandeja', taskId: 't-pay-77' }
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
        { title: 'RQ-220 · Empaques', detail: 'Espera aprobación de compras', tag: 'Media', tone: 'med', route: '/bandeja', taskId: 't-pr-220' },
        { title: 'OC-1038 · Tornillería', detail: 'Revisión de compras', tag: 'Baja', tone: 'low', route: '/bandeja', taskId: 't-oc-1038' }
      ],
      alerts: [
        { title: 'Artículo SKU-441 bajo ATP', detail: 'Disponible 12 · reservado 10', tone: 'med' },
        { title: 'Proveedor con RFC por completar', detail: 'Bloquea factura si aplica política', tone: 'info' }
      ]
    }
  };

  const DEMO_TASKS = {
    'admin.acme': [
      {
        id: 't-oc-1042', type: 'OC', folio: 'OC-1042', title: 'OC-1042 · ACME Aceros',
        summary: 'Orden de compra de acero estructural. Supera umbral de gerencia.',
        requester: 'Carlos López', org: 'ACME · Compras', amount: '$248,000 MXN',
        step: 'Gerente / 2º aprobador', age: '1 día', process: 'erp.po.approve',
        priority: 'Alta', tone: 'high', status: 'OPEN'
      },
      {
        id: 't-match-889', type: 'MATCH', folio: 'FP-889', title: 'Match CxP · FP-889',
        summary: 'Diferencia de precio fuera de tolerancia en triple match OC/GR/factura.',
        requester: 'Ana Pérez', org: 'ACME · CxP', amount: '$41,250 MXN',
        step: 'Controller finanzas', age: '5 h', process: 'erp.ap.match_exception',
        priority: 'Media', tone: 'med', status: 'OPEN'
      },
      {
        id: 't-credit-331', type: 'CREDIT', folio: 'SO-331', title: 'Crédito · SO-331',
        summary: 'Pedido supera exposición de crédito del cliente Norte SA.',
        requester: 'Luis Vega', org: 'ACME · Ventas', amount: '$310,000 MXN',
        step: 'Crédito / Finanzas', age: '3 h', process: 'erp.ar.credit_exception',
        priority: 'Alta', tone: 'high', status: 'OPEN'
      },
      {
        id: 't-pay-77', type: 'PAY', folio: 'PT-77', title: 'Pago · PT-77',
        summary: 'Propuesta de pago sobre umbral. Requiere doble control (preparador ≠ aprobador).',
        requester: 'Tesorería', org: 'ACME · Tesorería', amount: '$520,000 MXN',
        step: '2º aprobador pagos', age: '2 días', process: 'erp.ap.payment_dual',
        priority: 'Media', tone: 'med', status: 'OPEN'
      },
      {
        id: 't-pr-901', type: 'PR', folio: 'RQ-901', title: 'RQ-901 · Servicios TI',
        summary: 'Requisición de licencias. Ya aprobada en demo.',
        requester: 'Sistemas', org: 'ACME · TI', amount: '$18,400 MXN',
        step: 'Cerrado', age: '—', process: 'erp.pr.approve',
        priority: 'Baja', tone: 'low', status: 'DONE', decision: 'APPROVED'
      }
    ],
    'compras.acme': [
      {
        id: 't-pr-220', type: 'PR', folio: 'RQ-220', title: 'RQ-220 · Empaques',
        summary: 'Requisición de empaques industriales pendiente de revisión compras.',
        requester: 'Almacén Norte', org: 'ACME · Operaciones', amount: '$12,800 MXN',
        step: 'Compras', age: '6 h', process: 'erp.pr.approve',
        priority: 'Media', tone: 'med', status: 'OPEN'
      },
      {
        id: 't-oc-1038', type: 'OC', folio: 'OC-1038', title: 'OC-1038 · Tornillería',
        summary: 'OC de consumo recurrente. Revisión de lead comprador.',
        requester: 'Carlos López', org: 'ACME · Compras', amount: '$6,450 MXN',
        step: 'Lead compras', age: '1 día', process: 'erp.po.approve',
        priority: 'Baja', tone: 'low', status: 'OPEN'
      }
    ]
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

  const loadTasks = () => {
    try {
      const raw = sessionStorage.getItem(TASKS_KEY + ':' + userKey);
      if (raw) return JSON.parse(raw);
    } catch { /* seed */ }
    const seed = DEMO_TASKS[userKey].map((t) => ({ ...t }));
    sessionStorage.setItem(TASKS_KEY + ':' + userKey, JSON.stringify(seed));
    return seed;
  };
  let tasks = loadTasks();
  const saveTasks = () => sessionStorage.setItem(TASKS_KEY + ':' + userKey, JSON.stringify(tasks));

  const companyLabel = document.getElementById('companyLabel');
  const userLabel = document.getElementById('userLabel');
  const menuNav = document.getElementById('menuNav');
  const drawer = document.getElementById('drawer');
  const scrim = document.getElementById('scrim');
  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const kpiGrid = document.getElementById('kpiGrid');
  const moduleBlocks = document.getElementById('moduleBlocks');
  const goSearch = document.getElementById('goSearch');
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
    bandeja: document.querySelector('[data-page="bandeja"]'),
    stub: document.querySelector('[data-page="stub"]')
  };
  const stubTitle = document.getElementById('stubTitle');
  const backHomeBtn = document.getElementById('backHomeBtn');
  const backHomeFromBandeja = document.getElementById('backHomeFromBandeja');
  const bandejaList = document.getElementById('bandejaList');
  const bandejaCount = document.getElementById('bandejaCount');
  const bandejaListTitle = document.getElementById('bandejaListTitle');
  const filterType = document.getElementById('filterType');
  const filterSearch = document.getElementById('filterSearch');
  const bandejaDetailEmpty = document.getElementById('bandejaDetailEmpty');
  const bandejaDetailBody = document.getElementById('bandejaDetailBody');
  const decisionComment = document.getElementById('decisionComment');
  const decisionMsg = document.getElementById('decisionMsg');
  const detailActions = document.getElementById('detailActions');
  const openDecisionBlock = document.getElementById('openDecisionBlock');
  const doneActions = document.getElementById('doneActions');
  const txModal = document.getElementById('txModal');
  const txModalScrim = document.getElementById('txModalScrim');

  let bandejaTab = 'OPEN';
  let selectedTaskId = null;

  const decisionLabel = (task) => {
    if (task.decision === 'APPROVED') return 'Aprobada';
    if (task.decision === 'REJECTED') return 'Rechazada';
    return task.status === 'DONE' ? 'Completada' : 'Pendiente';
  };

  const setTxModal = (open) => {
    txModal.hidden = !open;
    txModalScrim.hidden = !open;
    requestAnimationFrame(() => {
      txModal.classList.toggle('is-open', open);
      txModalScrim.classList.toggle('is-open', open);
    });
    if (!open) {
      txModal.classList.remove('is-open');
      txModalScrim.classList.remove('is-open');
    }
  };

  const openTxModal = (task) => {
    if (!task) return;
    document.getElementById('txModalTitle').textContent = task.title;
    document.getElementById('txType').textContent = task.type;
    const dec = document.getElementById('txDecision');
    dec.textContent = decisionLabel(task);
    dec.className = 'tag ' + (task.decision === 'REJECTED' ? 'high' : task.decision === 'APPROVED' ? 'ok' : task.tone);
    document.getElementById('txSummary').textContent = task.summary;
    document.getElementById('txFolio').textContent = task.folio;
    document.getElementById('txPriority').textContent = task.priority;
    document.getElementById('txRequester').textContent = task.requester;
    document.getElementById('txOrg').textContent = task.org;
    document.getElementById('txAmount').textContent = task.amount;
    document.getElementById('txStep').textContent = task.step;
    document.getElementById('txProcess').textContent = task.process;
    document.getElementById('txStatus').textContent = decisionLabel(task);
    document.getElementById('txComment').textContent = task.comment || 'Sin comentario';
    setTxModal(true);
  };

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

  const hideAllPages = () => {
    Object.values(pages).forEach((p) => { if (p) p.hidden = true; });
  };

  const setActiveRoute = (route) => {
    menuNav.querySelectorAll('.menu-link').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.route === route);
    });
  };

  const showDashboard = () => {
    hideAllPages();
    pages.dashboard.hidden = false;
    document.title = 'ERP · Inicio';
    setActiveRoute('/dashboard');
  };

  const showBandeja = (taskId) => {
    hideAllPages();
    pages.bandeja.hidden = false;
    document.title = 'ERP · Bandeja de aprobación';
    setActiveRoute('/bandeja');
    setDrawer(false);
    if (taskId) selectedTaskId = taskId;
    renderBandeja();
  };

  const showStub = (label, route) => {
    if ((route || '') === '/bandeja' || (label || '').toLowerCase().includes('bandeja')) {
      showBandeja();
      return;
    }
    hideAllPages();
    pages.stub.hidden = false;
    stubTitle.textContent = label || 'Módulo';
    document.title = 'ERP · ' + (label || 'Módulo');
    setActiveRoute(route);
    setDrawer(false);
  };

  const navigateTo = (label, route, taskId) => {
    if ((route || '') === '/dashboard') {
      showDashboard();
      setDrawer(false);
      return;
    }
    if ((route || '') === '/bandeja') {
      showBandeja(taskId);
      return;
    }
    showStub(label, route);
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
  backHomeFromBandeja.addEventListener('click', () => showDashboard());

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
        btn.addEventListener('click', () => navigateTo(item.label, item.route));
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
      el.addEventListener('click', () => navigateTo(el.dataset.label, el.dataset.route));
    });
  };

  const renderInbox = () => {
    const openCount = tasks.filter((t) => t.status === 'OPEN').length;
    inboxCount.textContent = String(openCount);
    const preview = home.inbox;
    if (!preview.length) {
      inboxList.innerHTML = '<li class="empty">No tienes pendientes por ahora.</li>';
      return;
    }
    inboxList.innerHTML = preview.map((item) => `
      <li>
        <button type="button" class="inbox-item linkish" data-route="/bandeja" data-task="${item.taskId || ''}" data-label="${item.title}">
          <div>
            <strong>${item.title}</strong>
            <span>${item.detail}</span>
          </div>
          <span class="tag ${item.tone}">${item.tag}</span>
        </button>
      </li>
    `).join('');
    inboxList.querySelectorAll('.inbox-item').forEach((el) => {
      el.addEventListener('click', () => navigateTo(el.dataset.label, '/bandeja', el.dataset.task));
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

  const sectionOrder = ['Inicio', 'Operación', 'Finanzas', 'Administración', 'Plataforma'];
  const sortedSections = (sections) => {
    const copy = [...(sections || [])];
    copy.sort((a, b) => {
      const ia = sectionOrder.indexOf(a.label || a.id);
      const ib = sectionOrder.indexOf(b.label || b.id);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    return copy;
  };

  const renderModuleBlocks = (sections) => {
    moduleBlocks.innerHTML = '';
    const usable = sortedSections(sections)
      .map((section) => ({
        ...section,
        children: (section.children || []).filter((c) => c.id !== 'dashboard')
      }))
      .filter((section) => section.children.length);

    if (!usable.length) {
      moduleBlocks.innerHTML = '<p class="empty">No hay módulos disponibles para tu perfil.</p>';
      return;
    }

    usable.forEach((section) => {
      const block = document.createElement('div');
      block.className = 'module-block';
      const title = document.createElement('div');
      title.className = 'module-block-title';
      title.innerHTML = `<span>${section.label || section.id}</span><span class="sec-count">${section.children.length}</span>`;
      block.appendChild(title);
      const tiles = document.createElement('div');
      tiles.className = 'tiles';
      section.children.forEach((item) => {
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'tile';
        tile.dataset.search = [item.label, item.route, item.module, section.label].filter(Boolean).join(' ').toLowerCase();
        tile.innerHTML = `<div class="tile-code">${(item.module || '').replace('erp.', '').replace('core.', '') || 'app'}</div>
          <div class="tile-name">${item.label}</div>`;
        tile.addEventListener('click', () => navigateTo(item.label, item.route));
        tiles.appendChild(tile);
      });
      block.appendChild(tiles);
      moduleBlocks.appendChild(block);
    });
  };

  goSearch.addEventListener('input', () => {
    const q = (goSearch.value || '').trim().toLowerCase();
    moduleBlocks.querySelectorAll('.module-block').forEach((block) => {
      let visible = 0;
      block.querySelectorAll('.tile').forEach((tile) => {
        const match = !q || (tile.dataset.search || '').includes(q);
        tile.classList.toggle('is-dim', !match);
        if (match) visible += 1;
      });
      block.hidden = visible === 0;
    });
  });

  const filteredTasks = () => {
    const type = filterType.value;
    const q = (filterSearch.value || '').trim().toLowerCase();
    return tasks.filter((t) => {
      if (bandejaTab === 'OPEN' && t.status !== 'OPEN') return false;
      if (bandejaTab === 'DONE' && t.status === 'OPEN') return false;
      if (type && t.type !== type) return false;
      if (q) {
        const hay = [t.folio, t.title, t.requester, t.process, t.summary].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  };

  const renderDetail = (task) => {
    if (!task) {
      bandejaDetailEmpty.hidden = false;
      bandejaDetailBody.hidden = true;
      return;
    }
    bandejaDetailEmpty.hidden = true;
    bandejaDetailBody.hidden = false;
    document.getElementById('detailType').textContent = task.type;
    const pr = document.getElementById('detailPriority');
    pr.textContent = task.priority;
    pr.className = 'tag ' + task.tone;
    document.getElementById('detailFolio').textContent = task.title;
    document.getElementById('detailSummary').textContent = task.summary;
    document.getElementById('detailRequester').textContent = task.requester;
    document.getElementById('detailOrg').textContent = task.org;
    document.getElementById('detailAmount').textContent = task.amount;
    document.getElementById('detailStep').textContent = task.step;
    document.getElementById('detailAge').textContent = task.age;
    document.getElementById('detailProcess').textContent = task.process;
    decisionComment.value = '';
    decisionMsg.hidden = true;
    const canDecide = task.status === 'OPEN';
    openDecisionBlock.hidden = !canDecide;
    detailActions.hidden = !canDecide;
    decisionComment.disabled = !canDecide;
    doneActions.hidden = canDecide;
    if (!canDecide) {
      decisionMsg.hidden = false;
      decisionMsg.textContent = 'Estado: ' + decisionLabel(task) +
        (task.comment ? ' · ' + task.comment : '') +
        ' · usa Detalle para ver el expediente.';
    }
  };

  const renderBandeja = () => {
    const list = filteredTasks();
    bandejaListTitle.textContent = bandejaTab === 'OPEN' ? 'Pendientes' : 'Completadas';
    bandejaCount.textContent = String(list.length);
    if (!list.length) {
      bandejaList.innerHTML = '<p class="empty">No hay tareas con estos filtros.</p>';
      renderDetail(null);
      return;
    }
    if (!selectedTaskId || !list.some((t) => t.id === selectedTaskId)) {
      selectedTaskId = list[0].id;
    }
    bandejaList.innerHTML = list.map((t) => `
      <button type="button" class="task-card ${t.id === selectedTaskId ? 'is-selected' : ''} ${t.status !== 'OPEN' ? 'is-done' : ''}" data-id="${t.id}">
        <div class="task-card-top">
          <span class="pill soft">${t.type}</span>
          <span class="tag ${t.tone}">${t.priority}</span>
        </div>
        <h3>${t.title}</h3>
        <p>${t.summary}</p>
        <div class="task-meta">
          <span>Solicita: <strong>${t.requester}</strong></span>
          <span>Monto: <strong>${t.amount}</strong></span>
          <span>Paso: <strong>${t.step}</strong></span>
          <span>Antigüedad: <strong>${t.age}</strong></span>
        </div>
      </button>
    `).join('');
    bandejaList.querySelectorAll('.task-card').forEach((el) => {
      el.addEventListener('click', () => {
        selectedTaskId = el.dataset.id;
        renderBandeja();
      });
    });
    renderDetail(tasks.find((t) => t.id === selectedTaskId) || null);
  };

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      bandejaTab = tab.dataset.tab;
      selectedTaskId = null;
      renderBandeja();
    });
  });
  filterType.addEventListener('change', () => { selectedTaskId = null; renderBandeja(); });
  filterSearch.addEventListener('input', () => renderBandeja());

  const decide = (decision) => {
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task || task.status !== 'OPEN') return;
    const comment = (decisionComment.value || '').trim();
    if (decision === 'REJECTED' && comment.length < 5) {
      decisionMsg.hidden = false;
      decisionMsg.textContent = 'Al rechazar, el comentario es obligatorio (mín. 5 caracteres).';
      decisionComment.focus();
      return;
    }
    task.status = 'DONE';
    task.decision = decision;
    task.comment = comment;
    task.step = decision === 'APPROVED' ? 'Aprobado' : 'Rechazado';
    task.age = '—';
    saveTasks();
    renderInbox();
    renderBandeja();
    decisionMsg.hidden = false;
    decisionMsg.textContent = decision === 'APPROVED'
      ? 'Tarea aprobada (demo local).'
      : 'Tarea rechazada (demo local).';
  };

  document.getElementById('btnApprove').addEventListener('click', () => decide('APPROVED'));
  document.getElementById('btnReject').addEventListener('click', () => decide('REJECTED'));
  document.getElementById('btnViewDoc').addEventListener('click', () => {
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task) return;
    decisionMsg.hidden = false;
    decisionMsg.textContent = 'Vista de documento stub · ' + task.folio + ' (' + task.process + '). Se conectará al módulo en una fase posterior.';
  });
  document.getElementById('btnDetalle').addEventListener('click', () => {
    openTxModal(tasks.find((t) => t.id === selectedTaskId));
  });
  document.getElementById('txModalClose').addEventListener('click', () => setTxModal(false));
  document.getElementById('txModalOk').addEventListener('click', () => setTxModal(false));
  txModalScrim.addEventListener('click', () => setTxModal(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !txModal.hidden) setTxModal(false);
  });

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
  renderModuleBlocks(sections);
  statusLine.textContent =
    (user.displayName || 'Usuario') + ' · lanzador + bandeja · ' +
    flattenItems(sections).length + ' accesos de menú';
  showDashboard();
})();
