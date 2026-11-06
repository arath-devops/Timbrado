/* Simulated production data — Municipio de Ejemplo */
window.ERP = window.ERP || {};

ERP.session = {
  user: {
    id: 'USR-0001',
    name: 'Lic. Mariana del Carmen Ríos',
    short: 'MR',
    email: 'mariana.rios@municipioejemplo.gob.mx',
    role: 'Director de Administración Municipal',
    roles: ['ADMIN', 'DIR_ADMIN', 'PUR_APPROVER', 'BUDGET_VIEW'],
    orgUnit: 'Dirección de Administración',
    tenant: 'Municipio de Ejemplo',
    tenantId: 'ten_mun_ejemplo',
    rfc: 'MEM850101XXX'
  },
  notifications: [
    { id: 1, title: 'Solicitud SC-2026-0148 pendiente de su aprobación', time: 'hace 12 min', critical: true, href: '#/compras/solicitudes/SC-2026-0148' },
    { id: 2, title: 'Compromiso presupuestal CP-2026-0089 registrado', time: 'hace 1 h', critical: false, href: '#/presupuesto/compromisos' },
    { id: 3, title: 'Documento expediente EXP-COMP-0148 versionado', time: 'hace 2 h', critical: false, href: '#/documentos/expedientes/EXP-COMP-0148' },
    { id: 4, title: 'Alerta: partida 2211 al 92% de ejercicio', time: 'hace 3 h', critical: true, href: '#/presupuesto/partidas' },
    { id: 5, title: 'Recepción parcial OC-2026-0042', time: 'ayer', critical: false, href: '#/compras/ordenes/OC-2026-0042' }
  ],
  favorites: [
    { label: 'Bandeja de aprobación', href: '#/workflow/bandeja' },
    { label: 'Nueva solicitud de compra', href: '#/compras/solicitudes/nueva' },
    { label: 'Disponibilidad presupuestal', href: '#/presupuesto/disponibilidad' },
    { label: 'Expedientes de compra', href: '#/documentos/expedientes' }
  ]
};

ERP.orgUnits = [
  { id: 'OU-001', code: 'ADM', name: 'Dirección de Administración', type: 'Dirección', parent: 'Municipio', head: 'Lic. Mariana Ríos', people: 48, status: 'Activa' },
  { id: 'OU-002', code: 'TES', name: 'Tesorería Municipal', type: 'Dependencia', parent: 'Municipio', head: 'C.P. Héctor Valdez', people: 36, status: 'Activa' },
  { id: 'OU-003', code: 'COM', name: 'Coordinación de Compras', type: 'Coordinación', parent: 'Dirección de Administración', head: 'Ing. Sofía Mendoza', people: 14, status: 'Activa' },
  { id: 'OU-004', code: 'CTR', name: 'Contraloría Municipal', type: 'Dependencia', parent: 'Municipio', head: 'Lic. Patricia Núñez', people: 22, status: 'Activa' },
  { id: 'OU-005', code: 'OBP', name: 'Dirección de Obras Públicas', type: 'Dirección', parent: 'Municipio', head: 'Arq. Luis Ortega', people: 61, status: 'Activa' },
  { id: 'OU-006', code: 'COM-MAT', name: 'Departamento de Materiales', type: 'Departamento', parent: 'Coordinación de Compras', head: 'Lic. Ana Beltrán', people: 7, status: 'Activa' },
  { id: 'OU-007', code: 'TES-PAG', name: 'Departamento de Pagos', type: 'Departamento', parent: 'Tesorería Municipal', head: 'C.P. Diana Soto', people: 9, status: 'Activa' }
];

ERP.positions = [
  { id: 'P-01', name: 'Director(a) de Administración', ou: 'Dirección de Administración', level: 'Directivo', occupied: true },
  { id: 'P-02', name: 'Coordinador(a) de Compras', ou: 'Coordinación de Compras', level: 'Mandos medios', occupied: true },
  { id: 'P-03', name: 'Analista de Compras', ou: 'Departamento de Materiales', level: 'Operativo', occupied: true },
  { id: 'P-04', name: 'Tesorero(a) Municipal', ou: 'Tesorería Municipal', level: 'Directivo', occupied: true },
  { id: 'P-05', name: 'Contralor(a) Municipal', ou: 'Contraloría Municipal', level: 'Directivo', occupied: true },
  { id: 'P-06', name: 'Jefe(a) de Pagos', ou: 'Departamento de Pagos', level: 'Mandos medios', occupied: true }
];

ERP.officials = [
  { id: 'F-01', name: 'Lic. Mariana del Carmen Ríos', position: 'Director(a) de Administración', ou: 'Dirección de Administración', email: 'mariana.rios@municipioejemplo.gob.mx', status: 'Activo' },
  { id: 'F-02', name: 'Ing. Sofía Mendoza Lara', position: 'Coordinador(a) de Compras', ou: 'Coordinación de Compras', email: 'sofia.mendoza@municipioejemplo.gob.mx', status: 'Activo' },
  { id: 'F-03', name: 'Lic. Ana Beltrán Cruz', position: 'Analista de Compras', ou: 'Departamento de Materiales', email: 'ana.beltran@municipioejemplo.gob.mx', status: 'Activo' },
  { id: 'F-04', name: 'C.P. Héctor Valdez Ruiz', position: 'Tesorero(a) Municipal', ou: 'Tesorería Municipal', email: 'hector.valdez@municipioejemplo.gob.mx', status: 'Activo' },
  { id: 'F-05', name: 'Lic. Patricia Núñez Gómez', position: 'Contralor(a) Municipal', ou: 'Contraloría Municipal', email: 'patricia.nunez@municipioejemplo.gob.mx', status: 'Activo' },
  { id: 'F-06', name: 'Arq. Luis Ortega Peña', position: 'Director(a) de Obras Públicas', ou: 'Dirección de Obras Públicas', email: 'luis.ortega@municipioejemplo.gob.mx', status: 'Activo' },
  { id: 'F-07', name: 'C.P. Diana Soto Méndez', position: 'Jefe(a) de Pagos', ou: 'Departamento de Pagos', email: 'diana.soto@municipioejemplo.gob.mx', status: 'Activo' }
];

ERP.users = [
  { id: 'USR-0001', username: 'mrios', name: 'Mariana Ríos', roles: 'ADMIN, DIR_ADMIN', ou: 'Administración', status: 'ACTIVE', lastLogin: '2026-11-05 14:02' },
  { id: 'USR-0002', username: 'smendoza', name: 'Sofía Mendoza', roles: 'PUR_BUYER, PUR_APPROVER', ou: 'Compras', status: 'ACTIVE', lastLogin: '2026-11-05 13:40' },
  { id: 'USR-0003', username: 'abeltran', name: 'Ana Beltrán', roles: 'PUR_REQUESTER', ou: 'Compras', status: 'ACTIVE', lastLogin: '2026-11-05 11:18' },
  { id: 'USR-0004', username: 'hvaldez', name: 'Héctor Valdez', roles: 'BUDGET_OPS, TREASURY', ou: 'Tesorería', status: 'ACTIVE', lastLogin: '2026-11-05 09:55' },
  { id: 'USR-0005', username: 'pnunez', name: 'Patricia Núñez', roles: 'AUDITOR', ou: 'Contraloría', status: 'ACTIVE', lastLogin: '2026-11-04 17:22' },
  { id: 'USR-0006', username: 'lortega', name: 'Luis Ortega', roles: 'PUR_REQUESTER', ou: 'Obras Públicas', status: 'LOCKED', lastLogin: '2026-10-28 10:01' }
];

ERP.roles = [
  { code: 'ADMIN', name: 'Administrador del tenant', perms: 42, users: 1 },
  { code: 'DIR_ADMIN', name: 'Director de Administración', perms: 28, users: 1 },
  { code: 'PUR_REQUESTER', name: 'Solicitante de compras', perms: 12, users: 18 },
  { code: 'PUR_BUYER', name: 'Comprador', perms: 16, users: 6 },
  { code: 'PUR_APPROVER', name: 'Aprobador de compras', perms: 14, users: 5 },
  { code: 'BUDGET_OPS', name: 'Operaciones presupuestales', perms: 18, users: 4 },
  { code: 'AUDITOR', name: 'Auditor / Contraloría', perms: 20, users: 3 }
];

ERP.permissions = [
  'iam.users.read', 'iam.users.write', 'iam.roles.assign',
  'org.units.read', 'org.units.write',
  'catalog.read', 'catalog.write',
  'workflow.inbox', 'workflow.approve', 'workflow.reject',
  'doc.upload', 'doc.download', 'doc.link',
  'budget.view', 'budget.commit', 'budget.release',
  'proc.request.create', 'proc.request.approve', 'proc.po.create', 'proc.receipt', 'proc.payment',
  'audit.read'
];

ERP.catalogs = {
  DOC_TYPE: [
    { code: 'COT', name: 'Cotización', active: true },
    { code: 'FACT', name: 'Factura CFDI', active: true },
    { code: 'OC', name: 'Orden de compra firmada', active: true },
    { code: 'REC', name: 'Acta de recepción', active: true },
    { code: 'REQ', name: 'Requisición / solicitud', active: true },
    { code: 'DICT', name: 'Dictamen técnico', active: true }
  ],
  REQUEST_TYPE: [
    { code: 'MAT', name: 'Materiales y suministros', active: true },
    { code: 'SERV', name: 'Servicios profesionales', active: true },
    { code: 'OBRA', name: 'Obra / mantenimiento', active: true },
    { code: 'TI', name: 'Tecnologías de información', active: true }
  ],
  BUDGET_LINE: [
    { code: '2111', name: 'Materiales y útiles de oficina', available: 428500, committed: 186200, spent: 95200 },
    { code: '2211', name: 'Productos químicos', available: 82000, committed: 71000, spent: 45000 },
    { code: '2461', name: 'Equipo de cómputo', available: 612000, committed: 240000, spent: 188000 },
    { code: '3391', name: 'Servicios profesionales', available: 950000, committed: 410000, spent: 275000 },
    { code: '3551', name: 'Reparación de edificios', available: 1200000, committed: 680000, spent: 320000 }
  ],
  STATUS: [
    { code: 'DRAFT', name: 'Borrador' },
    { code: 'SUBMITTED', name: 'Enviada' },
    { code: 'IN_APPROVAL', name: 'En aprobación' },
    { code: 'APPROVED', name: 'Aprobada' },
    { code: 'REJECTED', name: 'Rechazada' },
    { code: 'COMMITTED', name: 'Comprometida' },
    { code: 'ORDERED', name: 'Ordenada' },
    { code: 'RECEIVED', name: 'Recibida' },
    { code: 'PAID', name: 'Pagada' },
    { code: 'CLOSED', name: 'Cerrada' }
  ]
};

ERP.dashboard = {
  kpis: [
    { label: 'Presupuesto Disponible', value: '$18.4 MDP', delta: 'Ejercicio 2026', tone: 'neutral' },
    { label: 'Presupuesto Comprometido', value: '$6.2 MDP', delta: '+4.1% vs mes', tone: 'up' },
    { label: 'Presupuesto Ejercido', value: '$4.8 MDP', delta: '26% del anual', tone: 'neutral' },
    { label: 'Solicitudes Pendientes', value: '14', delta: '3 críticas', tone: 'down' },
    { label: 'Órdenes de Compra', value: '37', delta: '8 este mes', tone: 'up' },
    { label: 'Pagos Pendientes', value: '9', delta: '$1.1 MDP', tone: 'down' },
    { label: 'Workflows Pendientes', value: '11', delta: '5 en su bandeja', tone: 'down' },
    { label: 'Documentos Registrados', value: '1,284', delta: '+62 esta semana', tone: 'up' }
  ],
  purchasesByOu: [
    { name: 'Obras', pct: 78, amount: 2.4 },
    { name: 'Admin', pct: 55, amount: 1.1 },
    { name: 'Tesorería', pct: 32, amount: 0.6 },
    { name: 'Contraloría', pct: 18, amount: 0.2 },
    { name: 'Compras', pct: 41, amount: 0.8 }
  ],
  budgetConsumption: [
    { name: 'Ene', pct: 22 },
    { name: 'Feb', pct: 28 },
    { name: 'Mar', pct: 35 },
    { name: 'Abr', pct: 42 },
    { name: 'May', pct: 48 },
    { name: 'Jun', pct: 55 },
    { name: 'Jul', pct: 61 },
    { name: 'Ago', pct: 68 },
    { name: 'Sep', pct: 74 },
    { name: 'Oct', pct: 82 },
    { name: 'Nov', pct: 88 }
  ],
  alerts: [
    { level: 'critical', text: 'Partida 2211 al 92% — riesgo de insuficiencia en Q4.' },
    { level: 'warning', text: '3 solicitudes > 72 h sin decisión en bandeja DIR_ADMIN.' },
    { level: 'warning', text: 'OC-2026-0042 con recepción parcial sin factura vinculada.' }
  ],
  approvals: [
    { id: 'SC-2026-0142', who: 'Sofía Mendoza', action: 'Aprobó', when: 'hoy 10:22', amount: '$86,400' },
    { id: 'SC-2026-0139', who: 'Mariana Ríos', action: 'Aprobó', when: 'ayer 16:05', amount: '$214,000' },
    { id: 'SC-2026-0135', who: 'Héctor Valdez', action: 'Commit OK', when: 'ayer 12:40', amount: '$214,000' },
    { id: 'SC-2026-0131', who: 'Patricia Núñez', action: 'Observó', when: 'lun 09:18', amount: '$45,200' }
  ],
  activity: [
    { text: 'Ana Beltrán creó SC-2026-0148 (equipo de cómputo)', when: '12 min' },
    { text: 'Sistema generó tarea WF PO_APPROVAL #T-8841', when: '11 min' },
    { text: 'Se vinculó COT-884 a expediente EXP-COMP-0148', when: '2 h' },
    { text: 'Pago PAG-2026-019 liquidó OC-2026-0038', when: '5 h' },
    { text: 'Auditoría registró cambio de rol USR-0006 → LOCKED', when: '1 d' }
  ]
};

ERP.workflowTasks = [
  { id: 'T-8841', process: 'PO_APPROVAL', ref: 'SC-2026-0148', title: 'Aprobar compra de laptops Obras Públicas', amount: 214800, requester: 'Ana Beltrán', ou: 'Obras Públicas', status: 'OPEN', sla: 'vencida 4h', priority: 'Alta', assignee: 'Mariana Ríos' },
  { id: 'T-8837', process: 'PO_APPROVAL', ref: 'SC-2026-0145', title: 'Servicio de mantenimiento vehicular', amount: 48600, requester: 'Luis Ortega', ou: 'Obras Públicas', status: 'OPEN', sla: '18 h', priority: 'Media', assignee: 'Mariana Ríos' },
  { id: 'T-8832', process: 'PO_APPROVAL', ref: 'SC-2026-0141', title: 'Material de oficina Admin', amount: 12840, requester: 'Ana Beltrán', ou: 'Administración', status: 'OPEN', sla: '36 h', priority: 'Baja', assignee: 'Sofía Mendoza' },
  { id: 'T-8820', process: 'PO_APPROVAL', ref: 'SC-2026-0139', title: 'Consultoría jurídica', amount: 180000, requester: 'Patricia Núñez', ou: 'Contraloría', status: 'APPROVED', sla: '—', priority: 'Media', assignee: 'Mariana Ríos' },
  { id: 'T-8811', process: 'PO_APPROVAL', ref: 'SC-2026-0133', title: 'Reactivos laboratorio', amount: 39200, requester: 'Sofía Mendoza', ou: 'Compras', status: 'REJECTED', sla: '—', priority: 'Alta', assignee: 'Héctor Valdez' }
];

ERP.purchaseRequests = [
  {
    id: 'SC-2026-0148',
    title: 'Adquisición de equipo de cómputo portátil',
    type: 'TI',
    ou: 'Dirección de Obras Públicas',
    requester: 'Ana Beltrán',
    created: '2026-11-05 09:40',
    status: 'IN_APPROVAL',
    priority: 'Alta',
    currency: 'MXN',
    total: 214800,
    justification: 'Sustitución de 6 equipos obsoletos (ciclo 5 años) para supervisión de obra en campo. Cotizaciones anexas.',
    budgetLine: '2461',
    supplierHint: 'Tecnología del Centro S.A. de C.V.',
    lines: [
      { sku: 'NB-I5-14', desc: 'Laptop i5 16GB 512SSD', qty: 6, unit: 'PZA', price: 32800 },
      { sku: 'ACC-MOCH', desc: 'Mochila reforzada', qty: 6, unit: 'PZA', price: 1200 },
      { sku: 'ACC-MOUSE', desc: 'Mouse inalámbrico', qty: 6, unit: 'PZA', price: 450 }
    ],
    comments: [
      { who: 'Ana Beltrán', when: '2026-11-05 09:45', text: 'Se adjuntan 3 cotizaciones. Preferencia por menor tiempo de entrega.' },
      { who: 'Sofía Mendoza', when: '2026-11-05 11:10', text: 'Validé catálogo; partida 2461 con disponibilidad.' }
    ],
    timeline: [
      { label: 'Borrador creado', when: '05 Nov 09:40', state: 'done' },
      { label: 'Enviada a workflow', when: '05 Nov 09:48', state: 'done' },
      { label: 'Pendiente DIR_ADMIN', when: '05 Nov 09:49', state: 'current' },
      { label: 'Commit presupuestal', when: '—', state: 'todo' },
      { label: 'Orden de compra', when: '—', state: 'todo' },
      { label: 'Recepción / Pago', when: '—', state: 'todo' }
    ]
  },
  {
    id: 'SC-2026-0145',
    title: 'Mantenimiento correctivo flotilla',
    type: 'SERV',
    ou: 'Dirección de Obras Públicas',
    requester: 'Luis Ortega',
    created: '2026-11-04 16:20',
    status: 'IN_APPROVAL',
    priority: 'Media',
    total: 48600,
    budgetLine: '3551',
    lines: [{ sku: 'SRV-MANT', desc: 'Servicio correctivo 4 unidades', qty: 1, unit: 'SERV', price: 48600 }],
    comments: [],
    timeline: []
  },
  {
    id: 'SC-2026-0142',
    title: 'Útiles de oficina Q4',
    type: 'MAT',
    ou: 'Dirección de Administración',
    requester: 'Ana Beltrán',
    created: '2026-11-03 12:00',
    status: 'APPROVED',
    priority: 'Baja',
    total: 86400,
    budgetLine: '2111',
    lines: [],
    comments: [],
    timeline: []
  },
  {
    id: 'SC-2026-0139',
    title: 'Consultoría jurídica especial',
    type: 'SERV',
    ou: 'Contraloría Municipal',
    requester: 'Patricia Núñez',
    created: '2026-11-02 10:15',
    status: 'COMMITTED',
    priority: 'Media',
    total: 180000,
    budgetLine: '3391',
    lines: [],
    comments: [],
    timeline: []
  },
  {
    id: 'SC-2026-0133',
    title: 'Reactivos laboratorio',
    type: 'MAT',
    ou: 'Coordinación de Compras',
    requester: 'Sofía Mendoza',
    created: '2026-10-30 09:00',
    status: 'REJECTED',
    priority: 'Alta',
    total: 39200,
    budgetLine: '2211',
    lines: [],
    comments: [{ who: 'Héctor Valdez', when: '2026-10-30 15:22', text: 'Insuficiencia en partida 2211. Reasignar o reducir alcance.' }],
    timeline: []
  }
];

ERP.purchaseOrders = [
  { id: 'OC-2026-0042', sc: 'SC-2026-0139', supplier: 'Bufete Norte SC', total: 180000, status: 'PARTIAL_RECEIPT', date: '2026-11-03' },
  { id: 'OC-2026-0038', sc: 'SC-2026-0128', supplier: 'Papelería Regional', total: 64200, status: 'PAID', date: '2026-10-22' },
  { id: 'OC-2026-0035', sc: 'SC-2026-0121', supplier: 'Constructora Sierra', total: 420000, status: 'RECEIVED', date: '2026-10-18' }
];

ERP.receipts = [
  { id: 'REC-2026-0021', oc: 'OC-2026-0042', date: '2026-11-04', status: 'PARCIAL', lines: '1/2 entregables' },
  { id: 'REC-2026-0018', oc: 'OC-2026-0038', date: '2026-10-24', status: 'COMPLETA', lines: '12/12' }
];

ERP.payments = [
  { id: 'PAG-2026-019', oc: 'OC-2026-0038', amount: 64200, status: 'LIQUIDADO', date: '2026-10-28', method: 'Transferencia SPEI' },
  { id: 'PAG-2026-017', oc: 'OC-2026-0031', amount: 128500, status: 'PROGRAMADO', date: '2026-11-07', method: 'Transferencia SPEI' },
  { id: 'PAG-2026-015', oc: 'OC-2026-0029', amount: 88000, status: 'PENDIENTE_CFDI', date: '—', method: '—' }
];

ERP.budget = {
  year: 2026,
  approved: 29400000,
  available: 18400000,
  committed: 6200000,
  spent: 4800000,
  reserves: [
    { id: 'RSV-014', line: '2461', amount: 214800, ref: 'SC-2026-0148', status: 'PENDIENTE_COMMIT' },
    { id: 'RSV-011', line: '3391', amount: 180000, ref: 'SC-2026-0139', status: 'CONFIRMADA' }
  ],
  commitments: [
    { id: 'CP-2026-0089', line: '3391', amount: 180000, ref: 'SC-2026-0139', when: '2026-11-03 12:40', by: 'Héctor Valdez' },
    { id: 'CP-2026-0082', line: '2111', amount: 86400, ref: 'SC-2026-0142', when: '2026-11-04 09:10', by: 'Héctor Valdez' }
  ],
  movements: [
    { id: 'MOV-441', type: 'COMPROMISO', amount: 180000, line: '3391', when: '2026-11-03', note: 'CommitBudget SC-2026-0139' },
    { id: 'MOV-438', type: 'EJERCICIO', amount: 64200, line: '2111', when: '2026-10-28', note: 'Pago OC-2026-0038' },
    { id: 'MOV-430', type: 'LIBERACION', amount: 12000, line: '2211', when: '2026-10-25', note: 'Release parcial SC-2026-0120' }
  ]
};

ERP.documents = [
  { id: 'DOC-9912', exp: 'EXP-COMP-0148', name: 'Cotización Tecnología del Centro.pdf', type: 'COT', version: 2, size: '842 KB', status: 'AVAILABLE', uploaded: '2026-11-05 10:02', by: 'Ana Beltrán' },
  { id: 'DOC-9908', exp: 'EXP-COMP-0148', name: 'Solicitud SC-2026-0148.pdf', type: 'REQ', version: 1, size: '210 KB', status: 'AVAILABLE', uploaded: '2026-11-05 09:50', by: 'Ana Beltrán' },
  { id: 'DOC-9881', exp: 'EXP-COMP-0139', name: 'Contrato marco Bufete Norte.pdf', type: 'OC', version: 1, size: '1.2 MB', status: 'AVAILABLE', uploaded: '2026-11-03 14:20', by: 'Sofía Mendoza' },
  { id: 'DOC-9870', exp: 'EXP-COMP-0139', name: 'Factura A-45821.xml', type: 'FACT', version: 1, size: '64 KB', status: 'AVAILABLE', uploaded: '2026-11-04 11:05', by: 'Diana Soto' }
];

ERP.caseFiles = [
  { id: 'EXP-COMP-0148', title: 'Expediente compra laptops Obras', sc: 'SC-2026-0148', docs: 2, status: 'ABIERTO', owner: 'Compras' },
  { id: 'EXP-COMP-0139', title: 'Expediente consultoría jurídica', sc: 'SC-2026-0139', docs: 5, status: 'EN_TRAMITE', owner: 'Contraloría' },
  { id: 'EXP-COMP-0128', title: 'Expediente útiles oficina', sc: 'SC-2026-0128', docs: 8, status: 'CERRADO', owner: 'Administración' }
];

ERP.audit = [
  { id: 'AUD-7001', when: '2026-11-05 14:02:11', user: 'mrios', action: 'LOGIN', entity: 'Session', ip: '10.12.4.88', before: '—', after: 'sid=8f2a… ACTIVE' },
  { id: 'AUD-6998', when: '2026-11-05 11:10:44', user: 'smendoza', action: 'UPDATE', entity: 'PurchaseRequest:SC-2026-0148', ip: '10.12.4.41', before: '{"status":"DRAFT"}', after: '{"status":"SUBMITTED"}' },
  { id: 'AUD-6995', when: '2026-11-05 09:48:02', user: 'abeltran', action: 'CREATE', entity: 'PurchaseRequest:SC-2026-0148', ip: '10.12.4.55', before: 'null', after: '{"total":214800,"ou":"OBP"}' },
  { id: 'AUD-6988', when: '2026-11-04 17:22:09', user: 'pnunez', action: 'READ', entity: 'AuditLog:SC-2026-0139', ip: '10.12.5.10', before: '—', after: '—' },
  { id: 'AUD-6970', when: '2026-11-03 12:40:33', user: 'hvaldez', action: 'COMMIT_BUDGET', entity: 'BudgetCommitment:CP-2026-0089', ip: '10.12.3.12', before: '{"available":950000}', after: '{"available":770000,"committed":180000}' },
  { id: 'AUD-6961', when: '2026-10-28 10:01:55', user: 'admin', action: 'LOCK_USER', entity: 'User:USR-0006', ip: '10.12.1.2', before: '{"status":"ACTIVE"}', after: '{"status":"LOCKED"}' }
];

ERP.nav = [
  {
    section: 'Inicio',
    items: [
      { id: 'dashboard', label: 'Dashboard ejecutivo', icon: '▣', href: '#/dashboard' },
      { id: 'scenarios', label: 'Escenarios guiados', icon: '▸', href: '#/escenarios' }
    ]
  },
  {
    section: 'Plataforma Core',
    items: [
      {
        id: 'iam', label: 'IAM & Seguridad', icon: '⬡', children: [
          { label: 'Usuarios', href: '#/iam/usuarios' },
          { label: 'Roles', href: '#/iam/roles' },
          { label: 'Permisos', href: '#/iam/permisos' },
          { label: 'Organizaciones (tenant)', href: '#/iam/organizaciones' },
          { label: 'Mi perfil', href: '#/iam/perfil' }
        ]
      },
      {
        id: 'org', label: 'Organización', icon: '☷', children: [
          { label: 'Dependencias', href: '#/org/dependencias' },
          { label: 'Direcciones', href: '#/org/direcciones' },
          { label: 'Coordinaciones', href: '#/org/coordinaciones' },
          { label: 'Departamentos', href: '#/org/departamentos' },
          { label: 'Puestos', href: '#/org/puestos' },
          { label: 'Funcionarios', href: '#/org/funcionarios' }
        ]
      },
      {
        id: 'catalog', label: 'Catálogos', icon: '☰', children: [
          { label: 'Catálogos generales', href: '#/catalogos' },
          { label: 'Partidas presupuestales', href: '#/catalogos/partidas' },
          { label: 'Tipos de documento', href: '#/catalogos/documentos' },
          { label: 'Tipos de solicitud', href: '#/catalogos/solicitudes' },
          { label: 'Estados', href: '#/catalogos/estados' }
        ]
      },
      {
        id: 'wf', label: 'Workflow', icon: '⟳', children: [
          { label: 'Bandeja de entrada', href: '#/workflow/bandeja', badge: 5 },
          { label: 'Pendientes', href: '#/workflow/pendientes' },
          { label: 'Aprobados', href: '#/workflow/aprobados' },
          { label: 'Rechazados', href: '#/workflow/rechazados' },
          { label: 'Historial', href: '#/workflow/historial' }
        ]
      },
      {
        id: 'doc', label: 'Gestión documental', icon: '▤', children: [
          { label: 'Expedientes', href: '#/documentos/expedientes' },
          { label: 'Documentos', href: '#/documentos' },
          { label: 'Visor', href: '#/documentos/visor/DOC-9912' }
        ]
      },
      { id: 'notif', label: 'Notificaciones', icon: '◌', href: '#/notificaciones' }
    ]
  },
  {
    section: 'Dominios',
    items: [
      {
        id: 'budget', label: 'Presupuesto', icon: '◈', children: [
          { label: 'Presupuesto anual', href: '#/presupuesto' },
          { label: 'Partidas', href: '#/presupuesto/partidas' },
          { label: 'Disponibilidad', href: '#/presupuesto/disponibilidad' },
          { label: 'Reservas', href: '#/presupuesto/reservas' },
          { label: 'Compromisos', href: '#/presupuesto/compromisos' },
          { label: 'Movimientos', href: '#/presupuesto/movimientos' }
        ]
      },
      {
        id: 'proc', label: 'Compras (P2P)', icon: '◇', children: [
          { label: 'Solicitudes', href: '#/compras/solicitudes' },
          { label: 'Nueva solicitud', href: '#/compras/solicitudes/nueva' },
          { label: 'Órdenes de compra', href: '#/compras/ordenes' },
          { label: 'Recepciones', href: '#/compras/recepciones' },
          { label: 'Pagos', href: '#/compras/pagos' }
        ]
      },
      {
        id: 'audit', label: 'Auditoría', icon: '◉', children: [
          { label: 'Bitácora general', href: '#/auditoria' },
          { label: 'Por usuario', href: '#/auditoria/usuario' },
          { label: 'Por documento', href: '#/auditoria/documento' },
          { label: 'Por compra', href: '#/auditoria/compra' },
          { label: 'Trazabilidad', href: '#/auditoria/trazabilidad/SC-2026-0148' }
        ]
      }
    ]
  }
];
