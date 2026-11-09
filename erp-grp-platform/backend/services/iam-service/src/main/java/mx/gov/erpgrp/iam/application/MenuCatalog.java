package mx.gov.erpgrp.iam.application;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Menú hamburguesa: solo módulos presentes en el token del usuario. */
public final class MenuCatalog {

    private record Def(String id, String label, String route, String module, String section) {}

    private static final List<Def> ALL = List.of(
            new Def("dashboard", "Inicio", "/dashboard", "core.shell", "Inicio"),
            new Def("bandeja", "Bandeja de aprobación", "/bandeja", "core.workflow", "Inicio"),
            new Def("catalogos", "Catálogos", "/catalogos", "core.catalog", "Administración"),
            new Def("usuarios", "Usuarios y permisos", "/usuarios", "core.iam", "Administración"),
            new Def("compras", "Compras", "/compras", "erp.procurement", "Operación"),
            new Def("inventarios", "Inventarios", "/inventarios", "erp.inventory", "Operación"),
            new Def("ventas", "Ventas", "/ventas", "erp.ar", "Operación"),
            new Def("cxp", "Cuentas por pagar", "/cxp", "erp.ap", "Finanzas"),
            new Def("facturacion", "Facturación", "/facturacion", "erp.billing", "Finanzas"),
            new Def("cxc", "Cuentas por cobrar", "/cxc", "erp.ar", "Finanzas"),
            new Def("contabilidad", "Contabilidad", "/contabilidad", "erp.accounting", "Finanzas"),
            new Def("tesoreria", "Tesorería", "/tesoreria", "erp.treasury", "Finanzas"),
            new Def("documentos", "Documentos", "/documentos", "core.document", "Plataforma"),
            new Def("auditoria", "Auditoría", "/auditoria", "core.audit", "Plataforma"),
            new Def("reportes", "Reportes", "/reportes", "core.report", "Plataforma")
    );

    private MenuCatalog() {}

    public static List<MenuNode> forModules(Set<String> modules) {
        Map<String, MenuNode> sections = new LinkedHashMap<>();
        for (Def def : ALL) {
            if (!modules.contains(def.module())) {
                continue;
            }
            MenuNode section = sections.computeIfAbsent(def.section(), s -> new MenuNode(s, s, null, null, new ArrayList<>()));
            section.children().add(new MenuNode(def.id(), def.label(), def.route(), def.module(), List.of()));
        }
        return List.copyOf(sections.values());
    }

    public record MenuNode(String id, String label, String route, String module, List<MenuNode> children) {}
}
