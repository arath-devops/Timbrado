/* Atlas de módulos ERP — Freeze MVP + campos obligatorios ERP-FM-001 / CP */
window.ERPModules = {
  meta: {
    title: 'Vista previa por módulo',
    scope: 'ERP-SF-001 release-1 (Freeze)',
    sources: ['ERP-SI-001', 'ERP-FM-001', 'ERP-CP-001', 'ADR-014']
  },
  modules: [
    {
      id: 'plataforma',
      name: 'Plataforma',
      tagline: 'Shell, IAM, bandeja, expediente y catálogos',
      freeze: 'IN',
      color: '#0a6ed1',
      hub: '../administracion/index.html',
      screens: [
        {
          id: 'login', name: 'Inicio de sesión', href: '../index.html',
          purpose: 'Autenticar y seleccionar compañía',
          mock: 'form',
          fields: [
            { key: 'tenant_or_company', label: 'Empresa / tenant', req: true, type: 'Ref' },
            { key: 'username', label: 'Usuario', req: true, type: 'Text' },
            { key: 'password', label: 'Contraseña', req: 'cond', type: 'Text', note: 'Si no SSO' },
            { key: 'mfa_code', label: 'MFA', req: 'cond', type: 'Text', note: 'Si enrolled' }
          ]
        },
        {
          id: 'home', name: 'Inicio / Dashboard', href: '../dashboard/index.html',
          purpose: 'Lanzador y KPIs por rol',
          mock: 'dashboard',
          fields: [
            { key: 'role_context', label: 'Rol activo', req: true, type: 'Ref' },
            { key: 'company_context', label: 'Compañía / LE', req: true, type: 'Ref' },
            { key: 'legal_entity_id', label: 'Entidad legal', req: true, type: 'Ref', note: 'CP' }
          ]
        },
        {
          id: 'bandeja', name: 'Bandeja de aprobación', href: '../administracion/bandeja.html',
          purpose: 'Completar tareas WF',
          mock: 'inbox',
          fields: [
            { key: 'task_id', label: 'Tarea', req: true, type: 'Ref' },
            { key: 'decision', label: 'Decisión', req: true, type: 'Enum', note: 'APPROVE|REJECT' },
            { key: 'comment', label: 'Comentario', req: 'cond', type: 'Text', note: 'Obligatorio en REJECT' },
            { key: 'idempotency_key', label: 'Idempotencia', req: true, type: 'Text' }
          ]
        },
        {
          id: 'docs', name: 'Expediente / Visor / Subir', href: '../administracion/documentos.html',
          purpose: 'Evidencia vinculada a TX',
          mock: 'docs',
          fields: [
            { key: 'case_file_id', label: 'Expediente', req: true, type: 'Ref' },
            { key: 'business_ref_type', label: 'Tipo objeto', req: true, type: 'Enum' },
            { key: 'business_ref_id', label: 'Folio objeto', req: true, type: 'Text' },
            { key: 'doc_type', label: 'Tipo documento', req: true, type: 'Enum' },
            { key: 'file', label: 'Archivo', req: true, type: 'File' }
          ]
        },
        {
          id: 'audit', name: 'Auditoría por documento', href: '../administracion/auditoria.html',
          purpose: 'Trail before/after',
          mock: 'table',
          fields: [
            { key: 'entity_type', label: 'Tipo entidad', req: true, type: 'Text' },
            { key: 'entity_id', label: 'ID / folio', req: true, type: 'Text' }
          ]
        },
        {
          id: 'users', name: 'Usuarios', href: '../administracion/usuarios.html',
          purpose: 'Alta y scopes',
          mock: 'form',
          fields: [
            { key: 'username', label: 'Usuario', req: true, type: 'Text' },
            { key: 'email', label: 'Email', req: true, type: 'Email' },
            { key: 'full_name', label: 'Nombre', req: true, type: 'Text' },
            { key: 'status', label: 'Estado', req: true, type: 'Enum' },
            { key: 'org_unit_id', label: 'OU', req: true, type: 'Ref' },
            { key: 'role_codes', label: 'Roles', req: true, type: 'Ref[]' }
          ]
        },
        {
          id: 'roles', name: 'Roles y permisos', href: '../administracion/roles.html',
          purpose: 'RBAC Freeze',
          mock: 'form',
          fields: [
            { key: 'role_code', label: 'Código rol', req: true, type: 'Text' },
            { key: 'role_name', label: 'Nombre', req: true, type: 'Text' },
            { key: 'permission_codes', label: 'Permisos', req: true, type: 'Ref[]' }
          ]
        },
        {
          id: 'org', name: 'Organización / CC', href: '../administracion/organizacion.html',
          purpose: 'OU y centros de costo',
          mock: 'tree',
          fields: [
            { key: 'ou_code', label: 'Código OU', req: true, type: 'Text' },
            { key: 'ou_name', label: 'Nombre', req: true, type: 'Text' },
            { key: 'ou_type', label: 'Tipo', req: true, type: 'Enum', note: 'COMPANY/DIVISION/DEPT/CC' }
          ]
        },
        {
          id: 'catalogs', name: 'Catálogos', href: '../administracion/catalogos.html',
          purpose: 'UOM, TAX, DOC_TYPE, series',
          mock: 'table',
          fields: [
            { key: 'catalog_code', label: 'Catálogo', req: true, type: 'Enum' },
            { key: 'item_code', label: 'Código ítem', req: true, type: 'Text' },
            { key: 'item_name', label: 'Nombre', req: true, type: 'Text' },
            { key: 'active', label: 'Activo', req: true, type: 'Boolean' }
          ]
        }
      ]
    },
    {
      id: 'compras',
      name: 'Compras (P2P)',
      tagline: 'PR · OC · Recepción · Proveedores — sin budget GRP',
      freeze: 'IN',
      color: '#0854a0',
      hub: '../compras/index.html',
      screens: [
        {
          id: 'vendor', name: 'Ficha proveedor', href: '../compras/proveedores.html',
          purpose: 'Maestro + banco + hold',
          mock: 'form',
          fields: [
            { key: 'vendor_code', label: 'Código', req: true, type: 'Text' },
            { key: 'legal_name', label: 'Razón social', req: true, type: 'Text' },
            { key: 'tax_id', label: 'RFC', req: true, type: 'Text' },
            { key: 'payment_terms_default', label: 'Condiciones pago', req: true, type: 'Ref' },
            { key: 'currency', label: 'Moneda', req: true, type: 'Enum' },
            { key: 'status', label: 'Estado', req: true, type: 'Enum', note: 'BLOCKED impide OC/AP' },
            { key: 'bank_clabe', label: 'CLABE / cuenta', req: 'cond', type: 'Text', note: 'WF cambio banco' },
            { key: 'hold_reason', label: 'Motivo hold', req: 'cond', type: 'Text' }
          ]
        },
        {
          id: 'pr', name: 'Nueva / detalle requisición', href: '../compras/nueva-requisicion.html',
          purpose: 'Solicitud de compra → WF erp.pr.approve',
          mock: 'doc-lines',
          fields: [
            { key: 'document_number', label: 'Folio PR', req: true, type: 'Text', note: 'Serie' },
            { key: 'legal_entity_id', label: 'Entidad legal', req: true, type: 'Ref' },
            { key: 'title', label: 'Asunto', req: true, type: 'Text' },
            { key: 'requester_id', label: 'Solicitante', req: true, type: 'Ref' },
            { key: 'org_unit_id', label: 'Unidad org.', req: true, type: 'Ref' },
            { key: 'justification', label: 'Justificación', req: true, type: 'Text' },
            { key: 'need_by_date', label: 'Fecha necesidad', req: false, type: 'Date' },
            { key: 'line_description', label: 'Línea · descripción', req: true, type: 'Text' },
            { key: 'line_qty', label: 'Línea · cantidad', req: true, type: 'Number' },
            { key: 'line_uom', label: 'Línea · UoM', req: true, type: 'Ref' },
            { key: 'line_est_price', label: 'Línea · precio est.', req: true, type: 'Money' },
            { key: 'account_assignment_category', label: 'Asignación', req: true, type: 'Enum', note: 'COST_CENTER/STOCK' },
            { key: 'cost_center_id', label: 'Centro de costo', req: 'cond', type: 'Ref' },
            { key: 'total_amount', label: 'Total', req: true, type: 'Money' }
          ]
        },
        {
          id: 'po', name: 'Crear / detalle OC', href: '../compras/nueva-oc.html',
          purpose: 'Orden a proveedor → WF erp.po.approve (sin CommitBudget)',
          mock: 'doc-lines',
          fields: [
            { key: 'document_number', label: 'Folio OC', req: true, type: 'Text' },
            { key: 'legal_entity_id', label: 'Entidad legal', req: true, type: 'Ref' },
            { key: 'vendor_id', label: 'Proveedor', req: true, type: 'Ref' },
            { key: 'order_date', label: 'Fecha OC', req: true, type: 'Date' },
            { key: 'currency', label: 'Moneda', req: true, type: 'Enum' },
            { key: 'payment_terms', label: 'Condiciones', req: true, type: 'Ref' },
            { key: 'delivery_address', label: 'Dirección entrega', req: true, type: 'Text' },
            { key: 'pr_id', label: 'PR origen', req: false, type: 'Ref' },
            { key: 'buyer_id', label: 'Comprador', req: true, type: 'Ref' },
            { key: 'gr_based_invoice', label: 'Factura sobre GR', req: false, type: 'Boolean' },
            { key: 'line_item_id', label: 'Línea · artículo', req: true, type: 'Ref' },
            { key: 'line_qty', label: 'Línea · cantidad', req: true, type: 'Number' },
            { key: 'line_price', label: 'Línea · precio', req: true, type: 'Money' },
            { key: 'line_tax_code', label: 'Línea · impuesto', req: true, type: 'Ref' },
            { key: 'total_amount', label: 'Total', req: true, type: 'Money' }
          ]
        },
        {
          id: 'gr', name: 'Recepción', href: '../compras/recepcion.html',
          purpose: 'Entrada contra OC → inventario / AP',
          mock: 'doc-lines',
          fields: [
            { key: 'document_number', label: 'Folio GR', req: true, type: 'Text' },
            { key: 'po_id', label: 'Orden compra', req: true, type: 'Ref' },
            { key: 'receipt_date', label: 'Fecha recepción', req: true, type: 'Date' },
            { key: 'warehouse_id', label: 'Almacén', req: 'cond', type: 'Ref' },
            { key: 'line_po_line_id', label: 'Línea OC', req: true, type: 'Ref' },
            { key: 'line_qty_received', label: 'Cant. recibida', req: true, type: 'Number' },
            { key: 'receipt_type', label: 'Tipo', req: true, type: 'Enum', note: 'FULL/PARTIAL' }
          ]
        }
      ]
    },
    {
      id: 'inventarios',
      name: 'Inventarios',
      tagline: 'Artículos · ATP · movimientos · recepción almacén',
      freeze: 'IN',
      color: '#107e3e',
      hub: '../inventarios/index.html',
      screens: [
        {
          id: 'item', name: 'Maestro de artículos', href: '../inventarios/articulos.html',
          purpose: 'SKU STOCK/SERVICE',
          mock: 'form',
          fields: [
            { key: 'item_code', label: 'SKU', req: true, type: 'Text' },
            { key: 'item_name', label: 'Nombre', req: true, type: 'Text' },
            { key: 'item_type', label: 'Tipo', req: true, type: 'Enum', note: 'STOCK/SERVICE' },
            { key: 'uom', label: 'UoM base', req: true, type: 'Ref' },
            { key: 'costing_method', label: 'Costeo', req: 'cond', type: 'Enum', note: 'AVG/STD si STOCK' }
          ]
        },
        {
          id: 'stock', name: 'Existencias / ATP', href: '../inventarios/existencias.html',
          purpose: 'on_hand / reserved / available',
          mock: 'table',
          fields: [
            { key: 'item_id', label: 'Artículo', req: true, type: 'Ref' },
            { key: 'warehouse_id', label: 'Almacén', req: true, type: 'Ref' },
            { key: 'qty_on_hand', label: 'Existencia', req: true, type: 'Number' },
            { key: 'qty_reserved', label: 'Reservado', req: true, type: 'Number' },
            { key: 'qty_available', label: 'ATP', req: true, type: 'Number', note: 'Calculado' }
          ]
        },
        {
          id: 'move', name: 'Movimientos', href: '../inventarios/movimientos.html',
          purpose: 'IN/OUT/TRANSFER/ADJUST',
          mock: 'form',
          fields: [
            { key: 'move_type', label: 'Tipo movimiento', req: true, type: 'Enum' },
            { key: 'item_id', label: 'Artículo', req: true, type: 'Ref' },
            { key: 'qty', label: 'Cantidad', req: true, type: 'Number' },
            { key: 'warehouse_id', label: 'Almacén', req: true, type: 'Ref' },
            { key: 'reference_id', label: 'Documento origen', req: false, type: 'Ref' }
          ]
        }
      ]
    },
    {
      id: 'ventas',
      name: 'Ventas (O2C light)',
      tagline: 'Pedidos · crédito · entregas',
      freeze: 'IN',
      color: '#0e7490',
      hub: '../ventas/index.html',
      screens: [
        {
          id: 'customer', name: 'Cliente + crédito', href: '../finanzas/cxc.html',
          purpose: 'Maestro con límite / hold',
          mock: 'form',
          fields: [
            { key: 'customer_code', label: 'Código', req: true, type: 'Text' },
            { key: 'legal_name', label: 'Razón social', req: true, type: 'Text' },
            { key: 'tax_id', label: 'RFC', req: true, type: 'Text' },
            { key: 'credit_limit', label: 'Límite crédito', req: true, type: 'Money' },
            { key: 'credit_exposure', label: 'Exposición', req: true, type: 'Money', note: 'Sistema' },
            { key: 'credit_block', label: 'Hold crédito', req: true, type: 'Boolean' }
          ]
        },
        {
          id: 'so', name: 'Pedido de venta', href: '../ventas/nuevo-pedido.html',
          purpose: 'SO + credit check + ATP',
          mock: 'doc-lines',
          fields: [
            { key: 'document_number', label: 'Folio SO', req: true, type: 'Text' },
            { key: 'customer_id', label: 'Cliente', req: true, type: 'Ref' },
            { key: 'order_date', label: 'Fecha', req: true, type: 'Date' },
            { key: 'requested_date', label: 'Fecha requerida', req: false, type: 'Date' },
            { key: 'currency', label: 'Moneda', req: true, type: 'Enum' },
            { key: 'credit_check_result', label: 'Resultado crédito', req: true, type: 'Enum', note: 'OK/HOLD/BLOCKED' },
            { key: 'line_item_id', label: 'Línea · artículo', req: true, type: 'Ref' },
            { key: 'line_qty', label: 'Línea · cantidad', req: true, type: 'Number', note: '≤ ATP' },
            { key: 'line_price', label: 'Línea · precio', req: true, type: 'Money' },
            { key: 'total_amount', label: 'Total', req: true, type: 'Money' }
          ]
        },
        {
          id: 'dn', name: 'Entrega / remisión', href: '../ventas/entregas.html',
          purpose: 'Baja de inventario',
          mock: 'doc-lines',
          fields: [
            { key: 'sales_order_id', label: 'Pedido', req: true, type: 'Ref' },
            { key: 'warehouse_id', label: 'Almacén', req: true, type: 'Ref' },
            { key: 'delivery_date', label: 'Fecha entrega', req: true, type: 'Date' },
            { key: 'line_qty_deliver', label: 'Cant. a entregar', req: true, type: 'Number' }
          ]
        }
      ]
    },
    {
      id: 'facturacion',
      name: 'Facturación',
      tagline: 'Factura cliente · CFDI (puerto)',
      freeze: 'IN',
      color: '#b45309',
      hub: '../finanzas/facturacion.html',
      screens: [
        {
          id: 'ci', name: 'Emisión factura / CFDI', href: '../finanzas/emitir-factura.html',
          purpose: 'AR invoice + adaptador fiscal',
          mock: 'doc-lines',
          fields: [
            { key: 'customer_id', label: 'Cliente', req: true, type: 'Ref' },
            { key: 'invoice_date', label: 'Fecha factura', req: true, type: 'Date' },
            { key: 'sales_order_id', label: 'Pedido origen', req: 'cond', type: 'Ref' },
            { key: 'payment_terms', label: 'Condiciones', req: true, type: 'Ref' },
            { key: 'line_product', label: 'Línea · producto', req: true, type: 'Ref' },
            { key: 'line_qty', label: 'Línea · cantidad', req: true, type: 'Number' },
            { key: 'line_price', label: 'Línea · precio', req: true, type: 'Money' },
            { key: 'tax_code', label: 'Impuesto', req: true, type: 'Ref' },
            { key: 'grand_total', label: 'Total', req: true, type: 'Money' },
            { key: 'cfdi_usage', label: 'Uso CFDI', req: 'cond', type: 'Enum', note: 'MX' }
          ]
        }
      ]
    },
    {
      id: 'cxp',
      name: 'Cuentas por pagar (CxP)',
      tagline: 'Facturas · match 3-way · propuesta pago · aging',
      freeze: 'IN',
      color: '#bb0000',
      hub: '../finanzas/cxp.html',
      screens: [
        {
          id: 'ap', name: 'Captura / detalle factura AP', href: '../finanzas/captura-factura-ap.html',
          purpose: 'Vendor invoice + controles CP',
          mock: 'doc-lines',
          fields: [
            { key: 'legal_entity_id', label: 'Entidad legal', req: true, type: 'Ref' },
            { key: 'vendor_id', label: 'Proveedor', req: true, type: 'Ref' },
            { key: 'invoice_number', label: 'Folio proveedor', req: true, type: 'Text', note: 'Único por vendor' },
            { key: 'invoice_date', label: 'Fecha factura', req: true, type: 'Date' },
            { key: 'posting_date', label: 'Fecha contabilización', req: true, type: 'Date' },
            { key: 'currency', label: 'Moneda', req: true, type: 'Enum' },
            { key: 'po_id', label: 'OC', req: 'cond', type: 'Ref' },
            { key: 'gr_id', label: 'Recepción', req: 'cond', type: 'Ref' },
            { key: 'line_unit_price', label: 'Línea · precio', req: true, type: 'Money' },
            { key: 'line_tax_code', label: 'Línea · tax', req: true, type: 'Ref' },
            { key: 'subtotal', label: 'Subtotal', req: true, type: 'Money' },
            { key: 'tax_total', label: 'Impuestos', req: true, type: 'Money' },
            { key: 'grand_total', label: 'Total', req: true, type: 'Money' },
            { key: 'due_date', label: 'Vencimiento', req: true, type: 'Date' },
            { key: 'match_status', label: 'Estado match', req: true, type: 'Enum' },
            { key: 'payment_block', label: 'Bloqueo pago', req: true, type: 'Boolean', note: 'CP' },
            { key: 'payment_block_reason', label: 'Motivo bloqueo', req: 'cond', type: 'Text' },
            { key: 'withholding_tax_code', label: 'Retención MX', req: 'cond', type: 'Ref', note: 'CP' }
          ]
        },
        {
          id: 'payprop', name: 'Programación / propuesta pagos', href: '../finanzas/programacion-pagos.html',
          purpose: 'Maker → dual control',
          mock: 'form',
          fields: [
            { key: 'invoice_ids', label: 'Facturas', req: true, type: 'Ref[]' },
            { key: 'payment_date', label: 'Fecha valor', req: true, type: 'Date' },
            { key: 'bank_account_id', label: 'Cuenta pagadora', req: true, type: 'Ref' },
            { key: 'payment_amount', label: 'Importe', req: true, type: 'Money' },
            { key: 'payment_method', label: 'Método', req: true, type: 'Enum' }
          ]
        },
        {
          id: 'aging-ap', name: 'Antigüedad CxP', href: '../finanzas/aging-ap.html',
          purpose: 'Buckets de vencimiento',
          mock: 'table',
          fields: [
            { key: 'as_of_date', label: 'Corte', req: true, type: 'Date' },
            { key: 'vendor_id', label: 'Proveedor', req: false, type: 'Ref' }
          ]
        }
      ]
    },
    {
      id: 'cxc',
      name: 'Cuentas por cobrar (CxC)',
      tagline: 'Facturas AR · cobros · aging · edo. cuenta',
      freeze: 'IN',
      color: '#047857',
      hub: '../finanzas/cxc.html',
      screens: [
        {
          id: 'ar-list', name: 'Facturas cliente', href: '../finanzas/facturas-ar.html',
          purpose: 'Lista AR',
          mock: 'table',
          fields: [
            { key: 'customer_id', label: 'Cliente', req: true, type: 'Ref' },
            { key: 'grand_total', label: 'Total', req: true, type: 'Money' },
            { key: 'open_amount', label: 'Saldo', req: true, type: 'Money' },
            { key: 'status', label: 'Estado', req: true, type: 'Enum' }
          ]
        },
        {
          id: 'receipt', name: 'Registro de cobros', href: '../finanzas/cobros.html',
          purpose: 'Aplicación a facturas',
          mock: 'form',
          fields: [
            { key: 'customer_id', label: 'Cliente', req: true, type: 'Ref' },
            { key: 'receipt_date', label: 'Fecha cobro', req: true, type: 'Date' },
            { key: 'amount', label: 'Importe recibido', req: true, type: 'Money' },
            { key: 'bank_account_id', label: 'Cuenta depósito', req: true, type: 'Ref' },
            { key: 'application_invoice_id', label: 'Factura a aplicar', req: true, type: 'Ref' },
            { key: 'application_amount', label: 'Importe aplicado', req: true, type: 'Money' }
          ]
        },
        {
          id: 'aging-ar', name: 'Antigüedad / edo. cuenta', href: '../finanzas/aging-ar.html',
          purpose: 'Consulta CxC',
          mock: 'table',
          fields: [
            { key: 'as_of_date', label: 'Corte', req: true, type: 'Date' },
            { key: 'customer_id', label: 'Cliente', req: 'cond', type: 'Ref', note: 'Obligatorio en edo. cuenta' }
          ]
        }
      ]
    },
    {
      id: 'contabilidad',
      name: 'Contabilidad (GL)',
      tagline: 'COA · periodos · asientos · mayor · balanza',
      freeze: 'IN',
      color: '#1e3a5f',
      hub: '../finanzas/contabilidad.html',
      screens: [
        {
          id: 'coa', name: 'Plan de cuentas', href: '../finanzas/plan-cuentas.html',
          purpose: 'COA ACME',
          mock: 'table',
          fields: [
            { key: 'account_code', label: 'Cuenta', req: true, type: 'Text' },
            { key: 'account_name', label: 'Nombre', req: true, type: 'Text' },
            { key: 'account_type', label: 'Tipo', req: true, type: 'Enum' },
            { key: 'allow_manual_posting', label: 'Posteo manual', req: true, type: 'Boolean' }
          ]
        },
        {
          id: 'period', name: 'Periodos', href: '../finanzas/periodos.html',
          purpose: 'OPEN / close con WF',
          mock: 'table',
          fields: [
            { key: 'fiscal_year', label: 'Año fiscal', req: true, type: 'Integer' },
            { key: 'period_id', label: 'Periodo', req: true, type: 'Text', note: 'YYYY-MM' },
            { key: 'status', label: 'Estado', req: true, type: 'Enum' },
            { key: 'start_date', label: 'Inicio', req: true, type: 'Date' },
            { key: 'end_date', label: 'Fin', req: true, type: 'Date' }
          ]
        },
        {
          id: 'je', name: 'Asientos (park / post)', href: '../finanzas/asientos.html',
          purpose: 'Pólizas balanceadas',
          mock: 'doc-lines',
          fields: [
            { key: 'document_number', label: 'Folio JE', req: true, type: 'Text' },
            { key: 'journal_date', label: 'Fecha', req: true, type: 'Date' },
            { key: 'period_id', label: 'Periodo', req: true, type: 'Ref' },
            { key: 'currency', label: 'Moneda', req: true, type: 'Enum' },
            { key: 'header_text', label: 'Concepto', req: true, type: 'Text' },
            { key: 'line_account', label: 'Línea · cuenta', req: true, type: 'Ref' },
            { key: 'line_debit', label: 'Línea · debe', req: 'cond', type: 'Money' },
            { key: 'line_credit', label: 'Línea · haber', req: 'cond', type: 'Money' },
            { key: 'balanced', label: 'Cuadrado', req: true, type: 'Boolean' }
          ]
        },
        {
          id: 'ledger', name: 'Mayor / balanza', href: '../finanzas/mayor.html',
          purpose: 'Consultas GL',
          mock: 'table',
          fields: [
            { key: 'account_code', label: 'Cuenta', req: true, type: 'Ref' },
            { key: 'period_from', label: 'Periodo desde', req: true, type: 'Ref' },
            { key: 'period_to', label: 'Periodo hasta', req: true, type: 'Ref' },
            { key: 'as_of_period', label: 'Corte balanza', req: true, type: 'Ref' }
          ]
        }
      ]
    },
    {
      id: 'tesoreria',
      name: 'Tesorería',
      tagline: 'Bancos · pagos dual · conciliación · cash',
      freeze: 'IN',
      color: '#334155',
      hub: '../finanzas/tesoreria.html',
      screens: [
        {
          id: 'bank', name: 'Cuentas bancarias', href: '../finanzas/bancos.html',
          purpose: 'Maestro banco ↔ GL',
          mock: 'form',
          fields: [
            { key: 'bank_name', label: 'Banco', req: true, type: 'Text' },
            { key: 'account_number', label: 'Número / CLABE', req: true, type: 'Text' },
            { key: 'currency', label: 'Moneda', req: true, type: 'Enum' },
            { key: 'gl_cash_account', label: 'Cuenta mayor', req: true, type: 'Ref' }
          ]
        },
        {
          id: 'pay', name: 'Órdenes de pago', href: '../finanzas/ordenes-pago.html',
          purpose: 'Checker · SoD maker≠checker',
          mock: 'form',
          fields: [
            { key: 'source_type', label: 'Origen', req: true, type: 'Enum' },
            { key: 'source_id', label: 'Documento origen', req: true, type: 'Ref' },
            { key: 'payee_id', label: 'Beneficiario', req: true, type: 'Ref' },
            { key: 'amount', label: 'Importe', req: true, type: 'Money' },
            { key: 'execution_date', label: 'Fecha valor', req: true, type: 'Date' },
            { key: 'maker_user_id', label: 'Preparador', req: true, type: 'Ref' },
            { key: 'dual_control_status', label: 'Dual control', req: true, type: 'Enum' }
          ]
        },
        {
          id: 'recon', name: 'Conciliación bancaria', href: '../finanzas/conciliacion.html',
          purpose: 'Extracto vs libro',
          mock: 'table',
          fields: [
            { key: 'bank_account_id', label: 'Cuenta', req: true, type: 'Ref' },
            { key: 'statement_date', label: 'Fecha extracto', req: true, type: 'Date' },
            { key: 'statement_balance', label: 'Saldo banco', req: true, type: 'Money' }
          ]
        },
        {
          id: 'cash', name: 'Posición de efectivo', href: '../finanzas/tesoreria.html',
          purpose: 'Cash position',
          mock: 'dashboard',
          fields: [
            { key: 'as_of_datetime', label: 'Corte', req: true, type: 'DateTime' }
          ]
        }
      ]
    },
    {
      id: 'reportes',
      name: 'Reportes / Analytics',
      tagline: 'Tablero + reportes estándar exportables',
      freeze: 'IN',
      color: '#475569',
      hub: '../reportes/index.html',
      screens: [
        {
          id: 'dash', name: 'Tablero por rol', href: '../dashboard/index.html',
          purpose: 'KPIs del núcleo',
          mock: 'dashboard',
          fields: [
            { key: 'role_context', label: 'Rol', req: true, type: 'Ref' },
            { key: 'company_context', label: 'Compañía', req: true, type: 'Ref' }
          ]
        },
        {
          id: 'std', name: 'Reportes estándar', href: '../reportes/index.html',
          purpose: 'Export sin BI embebido',
          mock: 'table',
          fields: [
            { key: 'report_code', label: 'Reporte', req: true, type: 'Enum' },
            { key: 'period_id', label: 'Periodo', req: 'cond', type: 'Ref' }
          ]
        }
      ]
    },
    /* Fuera Freeze — visibles como OUT */
    {
      id: 'rh',
      name: 'RRHH',
      tagline: 'Fuera del release-1 Freeze',
      freeze: 'OUT',
      color: '#94a3b8',
      hub: '../rh/index.html',
      screens: [
        { id: 'emp', name: 'Empleados (stub)', href: '../rh/empleados.html', purpose: 'Profesional+', mock: 'stub',
          fields: [{ key: '—', label: 'No requerido en MVP Freeze', req: false, type: '—' }] }
      ]
    },
    {
      id: 'nomina',
      name: 'Nómina',
      tagline: 'Fuera del release-1 (A4)',
      freeze: 'OUT',
      color: '#94a3b8',
      hub: '../nomina/index.html',
      screens: [
        { id: 'pay', name: 'Corrida / dispersión (stub)', href: '../nomina/corrida.html', purpose: 'Profesional+', mock: 'stub',
          fields: [{ key: '—', label: 'No requerido en MVP Freeze', req: false, type: '—' }] }
      ]
    },
    {
      id: 'activos',
      name: 'Activos fijos',
      tagline: 'Fuera del release-1',
      freeze: 'OUT',
      color: '#94a3b8',
      hub: '../activos/index.html',
      screens: [
        { id: 'fa', name: 'Alta / depreciación (stub)', href: '../activos/alta.html', purpose: 'Profesional+', mock: 'stub',
          fields: [{ key: '—', label: 'No requerido en MVP Freeze', req: false, type: '—' }] }
      ]
    }
  ]
};

window.ERPModules.byId = function (id) {
  return this.modules.find((m) => m.id === id);
};
