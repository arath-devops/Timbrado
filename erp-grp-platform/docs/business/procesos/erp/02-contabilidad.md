# Contabilidad
## ERP-ACC · Prioridad piloto: **F1 parcial / F2**

### Objetivo
Mantener el System of Record contable bajo partida doble, con asientos auditables, periodos fiscales y generación de balanzas/estados básicos.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| ACC-01 | Administrar plan de cuentas | Alta/versión de cuentas y naturaleza |
| ACC-02 | Registrar asiento | Captura de póliza con líneas debe/haber |
| ACC-03 | Contabilizar / postear asiento | Cambio a estado POSTED inmutable |
| ACC-04 | Extornar asiento | Reverso controlado generando asiento espejo |
| ACC-05 | Cerrar periodo fiscal | Validaciones de balance y bloqueo |
| ACC-06 | Emitir balanza / mayor | Consultas y extractos |
| ACC-07 | Integrar asientos automáticos | Desde compras, nómina, tesorería, activos, inventarios |

### Entradas
- Plan de cuentas institucional
- Eventos de dominio origen (factura, pago, nómina, depreciación)
- Dimensiones (centro, partida, proyecto)
- Periodo fiscal abierto

### Salidas
- Asientos POSTED
- Balanza de comprobación
- Mayor por cuenta
- Periodo cerrado
- Eventos: JournalEntryPosted, JournalEntryReversed, FiscalPeriodClosed

### Actores
- **Contador:** Captura y contabiliza
- **Jefe de contabilidad:** Aprueba/cierra
- **Sistemas origen:** Generan asientos automáticos
- **Auditor:** Revisa integridad

### Riesgos
- **Asientos desbalanceados:** Corrupción del libro
- **Doble contabilización:** Por reintentos de integración
- **Cierre con pendientes:** Estados financieros incorrectos

### Reglas de negocio
1. Todo asiento POSTED debe cumplir ΣDébitos = ΣCréditos en la moneda de registro.
2. Un asiento POSTED es inmutable; solo se corrige por extorno.
3. No se postea en periodo CERRADO.
4. Las integraciones deben ser idempotentes (Idempotency-Key / inbox).
5. Toda línea puede exigir cuenta + dimensiones mínimas definidas por política.
6. Segregación: quien captura no puede cerrar periodo en solitario (SoD).

### Notas de alcance (piloto)
En Fase 1 solo si es indispensable para cerrar el pago municipal; no suite contable completa en MVP.
