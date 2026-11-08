#!/usr/bin/env python3
"""Genera el dossier técnico PDF del Sistema ERP (release-1 Freeze)."""
from pathlib import Path
from datetime import date
from fpdf import FPDF

OUT_DIR = Path(__file__).resolve().parent
REPO_ART = Path("/opt/cursor/artifacts")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_M = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

BRAND = (10, 110, 209)
INK = (26, 35, 50)
MUTED = (74, 85, 104)
LINE = (216, 222, 230)
SOFT = (232, 243, 252)


class Dossier(FPDF):
    def __init__(self):
        super().__init__(format="A4", unit="mm")
        self.set_auto_page_break(auto=True, margin=18)
        self.add_font("Body", "", FONT)
        self.add_font("Body", "B", FONT_B)
        self.add_font("Mono", "", FONT_M)
        self.alias_nb_pages()

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Body", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 6, "Sistema ERP · Dossier técnico · ERP-SF-001 · feat-ERP", align="L")
        self.ln(2)
        self.set_draw_color(*LINE)
        self.line(10, 12, 200, 12)
        self.ln(6)

    def footer(self):
        self.set_y(-12)
        self.set_font("Body", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 8, f"Confidencial · Página {self.page_no()}/{{nb}}", align="C")

    def h1(self, text):
        self.set_font("Body", "B", 16)
        self.set_text_color(*BRAND)
        self.multi_cell(0, 8, text)
        self.ln(2)
        self.set_draw_color(*BRAND)
        self.set_line_width(0.4)
        self.line(self.l_margin, self.get_y(), 200, self.get_y())
        self.ln(4)

    def h2(self, text):
        self.ln(2)
        self.set_font("Body", "B", 12)
        self.set_text_color(*INK)
        self.multi_cell(0, 7, text)
        self.ln(1)

    def h3(self, text):
        self.set_font("Body", "B", 10)
        self.set_text_color(*BRAND)
        self.multi_cell(0, 6, text)
        self.ln(0.5)

    def p(self, text):
        self.set_font("Body", "", 10)
        self.set_text_color(*INK)
        self.multi_cell(0, 5.2, text)
        self.ln(1.5)

    def bullet(self, text, indent=6):
        x = self.l_margin
        self.set_x(x)
        self.set_font("Body", "", 10)
        self.set_text_color(*INK)
        self.cell(indent, 5.2, "•")
        self.multi_cell(0, 5.2, text)
        self.ln(0.4)

    def kv(self, key, value):
        y = self.get_y()
        x = self.l_margin
        self.set_xy(x, y)
        self.set_font("Body", "B", 10)
        self.set_text_color(*INK)
        self.cell(52, 5.5, key)
        self.set_font("Body", "", 10)
        self.set_text_color(*MUTED)
        self.set_xy(x + 52, y)
        self.multi_cell(190 - 52, 5.5, value)

    def mono(self, text):
        self.set_font("Mono", "", 8)
        self.set_text_color(*INK)
        self.set_fill_color(*SOFT)
        self.multi_cell(0, 4.5, text, fill=True)
        self.ln(2)

    def table(self, headers, rows, col_w=None):
        if col_w is None:
            usable = 190
            col_w = [usable / len(headers)] * len(headers)
        self.set_font("Body", "B", 8)
        self.set_fill_color(*BRAND)
        self.set_text_color(255, 255, 255)
        for i, h in enumerate(headers):
            self.cell(col_w[i], 6.5, h, border=0, fill=True)
        self.ln()
        self.set_text_color(*INK)
        self.set_font("Body", "", 8)
        fill = False
        for row in rows:
            # estimate height
            max_h = 6.5
            for i, cell in enumerate(row):
                lines = self.multi_cell(col_w[i], 4.5, str(cell), dry_run=True, output="LINES")
                max_h = max(max_h, 4.5 * len(lines) + 1)
            if self.get_y() + max_h > self.page_break_trigger:
                self.add_page()
                self.set_font("Body", "B", 8)
                self.set_fill_color(*BRAND)
                self.set_text_color(255, 255, 255)
                for i, h in enumerate(headers):
                    self.cell(col_w[i], 6.5, h, border=0, fill=True)
                self.ln()
                self.set_text_color(*INK)
                self.set_font("Body", "", 8)
            y0 = self.get_y()
            x0 = self.l_margin
            if fill:
                self.set_fill_color(247, 248, 250)
            else:
                self.set_fill_color(255, 255, 255)
            self.rect(x0, y0, sum(col_w), max_h, style="F")
            x = x0
            for i, cell in enumerate(row):
                self.set_xy(x, y0 + 0.8)
                self.multi_cell(col_w[i], 4.5, str(cell))
                x += col_w[i]
            self.set_y(y0 + max_h)
            fill = not fill
        self.ln(3)


def build():
    pdf = Dossier()
    pdf.set_margins(10, 14, 10)

    # ===== PORTADA =====
    pdf.add_page()
    pdf.set_fill_color(*BRAND)
    pdf.rect(0, 0, 210, 70, style="F")
    pdf.set_y(28)
    pdf.set_font("Body", "B", 11)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 6, "DOCUMENTO TÉCNICO DE PROYECTO", align="C")
    pdf.ln(10)
    pdf.set_font("Body", "B", 26)
    pdf.cell(0, 12, "Sistema ERP", align="C")
    pdf.ln(12)
    pdf.set_font("Body", "", 12)
    pdf.cell(0, 7, "Núcleo operativo comercial · Release-1 (Freeze)", align="C")
    pdf.ln(40)

    pdf.set_text_color(*INK)
    pdf.set_font("Body", "", 11)
    meta = [
        ("Código de documento", "ERP-DOSSIER-001"),
        ("Nombre del proyecto", "Sistema ERP"),
        ("Producto", "ERP empresarial (capa privada / comercial)"),
        ("Rama / track", "feat-ERP"),
        ("Congelamiento", "ERP-SF-001 (VoBo 2026-11-07)"),
        ("Piloto de referencia", "ACME Industrial (México)"),
        ("Estado", "Listo para inicio de desarrollo (arquitectura cerrada)"),
        ("Fecha", date.today().isoformat()),
        ("Idioma", "Español (identificadores API en inglés)"),
        ("Clasificación", "Uso interno · equipo de producto e ingeniería"),
    ]
    for k, v in meta:
        pdf.kv(k + ":", v)
    pdf.ln(10)
    pdf.set_font("Body", "", 9)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(
        0,
        5,
        "Este dossier resume qué se está desarrollando, el alcance congelado, "
        "la arquitectura/arquetipo técnico, los entregables del release-1 y los "
        "criterios de aceptación. No sustituye OpenAPI ni la matriz de campos; "
        "los referencia.",
    )

    # ===== 1. DESCRIPCIÓN =====
    pdf.add_page()
    pdf.h1("1. Descripción del proyecto")
    pdf.p(
        "El Sistema ERP es una plataforma de gestión empresarial orientada a PyME y "
        "empresa mediana en México. Cubre el ciclo operativo de compras a pago (P2P), "
        "pedido a cobro ligero (O2C), finanzas (contabilidad, CxP, CxC, facturación, "
        "tesorería) e inventario básico, sobre una plataforma común de identidad, "
        "workflow, documentos, auditoría y catálogos."
    )
    pdf.p(
        "El producto es exclusivamente ERP comercial. El presupuesto público / GRP "
        "(CONAC, ciudadano, transparencia) y expansiones tipo suite SAP completa "
        "(manufactura avanzada, WMS, TMS, etc.) quedan fuera de este proyecto y se "
        "gestionan en iniciativas separadas (ADR-014)."
    )
    pdf.h3("Problema que resuelve")
    pdf.bullet("Fragmentación de compras, inventario, facturación y tesorería en hojas/sistemas aislados.")
    pdf.bullet("Falta de controles financieros: crédito, match 3-way, dual control de pagos, park/post.")
    pdf.bullet("Necesidad de trazabilidad (expediente + auditoría) y multi-entidad legal en un mismo tenant.")
    pdf.h3("Propuesta de valor del release-1")
    pdf.bullet("Operar punta a punta P2P + O2C ligero + GL/AP/AR/Billing/Treasury + inventario ATP.")
    pdf.bullet("Controles del Paquete de Control (ERP-CP-001) desde el día uno.")
    pdf.bullet("Arquitectura de microservicios con contratos OpenAPI y eventos listos para implementar.")

    # ===== 2. OBJETIVOS / METAS =====
    pdf.h1("2. Objetivos y metas")
    pdf.h2("2.1 Objetivos de negocio")
    pdf.bullet("Digitalizar el ciclo Procure-to-Pay con aprobaciones y recepción controlada.")
    pdf.bullet("Habilitar ventas con validación de crédito y facturación (CFDI vía puerto/adaptador).")
    pdf.bullet("Tener libro contable y posición de efectivo confiables (park/post, periodos, dual pago).")
    pdf.bullet("Entregar un piloto operable en tenant ACME México (MXN, RFC, catálogos fiscales).")
    pdf.h2("2.2 Objetivos técnicos")
    pdf.bullet("Implementar servicios del mapa ERP-MS-001 sobre el arquetipo Java/Spring existente.")
    pdf.bullet("Respetar contratos en shared/openapi/erp/ y eventos ERP-EV-001 (sin budget-service).")
    pdf.bullet("Aplicar SoD ejecutable (ERP-SOD-001) y 6 workflows Freeze (ERP-WF-001).")
    pdf.bullet("Front Angular de producto alineado al inventario SI / preview HTML (no sustituye front final).")
    pdf.h2("2.3 Metas medibles del release-1")
    pdf.table(
        ["Meta", "Indicador"],
        [
            ["Ciclo P2P cerrado", "PR → OC → GR → factura AP → pago dual en UAT ACME"],
            ["Ciclo O2C ligero", "SO + crédito → entrega → factura → cobro"],
            ["Controles CP", "100% controles obligatorios del Control Pack en TX críticas"],
            ["SoD", "Casos SOD-T01…T06 en verde en CI/integración"],
            ["Observabilidad", "Correlation-Id + auditoría en mutaciones de negocio"],
            ["Localización MX", "RFC, IVA, retenciones, uso CFDI / UUID donde aplique"],
        ],
        [70, 120],
    )

    # ===== 3. ALCANCE =====
    pdf.h1("3. Alcance (congelado ERP-SF-001)")
    pdf.h2("3.1 Dentro (DENTRO / IN)")
    pdf.p(
        "Núcleo operativo: P2P + O2C ligero + finanzas operativas + inventario básico + plataforma."
    )
    pdf.table(
        ["Dominio", "Objetos / capacidades"],
        [
            ["Plataforma", "Login, launchpad, bandeja WF, notificaciones, perfil, expediente, auditoría, usuarios, roles, org, catálogos"],
            ["Maestros", "Proveedor (+banco/hold), Cliente (+crédito), Artículo, COA, periodos, bancos, centros de costo"],
            ["Compras P2P", "Requisición, OC, recepción, factura CxP + match, propuesta de pagos, aging CxP"],
            ["Ventas O2C", "Pedido, crédito, entrega, factura cliente/CFDI, cobro, aging CxC / edo. cuenta"],
            ["Inventario", "Existencias ATP, movimientos IN/OUT/TRANSFER/ADJUST"],
            ["Contabilidad", "Asientos park/post, mayor, balanza, EEFF básicos"],
            ["Tesorería", "Posición de efectivo, órdenes de pago dual, conciliación"],
            ["Analítica", "Tablero por rol + reportes estándar exportables (sin BI embebido)"],
        ],
        [40, 150],
    )
    pdf.h2("3.2 Fuera (OUT) — explícito")
    pdf.bullet("Nómina profunda / IMSS-CURP como producto release-1.")
    pdf.bullet("Manufactura, WMS avanzado, TMS, CPQ, portales B2B/B2C.")
    pdf.bullet("GRP / presupuesto público / CONAC / ciudadano / transparencia.")
    pdf.bullet("Consolidación intercompañía, GRC enterprise, CRM avanzado.")
    pdf.bullet("budget-service y cualquier dependencia de CommitBudget (ADR-014).")
    pdf.h2("3.3 Decisiones de producto (Puerta A) — resumen")
    pdf.table(
        ["#", "Decisión", "Valor"],
        [
            ["A1", "País MVP", "México primero"],
            ["A2", "CFDI", "DENTRO (emisión + UUID CxP condicional)"],
            ["A3", "Retenciones", "DENTRO (Control Pack)"],
            ["A4", "Nómina", "FUERA release-1"],
            ["A5", "Multi-moneda", "Ligera (tipo de cambio obligatorio si ≠ funcional)"],
            ["A6", "Match", "3-way STOCK / 2-way SERVICIO"],
            ["A7", "Crédito", "Bloqueo duro"],
            ["A8", "Dual control pagos", "DENTRO"],
            ["A9", "Park / Post", "DENTRO"],
            ["A10", "Multi-compañía", "1–N legal entities / tenant"],
        ],
        [12, 48, 130],
    )

    # ===== 4. ENTREGABLES =====
    pdf.h1("4. Qué se pretende entregar")
    pdf.h2("4.1 Entregables de producto")
    pdf.bullet("Aplicación ERP usable por roles Freeze (solicitante, compras, almacén, AP, AR, crédito, tesorería, contador, controller, admin).")
    pdf.bullet("Tenant piloto ACME con seeds (series, umbrales, impuestos, usuarios SoD) — ERP-CFG-001.")
    pdf.bullet("Flujos WF: erp.pr.approve, erp.po.approve, erp.ap.match_exception, erp.ap.payment_dual, erp.ar.credit_exception, erp.gl.period_close.")
    pdf.bullet("Demo UX de referencia (erp-preview + atlas de módulos/campos) como especificación visual.")
    pdf.h2("4.2 Entregables de ingeniería")
    pdf.table(
        ["Capa", "Entrega"],
        [
            ["Contratos", "OpenAPI en shared/openapi/erp/* + common (X-Legal-Entity-Id)"],
            ["Eventos", "Catálogo ERP-EV-001 (topics erp.* / platform.*)"],
            ["Servicios", "Microservicios mapa ERP-MS-001 (BD por contexto, Flyway)"],
            ["Gateway", "Rutas /api/v1/**, JWT con modules erp.* + core.*"],
            ["Front", "Angular (shell + Object Pages Freeze); preview HTML no es producción"],
            ["Calidad", "Pruebas SoD, idempotencia post/pay, UAT por rol"],
            ["Ops", "Docker/Helm del arquetipo, Actuator, correlación/OTel"],
        ],
        [35, 155],
    )
    pdf.h2("4.3 Fuera de la entrega release-1")
    pdf.bullet("Integración bancaria real SPEI/host-to-host (se entrega ejecución simulada + contrato).")
    pdf.bullet("Proveedor CFDI concreto (se entrega puerto/adaptador).")
    pdf.bullet("App móvil nativa / BI embebido / portales.")

    # ===== 5. ARQUETIPO =====
    pdf.h1("5. Arquetipo técnico a utilizar")
    pdf.p(
        "Se construye sobre el arquetipo de plataforma ya existente en el monorepo "
        "(ARCH-MVP-001), adaptado al track ERP (sin budget-service en el camino feliz)."
    )
    pdf.h2("5.1 Stack")
    pdf.table(
        ["Capa", "Tecnología"],
        [
            ["Lenguaje / runtime", "Java 21"],
            ["Framework", "Spring Boot 3.3"],
            ["API", "OpenAPI 3.1 · REST /api/v1"],
            ["Persistencia", "PostgreSQL · Flyway · DB-per-service"],
            ["Mensajería", "Apache Kafka (CloudEvents envelope)"],
            ["Caché / sesión", "Redis (según arquetipo)"],
            ["Gateway", "Spring Cloud Gateway"],
            ["Seguridad", "JWT (IAM) · tenant_id · legal_entity · RBAC/SoD"],
            ["Contenedores", "Docker · Kubernetes · Helm"],
            ["Observabilidad", "Actuator · Micrometer · OpenTelemetry"],
            ["Front producto", "Angular (a implementar); preview HTML/JS de especificación"],
            ["Build", "Maven multi-module (backend/)"],
        ],
        [45, 145],
    )
    pdf.h2("5.2 Principios de arquitectura")
    pdf.bullet("Bounded contexts DDD: un servicio = una BD; sin FK cross-service.")
    pdf.bullet("Sync solo donde la invariante lo exige (ej. dual control / postings); resto eventos.")
    pdf.bullet("ERP sin dependencia de budget-service (ADR-014).")
    pdf.bullet("legal_entity_id obligatorio en transacciones; series de folio por LE.")
    pdf.bullet("Park ≠ Post; maker ≠ checker en pagos.")
    pdf.h2("5.3 Mapa de servicios (ERP-MS-001)")
    pdf.table(
        ["Servicio", "Base de datos", "Responsabilidad"],
        [
            ["iam-service", "iam_db", "Identidad, roles, scopes"],
            ["catalog-service", "catalog_db", "Catálogos, series, umbrales, tax"],
            ["workflow-service", "workflow_db", "6 procesos ERP"],
            ["document-service", "document_db", "Expedientes"],
            ["audit-service", "audit_db", "Rastro"],
            ["procurement-service", "procurement_db", "Vendor, PR, OC, GR (sin budget)"],
            ["inventory-service", "inventory_db", "Ítems, ATP, movimientos"],
            ["ap-service", "ap_db", "Facturas CxP, match, propuestas"],
            ["ar-billing-service", "ar_db", "Clientes, SO, AR, CFDI port"],
            ["accounting-service", "accounting_db", "COA, periodos, asientos"],
            ["treasury-service", "treasury_db", "Bancos, pagos, conciliación"],
        ],
        [48, 38, 104],
    )
    pdf.h3("Dependencias permitidas (resumen)")
    pdf.mono(
        "core (iam,catalog,workflow,document,audit)\n"
        "  → procurement → inventory / ap\n"
        "  → inventory ← ar-billing (Delivery)\n"
        "  → ap → treasury → accounting\n"
        "  → ar-billing → accounting / treasury\n"
        "PROHIBIDO: cualquier flecha hacia budget-service"
    )

    # ===== 6. CONTROLES =====
    pdf.h1("6. Controles, seguridad y calidad")
    pdf.h2("6.1 Paquete de control (ERP-CP-001) — extracto")
    pdf.bullet("Crédito cliente con bloqueo duro al confirmar SO / emitir factura.")
    pdf.bullet("Match 3-way / 2-way con tolerancias configurables.")
    pdf.bullet("payment_block y retenciones MX en CxP.")
    pdf.bullet("Dual control de pagos (preparador ≠ aprobador/ejecutor).")
    pdf.bullet("Park/post en asientos y documentos financieros.")
    pdf.bullet("Idempotencia en post/pay; legal_entity_id y document_number en TX.")
    pdf.h2("6.2 Segregación de funciones")
    pdf.p("Casos ejecutables en ERP-SOD-001 (proveedor vs aprobar OC; GR vs facturar; dual pago; cierre periodo; crédito; roles conflictivos).")
    pdf.h2("6.3 Roles release-1")
    pdf.p(
        "Solicitante, Compras, Almacén, AP, AR, Crédito, Tesorería, Contador, "
        "Controller financiero, Master data, Admin (break-glass). Menú filtrado por claims modules erp.* + core.*."
    )

    # ===== 7. PLAN =====
    pdf.h1("7. Enfoque de entrega (post-dossier)")
    pdf.p("Arquitectura y contratos están cerrados. Orden sugerido de implementación:")
    pdf.table(
        ["Fase", "Trabajo"],
        [
            ["0", "Asignar dueños técnicos · seeds ACME · definiciones WF JSON"],
            ["1", "procurement-service (OpenAPI ERP) + eventos PR/OC/GR"],
            ["2", "inventory-service (artículos, ATP, movimientos)"],
            ["3", "ap-service (factura, match, propuesta) + treasury (execute + SoD)"],
            ["4", "ar-billing-service (crédito, SO, factura, cobros, puerto CFDI)"],
            ["5", "accounting-service (postings, periodos, mayor/balanza)"],
            ["∥", "Angular shell + Object Pages Freeze en paralelo desde fase 1–2"],
            ["UAT", "Guiones por rol · SoD · cierre P2P/O2C en tenant ACME"],
        ],
        [18, 172],
    )

    # ===== 8. REFERENCIAS =====
    pdf.h1("8. Documentos de referencia")
    pdf.table(
        ["Código", "Documento"],
        [
            ["ERP-SF-001", "Congelamiento de alcance MVP (VoBo)"],
            ["ERP-CP-001", "Paquete de control / FM §19"],
            ["ERP-SI-001", "Inventario de pantallas"],
            ["ERP-FM-001", "Matriz de campos y reglas"],
            ["ERP-AC-001", "Acoplamiento pre-desarrollo (bloqueantes cerrados)"],
            ["ERP-MS-001", "Mapa de servicios ERP"],
            ["ERP-EV-001", "Catálogo de eventos ERP"],
            ["ERP-WF-001", "Workflows MVP (6 procesos)"],
            ["ERP-SOD-001", "Casos SoD"],
            ["ERP-CFG-001", "Config seed ACME"],
            ["ADR-014", "ERP sin budget-service GRP"],
            ["ARCH-MVP-001", "Arquetipo técnico Java/Spring"],
            ["OpenAPI", "shared/openapi/erp/*"],
            ["Preview", "erp-preview/ (+ atlas módulos/campos)"],
        ],
        [35, 155],
    )

    pdf.h1("9. Aprobaciones / uso del documento")
    pdf.p(
        "Este dossier es el artefacto de comunicación previa al desarrollo: "
        "explica el qué, el para qué y el con qué se construirá el Sistema ERP release-1. "
        "Cualquier cambio de alcance requiere enmienda a ERP-SF-001 con VoBo DG + CFO + Controller."
    )
    pdf.ln(4)
    pdf.table(
        ["Rol", "Nombre", "Fecha", "Firma / VoBo"],
        [
            ["Dueño de producto", "", "", ""],
            ["Arquitectura", "", "", ""],
            ["CFO / Controller", "", "", ""],
            ["Líder técnico", "", "", ""],
        ],
        [45, 50, 35, 60],
    )

    out_pdf = OUT_DIR / "ERP-DOSSIER-001-Sistema-ERP.pdf"
    out_pdf_art = REPO_ART / "ERP-DOSSIER-001-Sistema-ERP.pdf"
    pdf.output(str(out_pdf))
    pdf.output(str(out_pdf_art))
    print(f"Wrote {out_pdf}")
    print(f"Wrote {out_pdf_art}")
    return out_pdf


if __name__ == "__main__":
    build()
