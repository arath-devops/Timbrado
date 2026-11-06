window.ERPViews = window.ERPViews || {};

/* —— Workflow —— */
ERPViews.wfList = (title, filter) => {
  const tasks = ERP.workflowTasks.filter(filter);
  return `
    ${ERPUI.crumbs([{ label: 'Workflow', href: '#/workflow/bandeja' }, { label: title }])}
    ${ERPUI.pageHeader(title, 'Motor de aprobación PO_APPROVAL · bandeja del Director de Administración.', `
      <button class="btn btn-secondary btn-sm" onclick="location.hash='#/workflow/bandeja'">Refrescar</button>
    `)}
    ${ERPUI.table(['Tarea', 'Referencia', 'Asunto', 'Monto', 'Solicitante', 'SLA', 'Prioridad', 'Estado', ''],
      tasks.map((t) => `<tr class="clickable" onclick="location.hash='#/workflow/tarea/${t.id}'">
        <td><strong>${t.id}</strong></td><td>${t.ref}</td><td>${t.title}</td>
        <td>${ERPUI.money(t.amount)}</td><td>${t.requester}</td>
        <td>${t.sla.includes('vencida') ? `<span class="badge badge-danger">${t.sla}</span>` : t.sla}</td>
        <td>${t.priority}</td><td>${ERPUI.statusBadge(t.status)}</td>
        <td><button class="btn btn-primary btn-sm" onclick="event.stopPropagation();location.hash='#/workflow/tarea/${t.id}'">Abrir</button></td>
      </tr>`).join('') || `<tr><td colspan="9">${ERPUI.empty('Sin tareas')}</td></tr>`)}`;
};

ERPViews.wfTask = (id) => {
  const t = ERP.workflowTasks.find((x) => x.id === id) || ERP.workflowTasks[0];
  const sc = ERP.purchaseRequests.find((p) => p.id === t.ref);
  return `
    ${ERPUI.crumbs([{ label: 'Bandeja', href: '#/workflow/bandeja' }, { label: t.id }])}
    ${ERPUI.pageHeader(t.title, `${t.process} · ${t.ref} · ${ERPUI.money(t.amount)}`, `
      <button class="btn btn-danger btn-sm" onclick="ERPUI.toast('Rechazo simulado — WorkflowRejected');location.hash='#/workflow/rechazados'">Rechazar</button>
      <button class="btn btn-primary btn-sm" onclick="ERPUI.toast('Aprobación simulada — WorkflowApproved');location.hash='#/escenarios/commit'">Aprobar</button>
    `)}
    <div class="split">
      <div>
        <div class="panel" style="margin-bottom:14px"><div class="panel-hd"><h3>Detalle de la tarea</h3>${ERPUI.statusBadge(t.status)}</div>
        <div class="panel-bd form-grid">
          <div class="field"><label>Solicitante</label><div>${t.requester}</div></div>
          <div class="field"><label>Dependencia</label><div>${t.ou}</div></div>
          <div class="field"><label>Asignado a</label><div>${t.assignee}</div></div>
          <div class="field"><label>Prioridad</label><div>${t.priority}</div></div>
          <div class="field full"><label>Comentario de decisión</label>
            <textarea class="control" id="wf-comment" placeholder="Motivo de aprobación o rechazo…"></textarea>
          </div>
        </div></div>
        ${sc ? `<div class="panel"><div class="panel-hd"><h3>Solicitud vinculada</h3><a href="#/compras/solicitudes/${sc.id}">Ver SC</a></div>
          <div class="panel-bd"><p style="margin:0 0 8px;color:var(--ink-2)">${sc.justification || sc.title}</p>
          <div class="chip">Partida ${sc.budgetLine || '—'}</div></div></div>` : ''}
      </div>
      <div class="panel"><div class="panel-hd"><h3>Línea de tiempo</h3></div><div class="panel-bd">
        <div class="timeline">
          <div class="tl-item done"><div class="tl-dot"></div><h4>WorkflowStarted</h4><p>Instancia creada desde ${t.ref}</p><time>05 Nov 09:49</time></div>
          <div class="tl-item done"><div class="tl-dot"></div><h4>Tarea OPEN</h4><p>Asignada a rol DIR_ADMIN / ${t.assignee}</p><time>05 Nov 09:49</time></div>
          <div class="tl-item current warn"><div class="tl-dot"></div><h4>Esperando CompleteTask</h4><p>APPROVE o REJECT con comentario</p><time>ahora</time></div>
          <div class="tl-item"><div class="tl-dot"></div><h4>WorkflowApproved / Rejected</h4><p>Evento de dominio + auditoría</p><time>—</time></div>
        </div>
      </div></div>
    </div>`;
};

/* —— Documents —— */
ERPViews.docExpedientes = () => `
  ${ERPUI.crumbs([{ label: 'Documentos' }, { label: 'Expedientes' }])}
  ${ERPUI.pageHeader('Expedientes', 'Case files vinculados a compras y procesos administrativos.', `
    <button class="btn btn-primary btn-sm" onclick="ERPUI.toast('Alta de expediente (simulado)')">Nuevo expediente</button>
  `)}
  ${ERPUI.table(['Expediente', 'Título', 'SC', 'Docs', 'Estado', 'Owner', ''],
    ERP.caseFiles.map((c) => `<tr class="clickable" onclick="location.hash='#/documentos/expedientes/${c.id}'">
      <td><strong>${c.id}</strong></td><td>${c.title}</td><td>${c.sc}</td><td>${c.docs}</td>
      <td>${ERPUI.statusBadge(c.status)}</td><td>${c.owner}</td>
      <td><a class="btn btn-ghost btn-sm" href="#/documentos?exp=${c.id}">Documentos</a></td>
    </tr>`).join(''))}`;

ERPViews.docExpediente = (id) => {
  const c = ERP.caseFiles.find((x) => x.id === id) || ERP.caseFiles[0];
  const docs = ERP.documents.filter((d) => d.exp === c.id);
  return `
    ${ERPUI.crumbs([{ label: 'Expedientes', href: '#/documentos/expedientes' }, { label: c.id }])}
    ${ERPUI.pageHeader(c.title, `${c.id} · ${c.sc}`, `
      <button class="btn btn-secondary btn-sm" onclick="location.hash='#/documentos/subir/${c.id}'">Subir evidencia</button>
    `)}
    ${ERPUI.table(['Documento', 'Tipo', 'Versión', 'Tamaño', 'Estado', 'Subido', ''],
      docs.map((d) => `<tr>
        <td><strong>${d.name}</strong></td><td>${d.type}</td><td>v${d.version}</td><td>${d.size}</td>
        <td>${ERPUI.statusBadge(d.status)}</td><td>${d.uploaded}<div style="font-size:11px;color:var(--ink-3)">${d.by}</div></td>
        <td><a class="btn btn-ghost btn-sm" href="#/documentos/visor/${d.id}">Visor</a></td>
      </tr>`).join(''))}`;
};

ERPViews.docList = () => `
  ${ERPUI.crumbs([{ label: 'Documentos' }])}
  ${ERPUI.pageHeader('Documentos', 'Repositorio documental del tenant · versionado básico.', `
    <button class="btn btn-primary btn-sm" onclick="location.hash='#/documentos/subir/EXP-COMP-0148'">Subir</button>
  `)}
  ${ERPUI.table(['ID', 'Nombre', 'Expediente', 'Tipo', 'Ver.', 'Estado', ''],
    ERP.documents.map((d) => `<tr>
      <td>${d.id}</td><td><strong>${d.name}</strong></td><td>${d.exp}</td><td>${d.type}</td>
      <td>v${d.version}</td><td>${ERPUI.statusBadge(d.status)}</td>
      <td><a class="btn btn-ghost btn-sm" href="#/documentos/visor/${d.id}">Abrir</a></td>
    </tr>`).join(''))}`;

ERPViews.docViewer = (id) => {
  const d = ERP.documents.find((x) => x.id === id) || ERP.documents[0];
  return `
    ${ERPUI.crumbs([{ label: 'Documentos', href: '#/documentos' }, { label: 'Visor' }, { label: d.id }])}
    ${ERPUI.pageHeader(d.name, `${d.exp} · tipo ${d.type} · versión ${d.version}`, `
      <button class="btn btn-secondary btn-sm" onclick="ERPUI.toast('Descarga simulada')">Descargar</button>
      <button class="btn btn-ghost btn-sm" onclick="ERPUI.toast('Nueva versión (simulado)')">Nueva versión</button>
    `)}
    <div class="split">
      <div class="pdf-viewer"><div class="pdf-page">
        <div style="text-align:right;font-size:10px;color:#666">Municipio de Ejemplo · Folio ${d.id}</div>
        <h3>${d.name.replace('.pdf', '').replace('.xml', '')}</h3>
        <p><strong>Expediente:</strong> ${d.exp}<br><strong>Tipo:</strong> ${d.type}<br><strong>Fecha:</strong> ${d.uploaded}</p>
        <hr>
        <p>Documento de evidencia simulado para la demo visual del producto. En producción el visor renderizaría el PDF/XML real desde object storage (MinIO/S3).</p>
        <p>Metadatos, firma electrónica y estampado de tiempo se mostrarían en el panel lateral.</p>
        <div style="margin-top:40px;border-top:1px solid #ddd;padding-top:12px;font-size:11px;color:#444">
          Página 1 de 1 · Preview Kit · No es un documento oficial
        </div>
      </div></div>
      <div>
        <div class="panel" style="margin-bottom:14px"><div class="panel-hd"><h3>Metadatos</h3></div><div class="panel-bd form-grid">
          <div class="field"><label>Estado</label><div>${ERPUI.statusBadge(d.status)}</div></div>
          <div class="field"><label>Tamaño</label><div>${d.size}</div></div>
          <div class="field"><label>Subido por</label><div>${d.by}</div></div>
          <div class="field"><label>Versión</label><div>v${d.version}</div></div>
          <div class="field full"><label>Checksum (simulado)</label><div><code>sha256:9f3a…c21e</code></div></div>
        </div></div>
        <div class="panel"><div class="panel-hd"><h3>Historial de versiones</h3></div><div class="panel-bd">
          <div class="timeline">
            <div class="tl-item done"><div class="tl-dot"></div><h4>v${d.version} · actual</h4><p>${d.uploaded} · ${d.by}</p><time>AVAILABLE</time></div>
            ${d.version > 1 ? `<div class="tl-item done"><div class="tl-dot"></div><h4>v1 · supersedida</h4><p>Versión inicial</p><time>histórico</time></div>` : ''}
          </div>
        </div></div>
      </div>
    </div>`;
};

ERPViews.docUpload = (expId) => `
  ${ERPUI.crumbs([{ label: 'Documentos' }, { label: 'Subir evidencia' }])}
  ${ERPUI.pageHeader('Subir evidencia documental', `Expediente ${expId}`, `
    <button class="btn btn-secondary btn-sm" onclick="history.back()">Cancelar</button>
    <button class="btn btn-primary btn-sm" onclick="ERPUI.toast('Documento cargado (simulado)');location.hash='#/documentos/expedientes/${expId}'">Cargar</button>
  `)}
  <div class="panel"><div class="panel-bd form-grid">
    <div class="field"><label>Expediente *</label><input class="control" value="${expId}" readonly></div>
    <div class="field"><label>Tipo de documento *</label>
      <select class="control">${ERP.catalogs.DOC_TYPE.map((t) => `<option value="${t.code}">${t.code} — ${t.name}</option>`).join('')}</select>
    </div>
    <div class="field full"><label>Archivo * (máx. 20 MB)</label>
      <div class="alert" style="border-style:dashed;justify-content:center;min-height:100px;align-items:center">
        Arrastre PDF/XML aquí o <button class="btn btn-ghost btn-sm" type="button" onclick="ERPUI.toast('Selector de archivo simulado')">elegir archivo</button>
      </div>
    </div>
    <div class="field full"><label>Notas</label><textarea class="control" placeholder="Descripción de la evidencia…"></textarea></div>
  </div></div>`;

/* —— Budget —— */
ERPViews.budgetHome = () => {
  const b = ERP.budget;
  return `
    ${ERPUI.crumbs([{ label: 'Presupuesto' }])}
    ${ERPUI.pageHeader('Presupuesto anual ' + b.year, 'Indicadores financieros del Municipio de Ejemplo.', `
      <button class="btn btn-secondary btn-sm" onclick="location.hash='#/presupuesto/disponibilidad'">Disponibilidad</button>
    `)}
    <div class="kpi-grid">
      <div class="kpi"><div class="label">Aprobado</div><div class="value">${ERPUI.money(b.approved)}</div><div class="delta neutral">Techo anual</div></div>
      <div class="kpi"><div class="label">Disponible</div><div class="value">${ERPUI.money(b.available)}</div><div class="delta up">Liberable</div></div>
      <div class="kpi"><div class="label">Comprometido</div><div class="value">${ERPUI.money(b.committed)}</div><div class="delta neutral">Reservas firmes</div></div>
      <div class="kpi"><div class="label">Ejercido</div><div class="value">${ERPUI.money(b.spent)}</div><div class="delta down">Pagado</div></div>
    </div>
    <div class="panel"><div class="panel-hd"><h3>Resumen por partida</h3><a href="#/presupuesto/partidas">Ver todas</a></div>
    <div class="panel-bd">${ERPUI.table(['Partida', 'Nombre', 'Disponible', 'Comprometido', 'Ejercido', '%'],
      ERP.catalogs.BUDGET_LINE.map((l) => {
        const tot = l.available + l.committed + l.spent;
        const pct = Math.round(((l.committed + l.spent) / tot) * 100);
        return `<tr class="clickable" onclick="location.hash='#/presupuesto/partidas'">
          <td><strong>${l.code}</strong></td><td>${l.name}</td>
          <td>${ERPUI.money(l.available)}</td><td>${ERPUI.money(l.committed)}</td><td>${ERPUI.money(l.spent)}</td>
          <td><div class="progress" style="width:80px;display:inline-block;vertical-align:middle"><span style="width:${pct}%"></span></div> ${pct}%</td>
        </tr>`;
      }).join(''))}</div></div>`;
};

ERPViews.budgetPartidas = () => ERPViews.budgetHome();

ERPViews.budgetDisponibilidad = () => `
  ${ERPUI.crumbs([{ label: 'Presupuesto', href: '#/presupuesto' }, { label: 'Disponibilidad' }])}
  ${ERPUI.pageHeader('Disponibilidad presupuestal', 'Consulta previa a CommitBudget · validación de partida.', `
    <button class="btn btn-primary btn-sm" onclick="location.hash='#/compras/commit/SC-2026-0148'">Ir a Commit SC-2026-0148</button>
  `)}
  <div class="panel"><div class="panel-bd form-grid">
    <div class="field"><label>Partida</label>
      <select class="control" onchange="ERPUI.toast('Disponibilidad recalculada (simulado)')">
        ${ERP.catalogs.BUDGET_LINE.map((l) => `<option>${l.code} — ${l.name}</option>`).join('')}
      </select>
    </div>
    <div class="field"><label>Monto requerido</label><input class="control" value="214800"></div>
    <div class="field"><label>Disponible</label><div style="font-size:22px;font-weight:780;color:var(--success)">${ERPUI.money(612000)}</div></div>
    <div class="field"><label>Resultado</label><div><span class="badge badge-success">SUFICIENTE</span></div></div>
  </div></div>`;

ERPViews.budgetReservas = () => `
  ${ERPUI.crumbs([{ label: 'Presupuesto' }, { label: 'Reservas' }])}
  ${ERPUI.pageHeader('Reservas', 'Pre-compromisos ligados a solicitudes en trámite.')}
  ${ERPUI.table(['ID', 'Partida', 'Monto', 'Referencia', 'Estado'],
    ERP.budget.reserves.map((r) => `<tr><td>${r.id}</td><td>${r.line}</td><td>${ERPUI.money(r.amount)}</td><td><a href="#/compras/solicitudes/${r.ref}">${r.ref}</a></td><td>${ERPUI.statusBadge(r.status)}</td></tr>`).join(''))}`;

ERPViews.budgetCompromisos = () => `
  ${ERPUI.crumbs([{ label: 'Presupuesto' }, { label: 'Compromisos' }])}
  ${ERPUI.pageHeader('Compromisos', 'Resultado de CommitBudget exitoso.')}
  ${ERPUI.table(['ID', 'Partida', 'Monto', 'SC', 'Fecha', 'Operador'],
    ERP.budget.commitments.map((c) => `<tr><td><strong>${c.id}</strong></td><td>${c.line}</td><td>${ERPUI.money(c.amount)}</td>
      <td><a href="#/compras/solicitudes/${c.ref}">${c.ref}</a></td><td>${c.when}</td><td>${c.by}</td></tr>`).join(''))}`;

ERPViews.budgetMovimientos = () => `
  ${ERPUI.crumbs([{ label: 'Presupuesto' }, { label: 'Movimientos' }])}
  ${ERPUI.pageHeader('Movimientos presupuestales', 'Bitácora financiera de la partida.')}
  ${ERPUI.table(['ID', 'Tipo', 'Monto', 'Partida', 'Fecha', 'Nota'],
    ERP.budget.movements.map((m) => `<tr><td>${m.id}</td><td><span class="badge badge-info">${m.type}</span></td>
      <td>${ERPUI.money(m.amount)}</td><td>${m.line}</td><td>${m.when}</td><td>${m.note}</td></tr>`).join(''))}`;

/* —— Procurement P2P —— */
ERPViews.scList = () => `
  ${ERPUI.crumbs([{ label: 'Compras' }, { label: 'Solicitudes' }])}
  ${ERPUI.pageHeader('Solicitudes de compra', 'Procure-to-Pay · pipeline municipal.', `
    <button class="btn btn-primary btn-sm" onclick="location.hash='#/compras/solicitudes/nueva'">Nueva solicitud</button>
  `)}
  ${ERPUI.table(['Folio', 'Título', 'Tipo', 'OU', 'Solicitante', 'Total', 'Estado', ''],
    ERP.purchaseRequests.map((p) => `<tr class="clickable" onclick="location.hash='#/compras/solicitudes/${p.id}'">
      <td><strong>${p.id}</strong></td><td>${p.title}</td><td>${p.type}</td><td>${p.ou}</td>
      <td>${p.requester}</td><td>${ERPUI.money(p.total)}</td><td>${ERPUI.statusBadge(p.status)}</td>
      <td><button class="btn btn-ghost btn-sm">Abrir</button></td>
    </tr>`).join(''))}`;

ERPViews.scNew = () => `
  ${ERPUI.crumbs([{ label: 'Solicitudes', href: '#/compras/solicitudes' }, { label: 'Nueva' }])}
  ${ERPUI.pageHeader('Nueva solicitud de compra', 'Formulario completo · validaciones de preview (cliente).', `
    <button class="btn btn-secondary btn-sm" onclick="history.back()">Cancelar</button>
    <button class="btn btn-ghost btn-sm" onclick="ERPUI.toast('Borrador guardado')">Guardar borrador</button>
    <button class="btn btn-primary btn-sm" onclick="ERPViews._submitSc(event)">Enviar a aprobación</button>
  `)}
  <div class="panel" style="margin-bottom:14px"><div class="panel-hd"><h3>Encabezado</h3></div><div class="panel-bd">
    <div class="form-grid" id="sc-form">
      <div class="field" data-req><label>Título *</label><input class="control" id="sc-title" placeholder="Ej. Adquisición de…"></div>
      <div class="field" data-req><label>Tipo de solicitud *</label>
        <select class="control">${ERP.catalogs.REQUEST_TYPE.map((t) => `<option value="${t.code}">${t.name}</option>`).join('')}</select>
      </div>
      <div class="field" data-req><label>Dependencia solicitante *</label>
        <select class="control">${ERP.orgUnits.map((o) => `<option>${o.name}</option>`).join('')}</select>
      </div>
      <div class="field" data-req><label>Partida presupuestal *</label>
        <select class="control">${ERP.catalogs.BUDGET_LINE.map((l) => `<option value="${l.code}">${l.code} — ${l.name}</option>`).join('')}</select>
      </div>
      <div class="field"><label>Prioridad</label><select class="control"><option>Alta</option><option selected>Media</option><option>Baja</option></select></div>
      <div class="field"><label>Proveedor sugerido</label><input class="control" placeholder="Razón social (opcional)"></div>
      <div class="field full" data-req><label>Justificación *</label>
        <textarea class="control" id="sc-just" placeholder="Fundamento, necesidad y fundamento normativo…"></textarea>
        <span class="error">La justificación es obligatoria (mín. 20 caracteres)</span>
      </div>
    </div>
  </div></div>
  <div class="panel" style="margin-bottom:14px"><div class="panel-hd"><h3>Partidas / líneas</h3>
    <button class="btn btn-secondary btn-sm" type="button" onclick="ERPUI.toast('Línea agregada (simulado)')">+ Línea</button></div>
    <div class="panel-bd">${ERPUI.table(['SKU', 'Descripción', 'Cant.', 'UoM', 'P. unit.', 'Importe'],
      `<tr><td><input class="control" value="NB-I5-14"></td><td><input class="control" value="Laptop i5 16GB"></td>
       <td><input class="control" value="6" style="width:70px"></td><td>PZA</td>
       <td><input class="control" value="32800" style="width:100px"></td><td>${ERPUI.money(196800)}</td></tr>
       <tr><td colspan="5" style="text-align:right"><strong>Total estimado</strong></td><td><strong>${ERPUI.money(214800)}</strong></td></tr>`)}
  </div></div>
  <div class="panel"><div class="panel-hd"><h3>Evidencias iniciales</h3></div><div class="panel-bd">
    <div class="alert">Adjunte al menos una cotización (DOC_TYPE=COT) antes del envío en producción. <a href="#/documentos/subir/EXP-COMP-0148">Subir ahora</a></div>
  </div></div>`;

ERPViews._submitSc = () => {
  const title = document.getElementById('sc-title');
  const just = document.getElementById('sc-just');
  let ok = true;
  document.querySelectorAll('#sc-form .field[data-req]').forEach((f) => f.classList.remove('invalid'));
  if (!title?.value?.trim()) { title?.closest('.field')?.classList.add('invalid'); ok = false; }
  if (!just?.value || just.value.trim().length < 20) { just?.closest('.field')?.classList.add('invalid'); ok = false; }
  if (!ok) { ERPUI.toast('Complete los campos obligatorios'); return; }
  ERPUI.toast('SC-2026-0149 enviada · WorkflowStarted (simulado)');
  location.hash = '#/compras/solicitudes/SC-2026-0148';
};

ERPViews.scDetail = (id) => {
  const p = ERP.purchaseRequests.find((x) => x.id === id) || ERP.purchaseRequests[0];
  const lines = (p.lines && p.lines.length)
    ? p.lines.map((l) => `<tr><td>${l.sku}</td><td>${l.desc}</td><td>${l.qty}</td><td>${l.unit}</td><td>${ERPUI.money(l.price)}</td><td>${ERPUI.money(l.qty * l.price)}</td></tr>`).join('')
    : `<tr><td colspan="6">${ERPUI.empty('Sin líneas detalladas en este registro demo')}</td></tr>`;
  const tl = (p.timeline && p.timeline.length ? p.timeline : [
    { label: 'Creada', when: p.created, state: 'done' },
    { label: 'Estado actual: ' + p.status, when: '—', state: 'current' }
  ]).map((s) => `
    <div class="tl-item ${s.state === 'done' ? 'done' : s.state === 'current' ? 'warn' : ''}">
      <div class="tl-dot"></div><h4>${s.label}</h4><time>${s.when}</time>
    </div>`).join('');
  return `
    ${ERPUI.crumbs([{ label: 'Solicitudes', href: '#/compras/solicitudes' }, { label: p.id }])}
    ${ERPUI.pageHeader(p.title, `${p.id} · ${p.requester} · ${p.created}`, `
      <button class="btn btn-secondary btn-sm" onclick="location.hash='#/workflow/bandeja'">Ir a bandeja</button>
      <button class="btn btn-ghost btn-sm" onclick="location.hash='#/documentos/expedientes/EXP-COMP-0148'">Expediente</button>
      <button class="btn btn-primary btn-sm" onclick="location.hash='#/compras/aprobacion/${p.id}'">Aprobar / Rechazar</button>
    `)}
    <div class="split">
      <div>
        <div class="panel" style="margin-bottom:14px"><div class="panel-hd"><h3>Resumen</h3>${ERPUI.statusBadge(p.status)}</div>
        <div class="panel-bd form-grid">
          <div class="field"><label>Tipo</label><div>${p.type}</div></div>
          <div class="field"><label>Prioridad</label><div>${p.priority}</div></div>
          <div class="field"><label>Dependencia</label><div>${p.ou}</div></div>
          <div class="field"><label>Partida</label><div>${p.budgetLine || '—'}</div></div>
          <div class="field"><label>Total</label><div style="font-size:20px;font-weight:780">${ERPUI.money(p.total)}</div></div>
          <div class="field"><label>Proveedor sugerido</label><div>${p.supplierHint || '—'}</div></div>
          <div class="field full"><label>Justificación</label><div style="color:var(--ink-2)">${p.justification || '—'}</div></div>
        </div></div>
        <div class="panel" style="margin-bottom:14px"><div class="panel-hd"><h3>Líneas</h3></div><div class="panel-bd">
          ${ERPUI.table(['SKU', 'Descripción', 'Cant.', 'UoM', 'P. unit.', 'Importe'], lines)}
        </div></div>
        <div class="panel"><div class="panel-hd"><h3>Comentarios</h3></div><div class="panel-bd">
          ${(p.comments || []).map((c) => `<div class="list-row"><div style="flex:1"><strong>${c.who}</strong><div style="font-size:13px">${c.text}</div></div><time style="font-size:11px;color:var(--ink-3)">${c.when}</time></div>`).join('') || ERPUI.empty('Sin comentarios')}
          <div class="field" style="margin-top:12px"><label>Nuevo comentario</label>
            <textarea class="control" placeholder="Escriba un comentario…"></textarea>
            <button class="btn btn-secondary btn-sm" style="margin-top:8px" onclick="ERPUI.toast('Comentario publicado (simulado)')">Publicar</button>
          </div>
        </div></div>
      </div>
      <div class="panel"><div class="panel-hd"><h3>Timeline P2P</h3></div><div class="panel-bd"><div class="timeline">${tl}</div>
        <div style="margin-top:16px;display:grid;gap:8px">
          <a class="btn btn-secondary btn-sm" href="#/compras/commit/${p.id}">Commit Budget</a>
          <a class="btn btn-secondary btn-sm" href="#/compras/ordenes">Órdenes de compra</a>
          <a class="btn btn-secondary btn-sm" href="#/auditoria/trazabilidad/${p.id}">Trazabilidad</a>
        </div>
      </div></div>
    </div>`;
};

ERPViews.scApproval = (id) => {
  const p = ERP.purchaseRequests.find((x) => x.id === id) || ERP.purchaseRequests[0];
  return `
    ${ERPUI.crumbs([{ label: p.id, href: `#/compras/solicitudes/${p.id}` }, { label: 'Aprobación' }])}
    ${ERPUI.pageHeader('Aprobación de solicitud', `${p.id} · ${ERPUI.money(p.total)}`, `
      <button class="btn btn-danger" onclick="ERPUI.toast('Solicitud rechazada');location.hash='#/workflow/rechazados'">Rechazar</button>
      <button class="btn btn-primary" onclick="ERPUI.toast('Solicitud aprobada');location.hash='#/compras/commit/${p.id}'">Aprobar y continuar</button>
    `)}
    <div class="panel"><div class="panel-bd">
      <div class="alert warning">Está actuando como <strong>DIR_ADMIN</strong>. La decisión generará WorkflowApproved/Rejected y quedará en auditoría.</div>
      <div class="field" style="margin-top:14px"><label>Comentario *</label>
        <textarea class="control" placeholder="Fundamento de la decisión…"></textarea>
      </div>
      <div class="field" style="margin-top:10px"><label>Condiciones</label>
        <label style="display:flex;gap:8px;align-items:center;font-weight:500"><input type="checkbox" checked> Validé disponibilidad presupuestal</label>
        <label style="display:flex;gap:8px;align-items:center;font-weight:500"><input type="checkbox" checked> Revisé cotizaciones del expediente</label>
      </div>
    </div></div>`;
};

ERPViews.scCommit = (id) => {
  const p = ERP.purchaseRequests.find((x) => x.id === id) || ERP.purchaseRequests[0];
  return `
    ${ERPUI.crumbs([{ label: p.id, href: `#/compras/solicitudes/${p.id}` }, { label: 'Commit Budget' }])}
    ${ERPUI.pageHeader('Commit presupuestal', 'Paso síncrono PurchaseApprovalSaga · reserva firme en partida.', `
      <button class="btn btn-secondary" onclick="history.back()">Cancelar</button>
      <button class="btn btn-primary" onclick="ERPUI.toast('BudgetCommitted · CP-2026-0090');location.hash='#/compras/ordenes/OC-NUEVA'">Confirmar commit</button>
    `)}
    <div class="panel-grid">
      <div class="panel"><div class="panel-hd"><h3>Operación</h3></div><div class="panel-bd form-grid">
        <div class="field"><label>Solicitud</label><div>${p.id}</div></div>
        <div class="field"><label>Partida</label><div>${p.budgetLine || '2461'}</div></div>
        <div class="field"><label>Monto a comprometer</label><div style="font-size:22px;font-weight:780">${ERPUI.money(p.total)}</div></div>
        <div class="field"><label>Disponible actual</label><div class="badge badge-success">SUFICIENTE</div></div>
        <div class="field full"><label>Idempotency-Key</label><div><code>idem_commit_${p.id}_v1</code></div></div>
      </div></div>
      <div class="panel"><div class="panel-hd"><h3>Efectos esperados</h3></div><div class="panel-bd">
        <div class="timeline">
          <div class="tl-item done"><div class="tl-dot"></div><h4>Validar disponibilidad</h4><p>budget-service</p></div>
          <div class="tl-item warn"><div class="tl-dot"></div><h4>CommitBudget</h4><p>Genera BudgetCommitted + movimiento</p></div>
          <div class="tl-item"><div class="tl-dot"></div><h4>Habilitar Orden de Compra</h4><p>procurement-service</p></div>
        </div>
      </div></div>
    </div>`;
};

ERPViews.poList = () => `
  ${ERPUI.crumbs([{ label: 'Compras' }, { label: 'Órdenes' }])}
  ${ERPUI.pageHeader('Órdenes de compra', 'Documentos contractuales post-commit.')}
  ${ERPUI.table(['OC', 'SC', 'Proveedor', 'Total', 'Fecha', 'Estado', ''],
    ERP.purchaseOrders.map((o) => `<tr class="clickable" onclick="location.hash='#/compras/ordenes/${o.id}'">
      <td><strong>${o.id}</strong></td><td>${o.sc}</td><td>${o.supplier}</td><td>${ERPUI.money(o.total)}</td>
      <td>${o.date}</td><td>${ERPUI.statusBadge(o.status)}</td>
      <td><a class="btn btn-ghost btn-sm" href="#/compras/recepciones">Recepción</a></td>
    </tr>`).join(''))}`;

ERPViews.poDetail = (id) => {
  if (id === 'OC-NUEVA') {
    return `
      ${ERPUI.crumbs([{ label: 'Órdenes', href: '#/compras/ordenes' }, { label: 'Nueva OC' }])}
      ${ERPUI.pageHeader('Orden de compra generada', 'Borrador OC-2026-0043 a partir de SC-2026-0148', `
        <button class="btn btn-primary" onclick="ERPUI.toast('OC emitida');location.hash='#/compras/ordenes'">Emitir OC</button>
      `)}
      <div class="alert" style="margin-bottom:14px">Commit exitoso. Complete datos de proveedor y condiciones de entrega.</div>
      <div class="panel"><div class="panel-bd form-grid">
        <div class="field"><label>Proveedor *</label><input class="control" value="Tecnología del Centro S.A. de C.V."></div>
        <div class="field"><label>Condiciones de pago</label><select class="control"><option>30 días</option><option>Contado</option></select></div>
        <div class="field"><label>Fecha entrega estimada</label><input class="control" type="date" value="2026-11-20"></div>
        <div class="field"><label>Lugar de entrega</label><input class="control" value="Almacén Central · Obras Públicas"></div>
      </div></div>`;
  }
  const o = ERP.purchaseOrders.find((x) => x.id === id) || ERP.purchaseOrders[0];
  return `
    ${ERPUI.crumbs([{ label: 'Órdenes', href: '#/compras/ordenes' }, { label: o.id }])}
    ${ERPUI.pageHeader(o.id, `${o.supplier} · ${o.sc}`, `
      <button class="btn btn-secondary btn-sm" onclick="location.hash='#/compras/recepciones'">Registrar recepción</button>
      <button class="btn btn-primary btn-sm" onclick="location.hash='#/compras/pagos'">Ir a pago</button>
    `)}
    <div class="panel"><div class="panel-bd form-grid">
      <div class="field"><label>Estado</label><div>${ERPUI.statusBadge(o.status)}</div></div>
      <div class="field"><label>Total</label><div>${ERPUI.money(o.total)}</div></div>
      <div class="field"><label>Fecha</label><div>${o.date}</div></div>
      <div class="field"><label>SC origen</label><div><a href="#/compras/solicitudes/${o.sc}">${o.sc}</a></div></div>
    </div></div>`;
};

ERPViews.receipts = () => `
  ${ERPUI.crumbs([{ label: 'Compras' }, { label: 'Recepciones' }])}
  ${ERPUI.pageHeader('Recepciones', 'Confirmación física / de servicio contra OC.')}
  ${ERPUI.table(['Recepción', 'OC', 'Fecha', 'Estado', 'Líneas'],
    ERP.receipts.map((r) => `<tr><td><strong>${r.id}</strong></td><td><a href="#/compras/ordenes/${r.oc}">${r.oc}</a></td>
      <td>${r.date}</td><td>${ERPUI.statusBadge(r.status)}</td><td>${r.lines}</td></tr>`).join(''))}
  <div class="panel" style="margin-top:14px"><div class="panel-hd"><h3>Nueva recepción</h3></div><div class="panel-bd form-grid">
    <div class="field"><label>OC *</label><select class="control">${ERP.purchaseOrders.map((o) => `<option>${o.id}</option>`).join('')}</select></div>
    <div class="field"><label>Tipo</label><select class="control"><option>Completa</option><option>Parcial</option></select></div>
    <div class="field full"><label>Observaciones</label><textarea class="control"></textarea></div>
    <div class="field full"><button class="btn btn-primary btn-sm" onclick="ERPUI.toast('Recepción registrada')">Guardar recepción</button></div>
  </div></div>`;

ERPViews.payments = () => `
  ${ERPUI.crumbs([{ label: 'Compras' }, { label: 'Pagos' }])}
  ${ERPUI.pageHeader('Pagos', 'Liquidación tesorería · vínculo CFDI / OC / recepción.')}
  ${ERPUI.table(['Pago', 'OC', 'Monto', 'Método', 'Fecha', 'Estado'],
    ERP.payments.map((p) => `<tr><td><strong>${p.id}</strong></td><td>${p.oc}</td><td>${ERPUI.money(p.amount)}</td>
      <td>${p.method}</td><td>${p.date}</td><td>${ERPUI.statusBadge(p.status)}</td></tr>`).join(''))}`;

/* —— Audit —— */
ERPViews.auditList = (title = 'Bitácora general', filterFn = () => true) => `
  ${ERPUI.crumbs([{ label: 'Auditoría' }, { label: title }])}
  ${ERPUI.pageHeader(title, 'Inmutable · antes/después · usuario · IP · acción.')}
  ${ERPUI.table(['ID', 'Fecha', 'Usuario', 'Acción', 'Entidad', 'IP', ''],
    ERP.audit.filter(filterFn).map((a) => `<tr class="clickable" onclick="location.hash='#/auditoria/detalle/${a.id}'">
      <td>${a.id}</td><td>${a.when}</td><td>${a.user}</td>
      <td><span class="badge badge-info">${a.action}</span></td><td><code>${a.entity}</code></td><td>${a.ip}</td>
      <td><button class="btn btn-ghost btn-sm">Diff</button></td>
    </tr>`).join(''))}`;

ERPViews.auditDetail = (id) => {
  const a = ERP.audit.find((x) => x.id === id) || ERP.audit[0];
  return `
    ${ERPUI.crumbs([{ label: 'Auditoría', href: '#/auditoria' }, { label: a.id }])}
    ${ERPUI.pageHeader('Detalle de auditoría', `${a.action} · ${a.entity}`)}
    <div class="panel" style="margin-bottom:14px"><div class="panel-bd form-grid">
      <div class="field"><label>Fecha</label><div>${a.when}</div></div>
      <div class="field"><label>Usuario</label><div>${a.user}</div></div>
      <div class="field"><label>IP</label><div>${a.ip}</div></div>
      <div class="field"><label>Acción</label><div>${ERPUI.statusBadge(a.action)}</div></div>
    </div></div>
    <div class="diff">
      <div><h3 style="font-size:13px;margin:0 0 8px">Antes</h3><pre class="before">${a.before}</pre></div>
      <div><h3 style="font-size:13px;margin:0 0 8px">Después</h3><pre class="after">${a.after}</pre></div>
    </div>`;
};

ERPViews.auditTrace = (scId) => `
  ${ERPUI.crumbs([{ label: 'Auditoría' }, { label: 'Trazabilidad' }, { label: scId }])}
  ${ERPUI.pageHeader('Trazabilidad completa', `Cadena de custodia de ${scId} · compra → workflow → budget → docs.`)}
  <div class="panel"><div class="panel-bd"><div class="timeline">
    <div class="tl-item done"><div class="tl-dot"></div><h4>CREATE PurchaseRequest</h4><p>abeltran · AUD-6995</p><time>05 Nov 09:48</time></div>
    <div class="tl-item done"><div class="tl-dot"></div><h4>UPDATE → SUBMITTED + WorkflowStarted</h4><p>smendoza · AUD-6998</p><time>05 Nov 11:10</time></div>
    <div class="tl-item warn"><div class="tl-dot"></div><h4>Pendiente APPROVE (DIR_ADMIN)</h4><p>Bandeja T-8841</p><time>ahora</time></div>
    <div class="tl-item"><div class="tl-dot"></div><h4>CommitBudget</h4><p>budget-service</p><time>—</time></div>
    <div class="tl-item"><div class="tl-dot"></div><h4>OC / Recepción / Pago / Evidencia</h4><p>Cadena P2P</p><time>—</time></div>
  </div>
  <div style="margin-top:16px"><a class="btn btn-secondary btn-sm" href="#/auditoria">Ver bitácora</a>
  <a class="btn btn-ghost btn-sm" href="#/compras/solicitudes/${scId}">Abrir solicitud</a></div>
  </div></div>`;

/* —— Scenarios —— */
ERPViews.scenariosHome = () => `
  ${ERPUI.crumbs([{ label: 'Escenarios' }])}
  ${ERPUI.pageHeader('Experiencia del producto', 'Cinco recorridos guiados para validar UX antes del desarrollo.', '')}
  <div class="panel-grid triple">
    ${[
      ['Caso 1', 'Crear Solicitud de Compra', '#/escenarios/crear-solicitud', 'Formulario → validación → envío → workflow'],
      ['Caso 2', 'Aprobar Solicitud', '#/escenarios/aprobar', 'Bandeja → tarea → comentario → APPROVE'],
      ['Caso 3', 'Commit Budget', '#/escenarios/commit', 'Disponibilidad → commit → habilitar OC'],
      ['Caso 4', 'Subir Evidencia', '#/escenarios/evidencia', 'Expediente → upload → visor PDF'],
      ['Caso 5', 'Consultar Auditoría', '#/escenarios/auditoria', 'Trazabilidad → diff antes/después'],
      ['Mapa', 'Sitemap & navegación', '#/mapa', 'Árbol completo del producto']
    ].map(([k, t, h, d]) => `
      <a class="panel" href="${h}"><div class="panel-bd">
        <div class="chip">${k}</div>
        <h3 style="margin:10px 0 6px">${t}</h3>
        <p style="margin:0;color:var(--ink-3);font-size:13px">${d}</p>
      </div></a>`).join('')}
  </div>`;

ERPViews.scenarioStep = (title, steps, ctaHref, ctaLabel) => `
  ${ERPUI.crumbs([{ label: 'Escenarios', href: '#/escenarios' }, { label: title }])}
  ${ERPUI.pageHeader(title, 'Guía pantalla por pantalla · haga clic en Continuar para saltar al estado demo.', `
    <a class="btn btn-primary" href="${ctaHref}">${ctaLabel}</a>
  `)}
  <div class="panel"><div class="panel-bd"><div class="timeline">
    ${steps.map((s, i) => `<div class="tl-item ${i === 0 ? 'warn' : ''}"><div class="tl-dot"></div>
      <h4>${s.t}</h4><p>${s.d}</p>${s.href ? `<p><a href="${s.href}">Abrir pantalla →</a></p>` : ''}</div>`).join('')}
  </div></div></div>`;
