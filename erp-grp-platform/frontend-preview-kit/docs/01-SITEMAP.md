# Entregable 1 — Mapa completo del sistema
## Frontend Preview Kit · Municipio de Ejemplo

## 1. Sitemap

```text
Login (index.html)
└── App Shell (app.html)
    ├── Dashboard ejecutivo
    ├── Escenarios guiados (Casos 1–5)
    ├── Mapa del sistema
    ├── IAM & Seguridad
    │   ├── Usuarios · detalle · alta
    │   ├── Roles · matriz de permisos
    │   ├── Permisos
    │   ├── Organizaciones (tenant)
    │   └── Mi perfil (+ favoritos)
    ├── Organización
    │   ├── Dependencias
    │   ├── Direcciones
    │   ├── Coordinaciones
    │   ├── Departamentos
    │   ├── Puestos
    │   └── Funcionarios · consulta/edición
    ├── Catálogos
    │   ├── Generales (hub)
    │   ├── Partidas presupuestales
    │   ├── Tipos de documento
    │   ├── Tipos de solicitud
    │   └── Estados P2P
    ├── Workflow
    │   ├── Bandeja de entrada
    │   ├── Pendientes / Aprobados / Rechazados
    │   ├── Historial
    │   └── Detalle de tarea + timeline
    ├── Gestión documental
    │   ├── Expedientes · detalle
    │   ├── Documentos
    │   ├── Subir evidencia
    │   └── Visor PDF simulado + versiones
    ├── Notificaciones
    ├── Presupuesto
    │   ├── Anual (KPIs)
    │   ├── Partidas / Disponibilidad
    │   ├── Reservas / Compromisos / Movimientos
    ├── Compras (P2P)
    │   ├── Solicitudes · Nueva · Detalle
    │   ├── Aprobación · Commit Budget
    │   ├── Órdenes · Recepción · Pago
    └── Auditoría
        ├── Bitácora general
        ├── Por usuario / documento / compra
        ├── Detalle diff antes/después
        └── Trazabilidad completa por SC
```

## 2. Árbol de navegación (sidebar)

| Sección | Ítems |
|---------|--------|
| Inicio | Dashboard, Escenarios |
| Plataforma Core | IAM, Organización, Catálogos, Workflow, Documentos, Notificaciones |
| Dominios | Presupuesto, Compras (P2P), Auditoría |

Sidebar colapsable · breadcrumbs por pantalla · favoritos en perfil · menú contextual (click derecho).

## 3. Relación entre módulos

| Origen | Destino | Relación |
|--------|---------|----------|
| SC (Compras) | Workflow | StartProcess `PO_APPROVAL` |
| Workflow APPROVE | Presupuesto | CommitBudget |
| Commit OK | Compras / OC | Emisión orden |
| OC | Recepción → Pago | Cadena P2P |
| SC / OC / Pago | Documentos | Expediente + evidencias |
| Toda mutación | Auditoría | Bitácora before/after |
| IAM | Todos | JWT roles + OrgScope |
| Catálogos | Compras / Docs / Presupuesto | Valores maestros |

## 4. Flujo de navegación principal

1. **Login** → sesión Director Administración  
2. **Dashboard** → KPIs y alertas  
3. **Nueva SC** → formularios + líneas + evidencia  
4. **Bandeja Workflow** → APPROVE/REJECT + timeline  
5. **Commit Budget** → disponibilidad → compromiso  
6. **OC → Recepción → Pago**  
7. **Expediente / Visor**  
8. **Trazabilidad / Auditoría**

Atajos demo: franja de escenarios en Dashboard y ruta `#/escenarios`.
