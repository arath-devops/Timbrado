# Glosario ERP para desarrollo
## ERP-GL-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-GL-001 |
| Propósito | Que el equipo hable el mismo idioma: español de negocio + identificadores técnicos en inglés |
| Rama | `feat-ERP` |

---

## 1. Regla de uso

| Dónde | Idioma |
|-------|--------|
| Documentos de producto, comentarios de PR, historias de usuario | **Español** |
| Etiquetas de interfaz de usuario | **Español** |
| Nombres de campo API / columnas BD / enums de estado / códigos de flujo | **Inglés** (estable, sin traducir el identificador) |
| Descripciones OpenAPI (`summary` / `description`) | **Español** |

Ejemplo: campo API `credit_limit` · etiqueta UI «Límite de crédito» · regla en español en la matriz.

---

## 2. Alcance y gobierno

| Término EN | Español | Notas |
|------------|---------|--------|
| Scope Freeze | Congelamiento de alcance | ERP-SF-001 |
| Gate A/B/C/D | Puerta A/B/C/D | Decisiones / controles / pantallas / dinero |
| IN / OUT | DENTRO / FUERA | Del release MVP |
| DoR / DoD | Definición de listo / Definición de hecho | |
| VoBo | Visto bueno | Aprobación formal |
| Control Pack | Paquete de control | ERP-CP-001 |
| Object page | Ficha / pantalla objeto | Cabecera + líneas + pestañas |
| Shell | Envoltorio de aplicación | Menú, barra, bandeja |
| Stub | Marcador / simulación | Módulo no operable aún |
| Bounded context | Contexto delimitado | DDD |
| Tenant | Inquilino / organización cliente | Multi-empresa SaaS |
| Legal entity (LE) | Entidad legal / compañía | `legal_entity_id` |
| RBAC | Control de acceso por roles | |
| SoD | Segregación de funciones | Quién no puede hacer qué junto |
| Dual control | Doble control | Dos personas en un pago |
| Park / Post | Guardar / Contabilizar | Crear ≠ postear |
| Maker / Checker | Ejecutor / Verificador | Tesorería TRE / TRE2 |
| Idempotency-Key | Clave de idempotencia | Evita doble pago/aprobación |
| Audit trail / AuditFact | Rastro / hecho de auditoría | before/after |
| OpenAPI | Contrato HTTP OpenAPI | Spec de API |
| Flyway | Migraciones de base de datos | |
| Saga | Orquestación de pasos entre servicios | Kafka/comandos |

---

## 3. Ciclos de negocio

| Sigla | Español | Significado |
|-------|---------|------------|
| P2P | Compras a pago | Requisición → OC → Recepción → CxP → Pago |
| O2C | Pedido a cobro | Pedido → Entrega → Factura → Cobro |
| R2R | Registro a reporte | Contabilidad / cierre |
| ATP | Disponible para prometer | Existencia − reservado |

---

## 4. Módulos financieros

| Sigla / EN | Español |
|------------|---------|
| GL | Contabilidad general / libro mayor |
| AP / CxP | Cuentas por pagar |
| AR / CxC | Cuentas por cobrar |
| Billing | Facturación |
| Treasury | Tesorería |
| COA | Plan de cuentas |
| Journal | Asiento / póliza |
| Trial balance | Balanza de comprobación |
| FS / EEFF | Estados financieros |
| Aging | Antigüedad de saldos |
| Match / 3-way match | Cuadre / cuadre triple (OC×Recepción×Factura) |
| 2-way match | Cuadre doble (OC×Factura) |
| GR / Goods receipt | Recepción de mercancías |
| PO | Orden de compra (OC) |
| PR | Requisición de compra |
| SO | Pedido de venta |
| CFDI | Comprobante fiscal digital (MX) |
| Withholding | Retención de impuestos |
| FX / Exchange rate | Tipo de cambio |
| Credit limit / block | Límite / bloqueo de crédito |
| Payment proposal | Propuesta / programación de pagos |
| Bank reconciliation | Conciliación bancaria |

---

## 5. Compras, inventario, ventas

| EN | Español |
|----|---------|
| Vendor | Proveedor |
| Customer | Cliente |
| Item / SKU | Artículo / producto |
| Warehouse | Almacén |
| Qty on hand | Existencia física |
| Qty reserved | Cantidad reservada |
| Qty available | Cantidad disponible |
| UoM | Unidad de medida |
| Cost center | Centro de costo |
| Account assignment | Asignación contable |
| Delivery / DN | Entrega / remisión |
| Price list | Lista de precios |

---

## 6. Estados frecuentes (código → español UI)

| Código | Texto UI sugerido |
|--------|-------------------|
| DRAFT | Borrador |
| SUBMITTED | Enviada |
| PENDING_APPROVAL | Pendiente de aprobación |
| APPROVED | Aprobada |
| REJECTED | Rechazada |
| OPEN | Abierto |
| CLOSED | Cerrado |
| POSTED | Contabilizada |
| PAID | Pagada |
| PARTIALLY_PAID | Pago parcial |
| PARTIALLY_RECEIVED | Recibo parcial |
| RECEIVED | Recibida |
| SENT | Enviada |
| ISSUED | Emitida |
| CONFIRMED | Confirmado |
| DELIVERED | Entregado |
| INVOICED | Facturado |
| BLOCKED | Bloqueado |
| ACTIVE | Activo |
| MATCHED | Cuadrado |
| CREDIT_BLOCKED / CREDIT_HOLD | Crédito bloqueado / retenido |
| HARD_CLOSE / SOFT_CLOSE | Cierre duro / cierre suave |
| VOID / CANCELLED | Anulada / Cancelada |

---

## 7. Roles (código → español)

| Código | Rol |
|--------|-----|
| EMP | Empleado / solicitante |
| BUY | Comprador |
| INV | Encargado de almacén |
| SAL | Vendedor |
| AP | Contador CxP |
| AR | Contador CxC |
| GL | Contador general |
| TRE / TRE2 | Tesorería ejecutor / aprobador |
| APPR | Aprobador / gerente |
| ADM | Administrador |
| CFO | Director financiero |
| DG | Director general |
| AUD | Auditor |
| HR / PAY | RRHH / Nómina (fuera release-1) |

---

## 8. Documentos del paquete ERP

| Código | Título en español |
|--------|-------------------|
| ERP-SI-001 | Inventario de pantallas |
| ERP-FM-001 | Matriz de campos y reglas |
| ERP-XR-001 | Revisión ejecutiva de brechas |
| ERP-UX-001 | Revisión UX del preview por roles |
| ERP-SF-001 | Congelamiento de alcance MVP |
| ERP-CP-001 | Paquete de control MVP |
| ERP-GL-001 | Este glosario |

---

**Fin ERP-GL-001**
