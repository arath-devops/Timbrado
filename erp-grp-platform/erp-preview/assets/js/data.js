/* Mock data — ERP-FM-001 + Control Pack stubs (crédito, ATP, líneas) */
window.ERPDemo = {
  companies: [
    { id: 'ACME-MX-001', name: 'ACME Industrial S.A. de C.V.' },
    { id: 'ACME-MX-002', name: 'ACME Servicios Norte S.A. de C.V.' }
  ],
  roles: [
    { id: 'DG', label: 'Director General', username: 'dgomez', display_name: 'Diego Gómez', short: 'DG', email: 'diego.gomez@acme-industrial.mx', nav: ['dashboard','modulos','bandeja','reportes','finanzas','cxp','cxc','facturacion','tesoreria','contabilidad','compras','ventas'] },
    { id: 'CFO', label: 'CFO', username: 'mhernandez', display_name: 'María Hernández', short: 'MH', email: 'maria.hernandez@acme-industrial.mx', nav: ['dashboard','modulos','bandeja','reportes','contabilidad','cxp','facturacion','cxc','tesoreria','finanzas','activos'] },
    { id: 'GL', label: 'Contador', username: 'mhernandez', display_name: 'María Hernández', short: 'MH', email: 'maria.hernandez@acme-industrial.mx', nav: ['dashboard','modulos','bandeja','contabilidad','cxp','cxc','facturacion','tesoreria','finanzas','reportes'] },
    { id: 'BUY', label: 'Comprador', username: 'clopez', display_name: 'Carlos López', short: 'CL', email: 'carlos.lopez@acme-industrial.mx', nav: ['dashboard','modulos','bandeja','compras','inventarios','proveedores','reportes'] },
    { id: 'SAL', label: 'Vendedor', username: 'avargas', display_name: 'Ana Vargas', short: 'AV', email: 'ana.vargas@acme-industrial.mx', nav: ['dashboard','modulos','ventas','facturacion','cxc','inventarios','reportes'] },
    { id: 'INV', label: 'Encargado de Almacén', username: 'rsolis', display_name: 'Roberto Solís', short: 'RS', email: 'roberto.solis@acme-industrial.mx', nav: ['dashboard','modulos','inventarios','compras','reportes'] },
    { id: 'HR', label: 'RRHH', username: 'lramos', display_name: 'Laura Ramos', short: 'LR', email: 'laura.ramos@acme-industrial.mx', nav: ['dashboard','modulos','rh','nomina','bandeja','reportes'] }
  ],
  session: null, /* set by applyRole */
  notifications: [
    { id: 1, title: 'PO-2026-0842 pendiente de aprobación', time: 'hace 18 min', unread: true, href: '../compras/detalle-oc.html?id=PO-2026-0842' },
    { id: 2, title: 'Factura AP-88421 lista para programar pago', time: 'hace 1 h', unread: true, href: '../finanzas/detalle-factura-ap.html?id=AP-88421' },
    { id: 3, title: 'Periodo 2026-11 OPEN — soft close en 12 días', time: 'hace 3 h', unread: false, href: '../finanzas/periodos.html' },
    { id: 4, title: 'Cliente C-2015 cerca del límite de crédito', time: 'hace 4 h', unread: true, href: '../ventas/detalle-pedido.html?id=SO-2026-0544' }
  ],
  tasks: [
    { task_id: 'T-9021', process: 'PO_APPROVAL', ref: 'PO-2026-0842', title: 'Aprobar OC Aceros del Norte', amount: 486200, status: 'OPEN', sla: 'vencida 2h', why: 'Importe > umbral $200k' },
    { task_id: 'T-9018', process: 'PR_APPROVAL', ref: 'PR-2026-1204', title: 'Requisición consumibles planta 2', amount: 38450, status: 'OPEN', sla: '14 h', why: 'Área Prod-2' },
    { task_id: 'T-9012', process: 'AP_INVOICE_APPROVAL', ref: 'AP-88410', title: 'Factura sin OC > umbral', amount: 125000, status: 'OPEN', sla: '22 h', why: 'Sin OC + > $100k' }
  ],
  vendors: [
    { vendor_code: 'V-1001', legal_name: 'Aceros del Norte S.A. de C.V.', tax_id: 'ANO850101XXX', email: 'cxp@acerosnorte.mx', payment_terms_default: 'NET30', currency: 'MXN', status: 'ACTIVE', bank_account: '012180001234567890' },
    { vendor_code: 'V-1044', legal_name: 'Suministros Industriales López', tax_id: 'SIL920215ABC', email: 'ventas@silopez.mx', payment_terms_default: 'NET15', currency: 'MXN', status: 'ACTIVE', bank_account: '014180009876543210' },
    { vendor_code: 'V-1102', legal_name: 'TechParts Asia Ltd.', tax_id: 'TPA000000XXX', email: 'billing@techparts.asia', payment_terms_default: 'NET45', currency: 'USD', status: 'BLOCKED', bank_account: '—' }
  ],
  customers: [
    { code: 'C-2001', name: 'Constructora Sierra Madre', tax_id: 'CSM780101AAA', status: 'ACTIVE', terms: 'NET30', currency: 'MXN', credit_limit: 800000, credit_exposure: 312800, credit_block: false },
    { code: 'C-2015', name: 'Grupo Comercial del Bajío', tax_id: 'GCB900101BBB', status: 'ACTIVE', terms: 'NET15', currency: 'MXN', credit_limit: 250000, credit_exposure: 230650, credit_block: false },
    { code: 'C-2030', name: 'Exportadora Pacífico', tax_id: 'EPA850101CCC', status: 'ACTIVE', terms: 'NET45', currency: 'USD', credit_limit: 100000, credit_exposure: 98000, credit_block: true }
  ],
  items: [
    { item_code: 'RM-STEEL-12', item_name: 'Placa acero A36 1/2"', item_type: 'STOCK', uom: 'KG', costing_method: 'AVG', sales_price: 28.5, purchase_price: 22.0 },
    { item_code: 'RM-BOLT-M12', item_name: 'Tornillo hex M12x40', item_type: 'STOCK', uom: 'PZA', costing_method: 'AVG', sales_price: 4.2, purchase_price: 2.1 },
    { item_code: 'FG-FRAME-01', item_name: 'Marco estructural T1', item_type: 'STOCK', uom: 'PZA', costing_method: 'STD', sales_price: 8450, purchase_price: 0 },
    { item_code: 'SV-MANT-01', item_name: 'Servicio mantenimiento CNC', item_type: 'SERVICE', uom: 'SERV', costing_method: null, sales_price: 12000, purchase_price: 9500 }
  ],
  stock: [
    { item_code: 'RM-STEEL-12', warehouse_id: 'WH-P1', qty_on_hand: 18420, qty_reserved: 2400, qty_available: 16020 },
    { item_code: 'RM-BOLT-M12', warehouse_id: 'WH-P1', qty_on_hand: 52000, qty_reserved: 5000, qty_available: 47000 },
    { item_code: 'FG-FRAME-01', warehouse_id: 'WH-FG', qty_on_hand: 86, qty_reserved: 40, qty_available: 46 }
  ],
  prs: [
    { id: 'PR-2026-1204', title: 'Consumibles planta 2', requester_id: 'jperez', org_unit_id: 'OU-PROD-2', need_by_date: '2026-11-20', justification: 'Reposición de tornillería y consumibles de línea 2 para turno continuo.', priority: 'MED', status: 'SUBMITTED', total_amount: 38450,
      lines: [
        { item: 'RM-BOLT-M12', desc: 'Tornillo hex M12x40', qty: 10000, uom: 'PZA', price: 2.1, cost_center_id: 'OU-PROD-2' },
        { item: 'RM-STEEL-12', desc: 'Placa acero A36 (consumo)', qty: 500, uom: 'KG', price: 22, cost_center_id: 'OU-PROD-2' }
      ] },
    { id: 'PR-2026-1198', title: 'Servicio CNC trimestral', requester_id: 'mhernandez', org_unit_id: 'OU-MANT', need_by_date: '2026-11-28', justification: 'Mantenimiento preventivo contractual Q4 equipos CNC.', priority: 'HIGH', status: 'APPROVED', total_amount: 95000,
      lines: [
        { item: 'SV-MANT-01', desc: 'Servicio mantenimiento CNC', qty: 1, uom: 'SERV', price: 95000, cost_center_id: 'OU-MANT' }
      ] },
    { id: 'PR-2026-1180', title: 'Placa acero A36', requester_id: 'jperez', org_unit_id: 'OU-PROD-1', need_by_date: '2026-11-15', justification: 'Pedido de materia prima para OT-441.', priority: 'HIGH', status: 'CLOSED', total_amount: 410000,
      lines: [
        { item: 'RM-STEEL-12', desc: 'Placa acero A36 1/2"', qty: 16000, uom: 'KG', price: 22, cost_center_id: 'OU-PROD-1' }
      ] }
  ],
  pos: [
    { id: 'PO-2026-0842', vendor_id: 'V-1001', order_date: '2026-11-06', currency: 'MXN', payment_terms: 'NET30', delivery_address: 'Almacén Planta 1 · Av. Industrial 120', pr_id: 'PR-2026-1180', buyer_id: 'clopez', total_amount: 486200, status: 'PENDING_APPROVAL',
      lines: [
        { line: 1, item: 'RM-STEEL-12', desc: 'Placa acero A36 1/2"', ordered_qty: 18000, received_qty: 0, billed_qty: 0, open_qty: 18000, uom: 'KG', price: 22, tax: 'IVA16', cost_center_id: 'OU-PROD-1' },
        { line: 2, item: 'RM-BOLT-M12', desc: 'Tornillo hex M12x40', ordered_qty: 5000, received_qty: 0, billed_qty: 0, open_qty: 5000, uom: 'PZA', price: 2.1, tax: 'IVA16', cost_center_id: 'OU-PROD-1' }
      ] },
    { id: 'PO-2026-0799', vendor_id: 'V-1044', order_date: '2026-10-28', currency: 'MXN', payment_terms: 'NET15', delivery_address: 'Almacén Planta 2', pr_id: 'PR-2026-1170', buyer_id: 'clopez', total_amount: 128400, status: 'PARTIALLY_RECEIVED',
      lines: [
        { line: 1, item: 'RM-BOLT-M12', desc: 'Tornillo hex M12x40', ordered_qty: 50000, received_qty: 30000, billed_qty: 30000, open_qty: 20000, uom: 'PZA', price: 2.1, tax: 'IVA16', cost_center_id: 'OU-PROD-2' }
      ] },
    { id: 'PO-2026-0771', vendor_id: 'V-1044', order_date: '2026-10-12', currency: 'MXN', payment_terms: 'NET15', delivery_address: 'Planta 1', pr_id: null, buyer_id: 'clopez', total_amount: 45200, status: 'RECEIVED',
      lines: [
        { line: 1, item: 'SV-MANT-01', desc: 'Servicio puntual', ordered_qty: 1, received_qty: 1, billed_qty: 1, open_qty: 0, uom: 'SERV', price: 38966, tax: 'IVA16', cost_center_id: 'OU-MANT' }
      ] }
  ],
  apInvoices: [
    { id: 'AP-88421', vendor_id: 'V-1044', invoice_number: 'A-55210', invoice_date: '2026-11-04', posting_date: '2026-11-05', currency: 'MXN', po_id: 'PO-2026-0799', gr_id: 'GR-2026-0310', subtotal: 110690, tax_total: 17710, grand_total: 128400, due_date: '2026-11-19', status: 'POSTED', match_status: 'MATCHED',
      lines: [{ item: 'RM-BOLT-M12', qty: 30000, price: 2.1, tax: 'IVA16', cost_center_id: 'OU-PROD-2' }],
      match: { po_amount: 128400, gr_amount: 128400, inv_amount: 128400, qty_ok: true, amt_ok: true, tolerance_pct: 2 } },
    { id: 'AP-88410', vendor_id: 'V-1001', invoice_number: 'F-10088', invoice_date: '2026-11-03', posting_date: '2026-11-03', currency: 'MXN', po_id: null, gr_id: null, subtotal: 107758, tax_total: 17242, grand_total: 125000, due_date: '2026-12-03', status: 'PENDING_APPROVAL', match_status: 'NOT_REQUIRED',
      lines: [{ item: 'Servicio especial', qty: 1, price: 107758, tax: 'IVA16', cost_center_id: 'OU-FIN' }],
      match: null },
    { id: 'AP-88390', vendor_id: 'V-1044', invoice_number: 'A-55102', invoice_date: '2026-10-20', posting_date: '2026-10-21', currency: 'MXN', po_id: 'PO-2026-0771', gr_id: 'GR-2026-0288', subtotal: 38966, tax_total: 6234, grand_total: 45200, due_date: '2026-11-04', status: 'PAID', match_status: 'MATCHED',
      lines: [{ item: 'SV-MANT-01', qty: 1, price: 38966, tax: 'IVA16', cost_center_id: 'OU-MANT' }],
      match: { po_amount: 45200, gr_amount: 45200, inv_amount: 45200, qty_ok: true, amt_ok: true, tolerance_pct: 2 } }
  ],
  arInvoices: [
    { id: 'AR-44102', customer_id: 'C-2001', invoice_date: '2026-11-02', sales_order_id: 'SO-2026-0551', payment_terms: 'NET30', grand_total: 312800, status: 'ISSUED', open_amount: 312800 },
    { id: 'AR-44088', customer_id: 'C-2015', invoice_date: '2026-10-25', sales_order_id: 'SO-2026-0530', payment_terms: 'NET15', grand_total: 188450, status: 'PARTIALLY_PAID', open_amount: 88450 },
    { id: 'AR-44050', customer_id: 'C-2001', invoice_date: '2026-10-10', sales_order_id: 'SO-2026-0501', payment_terms: 'NET30', grand_total: 95600, status: 'PAID', open_amount: 0 }
  ],
  salesOrders: [
    { id: 'SO-2026-0551', customer_id: 'C-2001', order_date: '2026-10-30', requested_date: '2026-11-12', currency: 'MXN', total_amount: 312800, status: 'DELIVERED', credit_ok: true,
      lines: [{ item: 'FG-FRAME-01', qty: 37, price: 8450, discount: 0 }] },
    { id: 'SO-2026-0544', customer_id: 'C-2015', order_date: '2026-11-05', requested_date: '2026-11-18', currency: 'MXN', total_amount: 142200, status: 'CONFIRMED', credit_ok: true,
      lines: [{ item: 'FG-FRAME-01', qty: 16, price: 8450, discount: 0 }, { item: 'RM-BOLT-M12', qty: 1000, price: 4.2, discount: 0 }] },
    { id: 'SO-2026-0599', customer_id: 'C-2030', order_date: '2026-11-07', requested_date: '2026-11-25', currency: 'USD', total_amount: 25000, status: 'DRAFT', credit_ok: false,
      lines: [{ item: 'FG-FRAME-01', qty: 3, price: 450, discount: 0 }] }
  ],
  accounts: [
    { account_code: '1100-001', account_name: 'Bancos MN', account_type: 'ASSET', allow_manual_posting: true, is_recon_account: false },
    { account_code: '1200-001', account_name: 'Clientes nacionales', account_type: 'ASSET', allow_manual_posting: false, is_recon_account: true },
    { account_code: '2100-001', account_name: 'Proveedores nacionales', account_type: 'LIABILITY', allow_manual_posting: false, is_recon_account: true },
    { account_code: '4000-001', account_name: 'Ingresos por ventas', account_type: 'REVENUE', allow_manual_posting: true, is_recon_account: false },
    { account_code: '5000-010', account_name: 'Costo de ventas', account_type: 'EXPENSE', allow_manual_posting: true, is_recon_account: false },
    { account_code: '5100-020', account_name: 'Gastos de mantenimiento', account_type: 'EXPENSE', allow_manual_posting: true, is_recon_account: false }
  ],
  periods: [
    { fiscal_year: 2026, period_id: '2026-09', status: 'HARD_CLOSE', start_date: '2026-09-01', end_date: '2026-09-30' },
    { fiscal_year: 2026, period_id: '2026-10', status: 'SOFT_CLOSE', start_date: '2026-10-01', end_date: '2026-10-31' },
    { fiscal_year: 2026, period_id: '2026-11', status: 'OPEN', start_date: '2026-11-01', end_date: '2026-11-30' }
  ],
  journals: [
    { id: 'JE-2026-1188', journal_date: '2026-11-05', period_id: '2026-11', currency: 'MXN', header_text: 'Provisión mantenimiento CNC', status: 'POSTED', debit: 95000, credit: 95000,
      lines: [{ account: '5100-020', debit: 95000, credit: 0, cc: 'OU-MANT' }, { account: '2100-001', debit: 0, credit: 95000, cc: '' }] },
    { id: 'JE-2026-1170', journal_date: '2026-11-03', period_id: '2026-11', currency: 'MXN', header_text: 'Depreciación maquinaria', status: 'DRAFT', debit: 42800, credit: 42800,
      lines: [{ account: '5200-001', debit: 42800, credit: 0, cc: 'OU-PROD-1' }, { account: '1500-002', debit: 0, credit: 42800, cc: '' }] }
  ],
  banks: [
    { bank_name: 'BBVA México', account_number: '•••• 7821', currency: 'MXN', gl_cash_account: '1100-001', balance: 1840000 },
    { bank_name: 'Banorte', account_number: '•••• 4410', currency: 'MXN', gl_cash_account: '1100-001', balance: 920000 },
    { bank_name: 'Citibanamex USD', account_number: '•••• 9033', currency: 'USD', gl_cash_account: '1100-002', balance: 85000 }
  ],
  employees: [
    { employee_number: 'E-0142', full_name: 'Juan Pérez Molina', hire_date: '2019-03-12', org_unit_id: 'OU-PROD-2', position_id: 'P-OPR', salary_base: 18500, status: 'ACTIVE' },
    { employee_number: 'E-0088', full_name: 'María Hernández Ruiz', hire_date: '2016-08-01', org_unit_id: 'OU-FIN', position_id: 'P-CTRL', salary_base: 52000, status: 'ACTIVE' },
    { employee_number: 'E-0210', full_name: 'Carlos López Díaz', hire_date: '2021-11-15', org_unit_id: 'OU-COM', position_id: 'P-BUY', salary_base: 28000, status: 'ACTIVE' }
  ],
  users: [
    { username: 'mhernandez', email: 'maria.hernandez@acme-industrial.mx', full_name: 'María Hernández', status: 'ACTIVE', org_unit_id: 'OU-FIN', role_codes: 'GL,AP,AR' },
    { username: 'clopez', email: 'carlos.lopez@acme-industrial.mx', full_name: 'Carlos López', status: 'ACTIVE', org_unit_id: 'OU-COM', role_codes: 'BUY' },
    { username: 'jperez', email: 'juan.perez@acme-industrial.mx', full_name: 'Juan Pérez', status: 'ACTIVE', org_unit_id: 'OU-PROD-2', role_codes: 'EMP' },
    { username: 'admin', email: 'admin@acme-industrial.mx', full_name: 'Admin Sistema', status: 'ACTIVE', org_unit_id: 'OU-IT', role_codes: 'ADM' }
  ],
  orgUnits: [
    { ou_code: 'ACME', ou_name: 'ACME Industrial', ou_type: 'COMPANY', parent_ou_id: null, manager_user_id: 'dgomez' },
    { ou_code: 'OU-FIN', ou_name: 'Finanzas', ou_type: 'DEPT', parent_ou_id: 'ACME', manager_user_id: 'mhernandez' },
    { ou_code: 'OU-COM', ou_name: 'Compras', ou_type: 'DEPT', parent_ou_id: 'ACME', manager_user_id: 'clopez' },
    { ou_code: 'OU-PROD-1', ou_name: 'Producción Planta 1', ou_type: 'DEPT', parent_ou_id: 'ACME', manager_user_id: 'jperez' },
    { ou_code: 'OU-PROD-2', ou_name: 'Producción Planta 2', ou_type: 'DEPT', parent_ou_id: 'ACME', manager_user_id: 'jperez' },
    { ou_code: 'OU-MANT', ou_name: 'Mantenimiento', ou_type: 'DEPT', parent_ou_id: 'ACME', manager_user_id: 'mhernandez' }
  ],
  catalogs: [
    { catalog_code: 'DOC_TYPE', item_code: 'FACT', item_name: 'Factura', active: true },
    { catalog_code: 'DOC_TYPE', item_code: 'OC', item_name: 'Orden de compra', active: true },
    { catalog_code: 'UOM', item_code: 'PZA', item_name: 'Pieza', active: true },
    { catalog_code: 'UOM', item_code: 'KG', item_name: 'Kilogramo', active: true },
    { catalog_code: 'TAX', item_code: 'IVA16', item_name: 'IVA 16%', active: true },
    { catalog_code: 'PAYMENT_TERMS', item_code: 'NET30', item_name: '30 días', active: true }
  ],
  projects: [
    { project_code: 'PJ-441', project_name: 'Línea ensamble T1', customer_id: 'C-2001', start_date: '2026-08-01', end_date: '2026-12-15', budget_amount: 2500000, status: 'ACTIVE' },
    { project_code: 'PJ-402', project_name: 'Retrofit CNC', customer_id: null, start_date: '2026-09-01', end_date: '2026-11-30', budget_amount: 480000, status: 'ACTIVE' }
  ],
  assets: [
    { asset_code: 'FA-CNC-03', asset_name: 'Centro mecanizado CNC Haas', capitalization_date: '2021-04-18', acquisition_cost: 1850000, useful_life_months: 120, depreciation_method: 'SL', status: 'ACTIVE' },
    { asset_code: 'FA-FORK-02', asset_name: 'Montacargas 3.5t', capitalization_date: '2023-01-10', acquisition_cost: 420000, useful_life_months: 84, depreciation_method: 'SL', status: 'ACTIVE' }
  ],

  money(n) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n || 0);
  },
  badge(status) {
    return (window.statusChip ? statusChip(status) : `<span class="badge b-neu">${status}</span>`);
  },
  applyRole(roleId, companyId) {
    const role = this.roles.find((r) => r.id === roleId) || this.roles[2];
    const co = this.companies.find((c) => c.id === companyId) || this.companies[0];
    this.session = {
      role_id: role.id,
      role: role.label,
      username: role.username,
      display_name: role.display_name,
      short: role.short,
      email: role.email,
      company: co.name,
      legal_entity: co.id,
      company_id: co.id,
      nav: role.nav,
      locale: 'es-MX',
      theme: localStorage.getItem('erp-preview-theme') || 'light'
    };
    sessionStorage.setItem('erp-demo-role', role.id);
    sessionStorage.setItem('erp-demo-company', co.id);
    return this.session;
  },
  restoreSession() {
    const rid = sessionStorage.getItem('erp-demo-role') || 'GL';
    const cid = sessionStorage.getItem('erp-demo-company') || 'ACME-MX-001';
    return this.applyRole(rid, cid);
  },
  kpisForRole() {
    const s = this.session || this.restoreSession();
    if (s.role_id === 'DG' || s.role_id === 'CFO') {
      return [
        { l: 'CxP abierto', v: this.money(253400), d: '2 facturas demo', t: 'neutral' },
        { l: 'CxC abierto', v: this.money(401250), d: 'cartera', t: 'up' },
        { l: 'Posición efectivo', v: this.money(2760000), d: 'MXN', t: 'neutral' },
        { l: 'Tareas inbox', v: String(this.tasks.length), d: 'aprobaciones', t: 'down' }
      ];
    }
    if (s.role_id === 'BUY') {
      return [
        { l: 'OC pend. aprobación', v: '1', d: 'PO-2026-0842', t: 'down' },
        { l: 'PR abiertas', v: '1', d: 'SUBMITTED', t: 'warn' },
        { l: 'Recibo parcial', v: '1', d: 'PO-2026-0799', t: 'warn' },
        { l: 'Proveedores ACTIVE', v: '2', d: '1 BLOCKED', t: 'neutral' }
      ];
    }
    if (s.role_id === 'SAL') {
      return [
        { l: 'Pedidos abiertos', v: '1', d: 'CONFIRMED', t: 'info' },
        { l: 'Crédito en riesgo', v: '1', d: 'C-2030 bloqueado', t: 'down' },
        { l: 'ATP marcos', v: '46', d: 'WH-FG available', t: 'neutral' },
        { l: 'Por facturar', v: this.money(142200), d: 'SO-0544', t: 'up' }
      ];
    }
    if (s.role_id === 'INV') {
      return [
        { l: 'SKUs con reserva', v: '3', d: 'ver ATP', t: 'info' },
        { l: 'OC por recibir', v: '2', d: 'open qty > 0', t: 'warn' },
        { l: 'Available marcos', v: '46', d: 'FG-FRAME-01', t: 'neutral' },
        { l: 'Almacenes', v: '2', d: 'WH-P1 / WH-FG', t: 'neutral' }
      ];
    }
    if (s.role_id === 'HR') {
      return [
        { l: 'Empleados ACTIVE', v: String(this.employees.length), d: 'directorio', t: 'neutral' },
        { l: 'Ausencias', v: '0', d: 'pendientes', t: 'ok' },
        { l: 'Corrida nómina', v: 'PAY-11A', d: 'APPROVED stub', t: 'info' },
        { l: 'Aviso', v: 'Stub', d: 'Professional', t: 'warn' }
      ];
    }
    return [
      { l: 'CxP abierto', v: this.money(253400), d: 'AP', t: 'neutral' },
      { l: 'CxC abierto', v: this.money(401250), d: 'AR', t: 'up' },
      { l: 'Periodo', v: '2026-11', d: 'OPEN', t: 'info' },
      { l: 'Asientos draft', v: '1', d: 'JE-1170', t: 'warn' }
    ];
  }
};

ERPDemo.restoreSession();
