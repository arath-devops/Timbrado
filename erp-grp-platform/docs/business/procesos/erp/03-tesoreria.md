# Tesorería
## ERP-TRE · Prioridad piloto: **F1 parcial**

### Objetivo
Administrar liquidez: cuentas bancarias, programación y ejecución de pagos, registro de cobros y conciliación bancaria.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| TRE-01 | Administrar cuentas bancarias | Alta de cuentas, firmantes, monedas |
| TRE-02 | Programar orden de pago | A partir de facturas/nómina/otros pasivos |
| TRE-03 | Ejecutar pago / dispersión | Envío a banco o registro de pago |
| TRE-04 | Registrar cobro | Ingresos por clientes/contribuyentes |
| TRE-05 | Conciliar extracto bancario | Matching movimientos vs libro |
| TRE-06 | Controlar firmas / autorizaciones | Workflow de liberación de pagos |

### Entradas
- Facturas por pagar / nómina aprobada / liquidaciones
- Extractos bancarios
- Catálogo de beneficiarios
- Disponibilidad presupuestal (sector público)
- Cuentas bancarias

### Salidas
- Órdenes de pago
- Pagos ejecutados
- Cobros registrados
- Conciliaciones
- Eventos: PaymentOrderCreated, PaymentExecuted, CollectionRegistered, BankReconciled

### Actores
- **Tesorero:** Programa y ejecuta
- **Director:** Autoriza pagos sensibles
- **Cajero / operador:** Registra cobros
- **Contador:** Recibe impacto contable
- **Auditor:** Revisa conciliación

### Riesgos
- **Pago duplicado:** Pérdida financiera
- **Pago sin afectación presupuestal:** Irregularidad en sector público
- **Fuga de datos bancarios:** Riesgo de seguridad

### Reglas de negocio
1. Ningún pago municipal se ejecuta sin compromiso/devengo presupuestal válido cuando aplique.
2. Montos sobre umbral requieren MFA step-up y doble autorización.
3. Las órdenes de pago son idempotentes respecto al documento origen.
4. No se concilian movimientos ya conciliados.
5. Beneficiario debe estar activo y validado en catálogo/proveedores.

### Notas de alcance (piloto)
En Fase 1: pagos ligados al ciclo P2P del MVP; conciliación avanzada puede diferirse.
