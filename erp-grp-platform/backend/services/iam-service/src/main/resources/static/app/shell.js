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
        step: 'Aprobado', age: '—', process: 'erp.pr.approve',
        priority: 'Baja', tone: 'low', status: 'DONE', decision: 'APPROVED',
        comment: 'Presupuesto TI autorizado.'
      },
      {
        id: 't-pay-55', type: 'PAY', folio: 'PT-55', title: 'Pago · PT-55',
        summary: 'Propuesta rechazada por falta de soporte fiscal del proveedor.',
        requester: 'Tesorería', org: 'ACME · Tesorería', amount: '$87,900 MXN',
        step: 'Rechazado', age: '—', process: 'erp.ap.payment_dual',
        priority: 'Media', tone: 'med', status: 'DONE', decision: 'REJECTED',
        comment: 'Falta CFDI y constancia de situación fiscal vigente.'
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
      },
      {
        id: 't-pr-188', type: 'PR', folio: 'RQ-188', title: 'RQ-188 · Uniformes',
        summary: 'Requisición rechazada por fuera de política de compra.',
        requester: 'RH', org: 'ACME · RH', amount: '$9,200 MXN',
        step: 'Rechazado', age: '—', process: 'erp.pr.approve',
        priority: 'Baja', tone: 'low', status: 'DONE', decision: 'REJECTED',
        comment: 'Usar proveedor autorizado del catálogo marco.'
      }
    ]
  };

  const CATALOG_DEFS = [
    { id: 'CURRENCY', group: 'OPS', name: 'Monedas', desc: 'Moneda funcional y monedas de transacción', editable: true },
    { id: 'UOM', group: 'OPS', name: 'Unidades de medida', desc: 'Cantidades en compras, inventario y facturas', editable: true },
    { id: 'PAYMENT_TERMS', group: 'OPS', name: 'Condiciones de pago', desc: 'Plazos NET / contado para OC y CxP/CxC', editable: true },
    { id: 'TAX', group: 'OPS', name: 'Impuestos', desc: 'Traslado IVA y exentos en líneas', editable: true },
    { id: 'DOC_TYPE', group: 'OPS', name: 'Tipos de documento', desc: 'Clasificación de expediente y adjuntos', editable: true },
    { id: 'SAT_USO_CFDI', group: 'SAT', name: 'Uso CFDI', desc: 'c_UsoCFDI · solo lectura SAT', editable: false },
    { id: 'SAT_FORMA_PAGO', group: 'SAT', name: 'Forma de pago', desc: 'c_FormaPago · solo lectura SAT', editable: false },
    { id: 'SAT_REGIMEN', group: 'SAT', name: 'Régimen fiscal', desc: 'c_RegimenFiscal · solo lectura SAT', editable: false }
  ];

  const DEMO_CATALOG_ITEMS = {
    CURRENCY: [
      { code: 'MXN', name: 'Peso mexicano', active: true },
      { code: 'USD', name: 'Dólar estadounidense', active: true }
    ],
    UOM: [
      { code: 'PZA', name: 'Pieza', active: true },
      { code: 'KG', name: 'Kilogramo', active: true },
      { code: 'M', name: 'Metro', active: true },
      { code: 'LT', name: 'Litro', active: true },
      { code: 'SERV', name: 'Servicio', active: true },
      { code: 'HRA', name: 'Hora', active: false }
    ],
    PAYMENT_TERMS: [
      { code: 'CONTADO', name: 'Contado', active: true },
      { code: 'NET15', name: 'Neto 15 días', active: true },
      { code: 'NET30', name: 'Neto 30 días', active: true },
      { code: 'NET45', name: 'Neto 45 días', active: true }
    ],
    TAX: [
      { code: 'IVA16', name: 'IVA 16%', active: true },
      { code: 'IVA0', name: 'IVA 0%', active: true },
      { code: 'EXENTO', name: 'Exento', active: true }
    ],
    DOC_TYPE: [
      { code: 'COT', name: 'Cotización', active: true },
      { code: 'OC', name: 'Orden de compra', active: true },
      { code: 'FACT', name: 'Factura', active: true },
      { code: 'CFDI_PDF', name: 'CFDI PDF', active: true },
      { code: 'CFDI_XML', name: 'CFDI XML', active: true },
      { code: 'REC', name: 'Recepción', active: true },
      { code: 'CONTRATO', name: 'Contrato', active: true },
      { code: 'OTRO', name: 'Otro', active: true }
    ],
    SAT_USO_CFDI: [
      { code: 'G01', name: 'Adquisición de mercancías', active: true },
      { code: 'G03', name: 'Gastos en general', active: true },
      { code: 'I04', name: 'Equipo de cómputo y accesorios', active: true },
      { code: 'S01', name: 'Sin efectos fiscales', active: true },
      { code: 'CP01', name: 'Pagos', active: true }
    ],
    SAT_FORMA_PAGO: [
      { code: '01', name: 'Efectivo', active: true },
      { code: '02', name: 'Cheque nominativo', active: true },
      { code: '03', name: 'Transferencia electrónica de fondos', active: true },
      { code: '04', name: 'Tarjeta de crédito', active: true },
      { code: '28', name: 'Tarjeta de débito', active: true },
      { code: '99', name: 'Por definir', active: true }
    ],
    SAT_REGIMEN: [
      { code: '601', name: 'General de Ley Personas Morales', active: true },
      { code: '612', name: 'Personas Físicas con Actividades Empresariales y Profesionales', active: true },
      { code: '626', name: 'Régimen Simplificado de Confianza', active: true },
      { code: '616', name: 'Sin obligaciones fiscales', active: true }
    ]
  };

  const IAM_MODULES = [
    { code: 'core.shell', name: 'Inicio / shell', area: 'Plataforma' },
    { code: 'core.workflow', name: 'Bandeja de aprobación', area: 'Plataforma' },
    { code: 'core.catalog', name: 'Catálogos', area: 'Administración' },
    { code: 'core.iam', name: 'Usuarios y permisos', area: 'Administración' },
    { code: 'core.document', name: 'Documentos', area: 'Plataforma' },
    { code: 'core.audit', name: 'Auditoría', area: 'Plataforma' },
    { code: 'core.report', name: 'Reportes', area: 'Plataforma' },
    { code: 'erp.procurement', name: 'Compras', area: 'Operación' },
    { code: 'erp.inventory', name: 'Inventarios', area: 'Operación' },
    { code: 'erp.ar', name: 'Ventas / CxC', area: 'Operación' },
    { code: 'erp.ap', name: 'Cuentas por pagar', area: 'Finanzas' },
    { code: 'erp.billing', name: 'Facturación', area: 'Finanzas' },
    { code: 'erp.accounting', name: 'Contabilidad', area: 'Finanzas' },
    { code: 'erp.treasury', name: 'Tesorería', area: 'Finanzas' }
  ];

  const DEMO_IAM_ROLES = [
    {
      code: 'ADM', name: 'Administrador',
      desc: 'Usuarios, catálogos, organización y lectura amplia.',
      permissions: ['*.read', '*.write', 'iam.admin', 'catalog.admin']
    },
    {
      code: 'BUY', name: 'Compras',
      desc: 'Requisiciones, OC y seguimiento de recepción.',
      permissions: ['procurement.read', 'procurement.write', 'inventory.read', 'workflow.approve']
    },
    {
      code: 'AP', name: 'Cuentas por pagar',
      desc: 'Facturas proveedor, match y propuestas de pago.',
      permissions: ['ap.read', 'ap.write', 'ap.post', 'workflow.approve']
    },
    {
      code: 'TRE', name: 'Tesorería',
      desc: 'Ejecución de pagos y conciliación (maker).',
      permissions: ['treasury.read', 'treasury.execute', 'workflow.approve']
    },
    {
      code: 'APPR', name: 'Aprobador',
      desc: 'Bandeja de aprobaciones por umbral.',
      permissions: ['workflow.approve', '*.read']
    }
  ];

  const DEMO_IAM_USERS = [
    {
      username: 'admin.acme', displayName: 'Administrador ACME', email: 'admin@acme.mx',
      role: 'ADM', status: 'ACTIVE',
      modules: IAM_MODULES.map((m) => m.code)
    },
    {
      username: 'compras.acme', displayName: 'Compras ACME', email: 'compras@acme.mx',
      role: 'BUY', status: 'ACTIVE',
      modules: ['core.shell', 'core.workflow', 'core.catalog', 'erp.procurement', 'erp.inventory']
    },
    {
      username: 'cxp.acme', displayName: 'CxP ACME', email: 'cxp@acme.mx',
      role: 'AP', status: 'ACTIVE',
      modules: ['core.shell', 'core.workflow', 'erp.ap', 'erp.treasury', 'core.audit']
    },
    {
      username: 'gerente.acme', displayName: 'Gerente ACME', email: 'gerente@acme.mx',
      role: 'APPR', status: 'LOCKED',
      modules: ['core.shell', 'core.workflow', 'erp.procurement', 'core.report']
    }
  ];

  const DEMO_ROLE_MODULES = {
    ADM: IAM_MODULES.map((m) => m.code),
    BUY: ['core.shell', 'core.workflow', 'core.catalog', 'erp.procurement', 'erp.inventory'],
    AP: ['core.shell', 'core.workflow', 'erp.ap', 'erp.treasury', 'core.audit'],
    TRE: ['core.shell', 'core.workflow', 'erp.treasury', 'erp.ap', 'core.audit'],
    APPR: ['core.shell', 'core.workflow', 'erp.procurement', 'core.report']
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

  const TASKS_VERSION = '2';
  const loadTasks = () => {
    try {
      const ver = sessionStorage.getItem(TASKS_KEY + ':ver:' + userKey);
      const raw = sessionStorage.getItem(TASKS_KEY + ':' + userKey);
      if (raw && ver === TASKS_VERSION) return JSON.parse(raw);
    } catch { /* seed */ }
    const seed = DEMO_TASKS[userKey].map((t) => ({ ...t }));
    sessionStorage.setItem(TASKS_KEY + ':' + userKey, JSON.stringify(seed));
    sessionStorage.setItem(TASKS_KEY + ':ver:' + userKey, TASKS_VERSION);
    return seed;
  };
  let tasks = loadTasks();
  const saveTasks = () => sessionStorage.setItem(TASKS_KEY + ':' + userKey, JSON.stringify(tasks));

  const CATS_KEY = 'erp_catalog_items';
  const CATS_VERSION = '1';
  const loadCatalogItems = () => {
    try {
      const ver = sessionStorage.getItem(CATS_KEY + ':ver');
      const raw = sessionStorage.getItem(CATS_KEY);
      if (raw && ver === CATS_VERSION) return JSON.parse(raw);
    } catch { /* seed */ }
    const seed = {};
    Object.keys(DEMO_CATALOG_ITEMS).forEach((k) => {
      seed[k] = DEMO_CATALOG_ITEMS[k].map((it) => ({ ...it }));
    });
    sessionStorage.setItem(CATS_KEY, JSON.stringify(seed));
    sessionStorage.setItem(CATS_KEY + ':ver', CATS_VERSION);
    return seed;
  };
  let catalogItems = loadCatalogItems();
  const saveCatalogItems = () => sessionStorage.setItem(CATS_KEY, JSON.stringify(catalogItems));
  let selectedCatalogId = null;
  let editingCatCode = null;

  const IAM_KEY = 'erp_iam_state';
  const IAM_VERSION = '1';
  const loadIamState = () => {
    try {
      const ver = sessionStorage.getItem(IAM_KEY + ':ver');
      const raw = sessionStorage.getItem(IAM_KEY);
      if (raw && ver === IAM_VERSION) return JSON.parse(raw);
    } catch { /* seed */ }
    const seed = {
      users: DEMO_IAM_USERS.map((u) => ({ ...u, modules: [...u.modules] })),
      roleModules: Object.fromEntries(
        Object.entries(DEMO_ROLE_MODULES).map(([k, v]) => [k, [...v]])
      )
    };
    sessionStorage.setItem(IAM_KEY, JSON.stringify(seed));
    sessionStorage.setItem(IAM_KEY + ':ver', IAM_VERSION);
    return seed;
  };
  let iamState = loadIamState();
  const saveIamState = () => sessionStorage.setItem(IAM_KEY, JSON.stringify(iamState));
  let iamTab = 'USERS';
  let editingUsername = null;

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
    catalogos: document.querySelector('[data-page="catalogos"]'),
    usuarios: document.querySelector('[data-page="usuarios"]'),
    stub: document.querySelector('[data-page="stub"]')
  };
  const backHomeFromUsuarios = document.getElementById('backHomeFromUsuarios');
  const iamUserBody = document.getElementById('iamUserBody');
  const iamUserSearch = document.getElementById('iamUserSearch');
  const iamUserStatus = document.getElementById('iamUserStatus');
  const iamUserFilters = document.getElementById('iamUserFilters');
  const iamUsersPanel = document.getElementById('iamUsersPanel');
  const iamRolesPanel = document.getElementById('iamRolesPanel');
  const iamModulesPanel = document.getElementById('iamModulesPanel');
  const userModal = document.getElementById('userModal');
  const userModalScrim = document.getElementById('userModalScrim');
  const userFormUsername = document.getElementById('userFormUsername');
  const userFormName = document.getElementById('userFormName');
  const userFormEmail = document.getElementById('userFormEmail');
  const userFormRole = document.getElementById('userFormRole');
  const userFormActive = document.getElementById('userFormActive');
  const userFormModules = document.getElementById('userFormModules');
  const userFormMsg = document.getElementById('userFormMsg');
  const stubTitle = document.getElementById('stubTitle');
  const backHomeBtn = document.getElementById('backHomeBtn');
  const backHomeFromBandeja = document.getElementById('backHomeFromBandeja');
  const backHomeFromCatalogos = document.getElementById('backHomeFromCatalogos');
  const catalogHub = document.getElementById('catalogHub');
  const catalogDetail = document.getElementById('catalogDetail');
  const catOpsGrid = document.getElementById('catOpsGrid');
  const catSatGrid = document.getElementById('catSatGrid');
  const catItemBody = document.getElementById('catItemBody');
  const catItemSearch = document.getElementById('catItemSearch');
  const catActiveFilter = document.getElementById('catActiveFilter');
  const btnNewCatItem = document.getElementById('btnNewCatItem');
  const catModal = document.getElementById('catModal');
  const catModalScrim = document.getElementById('catModalScrim');
  const catFormCode = document.getElementById('catFormCode');
  const catFormName = document.getElementById('catFormName');
  const catFormActive = document.getElementById('catFormActive');
  const catFormMsg = document.getElementById('catFormMsg');
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
  const btnApprove = document.getElementById('btnApprove');
  const btnReject = document.getElementById('btnReject');
  const btnViewDoc = document.getElementById('btnViewDoc');
  const btnDetalle = document.getElementById('btnDetalle');
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

  const showCatalogos = (catalogId) => {
    hideAllPages();
    pages.catalogos.hidden = false;
    document.title = 'ERP · Catálogos';
    setActiveRoute('/catalogos');
    setDrawer(false);
    if (catalogId) {
      selectedCatalogId = catalogId;
      showCatalogDetail();
    } else {
      selectedCatalogId = null;
      showCatalogHub();
    }
  };

  const showUsuarios = () => {
    hideAllPages();
    pages.usuarios.hidden = false;
    document.title = 'ERP · Usuarios y permisos';
    setActiveRoute('/usuarios');
    setDrawer(false);
    renderIam();
  };

  const showStub = (label, route) => {
    if ((route || '') === '/bandeja' || (label || '').toLowerCase().includes('bandeja')) {
      showBandeja();
      return;
    }
    if ((route || '') === '/catalogos' || (label || '').toLowerCase().includes('catálogo')) {
      showCatalogos();
      return;
    }
    if ((route || '') === '/usuarios' || (label || '').toLowerCase().includes('usuario')) {
      showUsuarios();
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
    if ((route || '') === '/catalogos') {
      showCatalogos();
      return;
    }
    if ((route || '') === '/usuarios') {
      showUsuarios();
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
  backHomeFromCatalogos.addEventListener('click', () => showDashboard());
  backHomeFromUsuarios.addEventListener('click', () => showDashboard());
  document.getElementById('backCatalogHub').addEventListener('click', () => {
    selectedCatalogId = null;
    showCatalogHub();
  });

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
      if (bandejaTab === 'APPROVED' && !(t.status === 'DONE' && t.decision === 'APPROVED')) return false;
      if (bandejaTab === 'REJECTED' && !(t.status === 'DONE' && t.decision === 'REJECTED')) return false;
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
    decisionComment.disabled = !canDecide;
    detailActions.hidden = false;
    btnApprove.hidden = !canDecide;
    btnReject.hidden = !canDecide;
    btnViewDoc.hidden = !canDecide;
    btnDetalle.hidden = false;
    if (!canDecide) {
      decisionMsg.hidden = false;
      decisionMsg.textContent = 'Estado: ' + decisionLabel(task) +
        (task.comment ? ' · ' + task.comment : '') +
        ' · usa Detalle para ver el expediente.';
    }
  };

  const renderBandeja = () => {
    const list = filteredTasks();
    bandejaListTitle.textContent = bandejaTab === 'OPEN'
      ? 'Pendientes'
      : bandejaTab === 'APPROVED'
        ? 'Aprobadas'
        : 'Rechazadas';
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

  btnApprove.addEventListener('click', () => decide('APPROVED'));
  btnReject.addEventListener('click', () => decide('REJECTED'));
  btnViewDoc.addEventListener('click', () => {
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task) return;
    decisionMsg.hidden = false;
    decisionMsg.textContent = 'Vista de documento stub · ' + task.folio + ' (' + task.process + '). Se conectará al módulo en una fase posterior.';
  });
  btnDetalle.addEventListener('click', () => {
    openTxModal(tasks.find((t) => t.id === selectedTaskId));
  });
  document.getElementById('txModalClose').addEventListener('click', () => setTxModal(false));
  document.getElementById('txModalOk').addEventListener('click', () => setTxModal(false));
  txModalScrim.addEventListener('click', () => setTxModal(false));

  const currentCatalogDef = () => CATALOG_DEFS.find((c) => c.id === selectedCatalogId) || null;

  const showCatalogHub = () => {
    catalogHub.hidden = false;
    catalogDetail.hidden = true;
    const renderCards = (group, target) => {
      const defs = CATALOG_DEFS.filter((c) => c.group === group);
      target.innerHTML = defs.map((c) => {
        const count = (catalogItems[c.id] || []).length;
        const active = (catalogItems[c.id] || []).filter((i) => i.active).length;
        return `
          <button type="button" class="cat-card" data-id="${c.id}">
            <div class="cat-code">${c.id}</div>
            <h3>${c.name}</h3>
            <p>${c.desc}</p>
            <div class="cat-meta">
              <span class="count-badge">${count}</span>
              <span class="pill soft">${active} activos</span>
              <span class="pill soft">${c.editable ? 'Editable' : 'SAT'}</span>
            </div>
          </button>`;
      }).join('');
      target.querySelectorAll('.cat-card').forEach((el) => {
        el.addEventListener('click', () => {
          selectedCatalogId = el.dataset.id;
          showCatalogDetail();
        });
      });
    };
    renderCards('OPS', catOpsGrid);
    renderCards('SAT', catSatGrid);
  };

  const filteredCatalogItems = () => {
    const items = catalogItems[selectedCatalogId] || [];
    const q = (catItemSearch.value || '').trim().toLowerCase();
    const af = catActiveFilter.value;
    return items.filter((it) => {
      if (af === '1' && !it.active) return false;
      if (af === '0' && it.active) return false;
      if (q) {
        const hay = (it.code + ' ' + it.name).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  };

  const renderCatalogItems = () => {
    const def = currentCatalogDef();
    if (!def) return;
    const list = filteredCatalogItems();
    document.getElementById('catItemCount').textContent = String(list.length);
    if (!list.length) {
      catItemBody.innerHTML = '<tr><td colspan="4" class="empty">No hay ítems con estos filtros.</td></tr>';
      return;
    }
    catItemBody.innerHTML = list.map((it) => `
      <tr>
        <td><strong>${it.code}</strong></td>
        <td>${it.name}</td>
        <td><span class="tag ${it.active ? 'ok' : 'med'}">${it.active ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <div class="row-actions">
            ${def.editable ? `<button type="button" class="link-btn" data-act="edit" data-code="${it.code}">Editar</button>
            <button type="button" class="link-btn ${it.active ? 'danger' : ''}" data-act="toggle" data-code="${it.code}">${it.active ? 'Desactivar' : 'Activar'}</button>` : '<span class="muted">Solo lectura</span>'}
          </div>
        </td>
      </tr>
    `).join('');
    catItemBody.querySelectorAll('[data-act]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        const item = (catalogItems[selectedCatalogId] || []).find((i) => i.code === code);
        if (!item) return;
        if (btn.dataset.act === 'edit') openCatModal(item);
        if (btn.dataset.act === 'toggle') {
          item.active = !item.active;
          saveCatalogItems();
          renderCatalogItems();
        }
      });
    });
  };

  const showCatalogDetail = () => {
    const def = currentCatalogDef();
    if (!def) {
      showCatalogHub();
      return;
    }
    catalogHub.hidden = true;
    catalogDetail.hidden = false;
    document.getElementById('catDetailTitle').textContent = def.name;
    document.getElementById('catDetailSub').textContent = def.desc + ' · ' + def.id;
    document.getElementById('catDetailNote').textContent = def.editable
      ? 'Carcasa demo · cambios locales en esta sesión.'
      : 'Catálogo SAT · seed de consulta (no editable en MVP).';
    btnNewCatItem.hidden = !def.editable;
    catItemSearch.value = '';
    catActiveFilter.value = '';
    renderCatalogItems();
  };

  const setCatModal = (open) => {
    catModal.hidden = !open;
    catModalScrim.hidden = !open;
    requestAnimationFrame(() => {
      catModal.classList.toggle('is-open', open);
      catModalScrim.classList.toggle('is-open', open);
    });
    if (!open) {
      catModal.classList.remove('is-open');
      catModalScrim.classList.remove('is-open');
    }
  };

  const openCatModal = (item) => {
    const def = currentCatalogDef();
    if (!def || !def.editable) return;
    editingCatCode = item ? item.code : null;
    document.getElementById('catModalTitle').textContent = item ? 'Editar ítem' : 'Nuevo ítem';
    catFormCode.value = item ? item.code : '';
    catFormCode.disabled = !!item;
    catFormName.value = item ? item.name : '';
    catFormActive.checked = item ? !!item.active : true;
    catFormMsg.hidden = true;
    setCatModal(true);
    (item ? catFormName : catFormCode).focus();
  };

  const saveCatItem = () => {
    const def = currentCatalogDef();
    if (!def || !def.editable) return;
    const code = (catFormCode.value || '').trim().toUpperCase();
    const name = (catFormName.value || '').trim();
    if (!code || code.length < 1) {
      catFormMsg.hidden = false;
      catFormMsg.textContent = 'El código es obligatorio.';
      catFormCode.focus();
      return;
    }
    if (!name || name.length < 2) {
      catFormMsg.hidden = false;
      catFormMsg.textContent = 'El nombre debe tener al menos 2 caracteres.';
      catFormName.focus();
      return;
    }
    if (!catalogItems[selectedCatalogId]) catalogItems[selectedCatalogId] = [];
    const list = catalogItems[selectedCatalogId];
    if (!editingCatCode && list.some((i) => i.code === code)) {
      catFormMsg.hidden = false;
      catFormMsg.textContent = 'Ya existe un ítem con ese código.';
      return;
    }
    if (editingCatCode) {
      const row = list.find((i) => i.code === editingCatCode);
      if (row) {
        row.name = name;
        row.active = catFormActive.checked;
      }
    } else {
      list.push({ code, name, active: catFormActive.checked });
    }
    saveCatalogItems();
    setCatModal(false);
    renderCatalogItems();
  };

  btnNewCatItem.addEventListener('click', () => openCatModal(null));
  catItemSearch.addEventListener('input', renderCatalogItems);
  catActiveFilter.addEventListener('change', renderCatalogItems);
  document.getElementById('catModalClose').addEventListener('click', () => setCatModal(false));
  document.getElementById('catModalCancel').addEventListener('click', () => setCatModal(false));
  document.getElementById('catModalSave').addEventListener('click', saveCatItem);
  catModalScrim.addEventListener('click', () => setCatModal(false));

  const roleName = (code) => (DEMO_IAM_ROLES.find((r) => r.code === code) || {}).name || code;

  const setIamTab = (tab) => {
    iamTab = tab;
    document.querySelectorAll('[data-iam-tab]').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.iamTab === tab);
    });
    iamUsersPanel.hidden = tab !== 'USERS';
    iamRolesPanel.hidden = tab !== 'ROLES';
    iamModulesPanel.hidden = tab !== 'MODULES';
    iamUserFilters.hidden = tab !== 'USERS';
    renderIam();
  };

  const filteredIamUsers = () => {
    const q = (iamUserSearch.value || '').trim().toLowerCase();
    const st = iamUserStatus.value;
    return iamState.users.filter((u) => {
      if (st && u.status !== st) return false;
      if (q) {
        const hay = [u.username, u.displayName, u.email, u.role].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  };

  const renderIamUsers = () => {
    const list = filteredIamUsers();
    document.getElementById('iamUserCount').textContent = String(list.length);
    if (!list.length) {
      iamUserBody.innerHTML = '<tr><td colspan="6" class="empty">No hay usuarios con estos filtros.</td></tr>';
      return;
    }
    iamUserBody.innerHTML = list.map((u) => `
      <tr>
        <td><strong>${u.username}</strong></td>
        <td>${u.displayName}<div class="muted">${u.email || ''}</div></td>
        <td><span class="pill soft">${roleName(u.role)}</span></td>
        <td>${(u.modules || []).length}</td>
        <td><span class="tag ${u.status === 'ACTIVE' ? 'ok' : 'high'}">${u.status === 'ACTIVE' ? 'Activo' : 'Bloqueado'}</span></td>
        <td>
          <div class="row-actions">
            <button type="button" class="link-btn" data-iam-act="edit" data-user="${u.username}">Editar</button>
            <button type="button" class="link-btn ${u.status === 'ACTIVE' ? 'danger' : ''}" data-iam-act="toggle" data-user="${u.username}">
              ${u.status === 'ACTIVE' ? 'Bloquear' : 'Activar'}
            </button>
          </div>
        </td>
      </tr>
    `).join('');
    iamUserBody.querySelectorAll('[data-iam-act]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = iamState.users.find((x) => x.username === btn.dataset.user);
        if (!row) return;
        if (btn.dataset.iamAct === 'edit') openUserModal(row);
        if (btn.dataset.iamAct === 'toggle') {
          row.status = row.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
          saveIamState();
          renderIamUsers();
        }
      });
    });
  };

  const renderIamRoles = () => {
    document.getElementById('iamRoleCount').textContent = String(DEMO_IAM_ROLES.length);
    const list = document.getElementById('iamRolesList');
    list.innerHTML = DEMO_IAM_ROLES.map((r) => {
      const mods = iamState.roleModules[r.code] || [];
      return `
        <article class="iam-role-card">
          <div class="detail-top">
            <span class="pill soft">${r.code}</span>
            <span class="count-badge">${mods.length} módulos</span>
          </div>
          <h3>${r.name}</h3>
          <p>${r.desc}</p>
          <div class="iam-chips">
            ${r.permissions.map((p) => `<span class="pill soft">${p}</span>`).join('')}
          </div>
          <div class="iam-chips" style="margin-top:8px">
            ${mods.map((m) => `<span class="tag info">${m.replace('erp.', '').replace('core.', '')}</span>`).join('') || '<span class="muted">Sin módulos</span>'}
          </div>
        </article>`;
    }).join('');
  };

  const renderIamMatrix = () => {
    const roles = DEMO_IAM_ROLES;
    const head = document.getElementById('iamMatrixHead');
    const body = document.getElementById('iamMatrixBody');
    head.innerHTML = `<tr><th>Módulo</th>${roles.map((r) => `<th>${r.code}</th>`).join('')}</tr>`;
    body.innerHTML = IAM_MODULES.map((mod) => `
      <tr>
        <td>
          <strong>${mod.name}</strong>
          <div class="muted">${mod.code} · ${mod.area}</div>
        </td>
        ${roles.map((r) => {
          const on = (iamState.roleModules[r.code] || []).includes(mod.code);
          return `<td><input type="checkbox" data-role="${r.code}" data-mod="${mod.code}" ${on ? 'checked' : ''}/></td>`;
        }).join('')}
      </tr>
    `).join('');
    body.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      box.addEventListener('change', () => {
        const role = box.dataset.role;
        const mod = box.dataset.mod;
        if (!iamState.roleModules[role]) iamState.roleModules[role] = [];
        const arr = iamState.roleModules[role];
        if (box.checked && !arr.includes(mod)) arr.push(mod);
        if (!box.checked) iamState.roleModules[role] = arr.filter((x) => x !== mod);
        // sync users that have this role default modules only if user modules equalled old role set — keep simple: update users with same role
        iamState.users.forEach((u) => {
          if (u.role === role) u.modules = [...iamState.roleModules[role]];
        });
        saveIamState();
        document.getElementById('iamMatrixNote').textContent =
          'Matriz actualizada · usuarios del rol ' + role + ' sincronizados en esta sesión.';
      });
    });
  };

  const renderIam = () => {
    if (iamTab === 'USERS') renderIamUsers();
    if (iamTab === 'ROLES') renderIamRoles();
    if (iamTab === 'MODULES') renderIamMatrix();
  };

  const setUserModal = (open) => {
    userModal.hidden = !open;
    userModalScrim.hidden = !open;
    requestAnimationFrame(() => {
      userModal.classList.toggle('is-open', open);
      userModalScrim.classList.toggle('is-open', open);
    });
    if (!open) {
      userModal.classList.remove('is-open');
      userModalScrim.classList.remove('is-open');
    }
  };

  const fillUserFormModules = (selected) => {
    const set = new Set(selected || []);
    userFormModules.innerHTML = IAM_MODULES.map((m) => `
      <label>
        <input type="checkbox" value="${m.code}" ${set.has(m.code) ? 'checked' : ''}/>
        <span><strong>${m.name}</strong><span>${m.code}</span></span>
      </label>
    `).join('');
  };

  const openUserModal = (row) => {
    editingUsername = row ? row.username : null;
    document.getElementById('userModalTitle').textContent = row ? 'Editar usuario' : 'Nuevo usuario';
    userFormRole.innerHTML = DEMO_IAM_ROLES.map((r) =>
      `<option value="${r.code}">${r.code} · ${r.name}</option>`
    ).join('');
    userFormUsername.value = row ? row.username : '';
    userFormUsername.disabled = !!row;
    userFormName.value = row ? row.displayName : '';
    userFormEmail.value = row ? (row.email || '') : '';
    userFormRole.value = row ? row.role : 'BUY';
    userFormActive.checked = row ? row.status === 'ACTIVE' : true;
    fillUserFormModules(row ? row.modules : (iamState.roleModules.BUY || []));
    userFormMsg.hidden = true;
    setUserModal(true);
  };

  userFormRole.addEventListener('change', () => {
    fillUserFormModules(iamState.roleModules[userFormRole.value] || []);
  });

  const saveUserForm = () => {
    const username = (userFormUsername.value || '').trim().toLowerCase();
    const displayName = (userFormName.value || '').trim();
    const email = (userFormEmail.value || '').trim();
    const role = userFormRole.value;
    const modules = [...userFormModules.querySelectorAll('input:checked')].map((el) => el.value);
    if (!username || username.length < 3) {
      userFormMsg.hidden = false;
      userFormMsg.textContent = 'El usuario debe tener al menos 3 caracteres.';
      return;
    }
    if (!displayName || displayName.length < 2) {
      userFormMsg.hidden = false;
      userFormMsg.textContent = 'El nombre es obligatorio.';
      return;
    }
    if (!editingUsername && iamState.users.some((u) => u.username === username)) {
      userFormMsg.hidden = false;
      userFormMsg.textContent = 'Ya existe ese usuario.';
      return;
    }
    if (editingUsername) {
      const row = iamState.users.find((u) => u.username === editingUsername);
      if (row) {
        row.displayName = displayName;
        row.email = email;
        row.role = role;
        row.status = userFormActive.checked ? 'ACTIVE' : 'LOCKED';
        row.modules = modules;
      }
    } else {
      iamState.users.push({
        username, displayName, email, role,
        status: userFormActive.checked ? 'ACTIVE' : 'LOCKED',
        modules
      });
    }
    saveIamState();
    setUserModal(false);
    renderIamUsers();
  };

  document.querySelectorAll('[data-iam-tab]').forEach((tab) => {
    tab.addEventListener('click', () => setIamTab(tab.dataset.iamTab));
  });
  iamUserSearch.addEventListener('input', renderIamUsers);
  iamUserStatus.addEventListener('change', renderIamUsers);
  document.getElementById('btnNewUser').addEventListener('click', () => openUserModal(null));
  document.getElementById('userModalClose').addEventListener('click', () => setUserModal(false));
  document.getElementById('userModalCancel').addEventListener('click', () => setUserModal(false));
  document.getElementById('userModalSave').addEventListener('click', saveUserForm);
  userModalScrim.addEventListener('click', () => setUserModal(false));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!txModal.hidden) setTxModal(false);
    if (!catModal.hidden) setCatModal(false);
    if (!userModal.hidden) setUserModal(false);
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
