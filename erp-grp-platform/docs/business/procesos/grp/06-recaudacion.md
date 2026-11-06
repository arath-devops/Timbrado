# Recaudación
## GRP-TAX · Prioridad piloto: **OUT-F1**

### Objetivo
Administrar ingresos municipales: padrones de contribuyentes, liquidaciones, cobro, rezagos y convenios, integrados a tesorería.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| TAX-01 | Administrar padrón de contribuyentes | Alta/actualización |
| TAX-02 | Determinar / liquidar contribución | Cálculo de adeudo |
| TAX-03 | Emitir recibo / línea de captura | Medio de pago |
| TAX-04 | Registrar pago | En ventanilla o pasarela |
| TAX-05 | Gestionar rezagos y requerimientos | Cobranza |
| TAX-06 | Convenios de pago | Fraccionamiento |
| TAX-07 | Conciliar ingresos con tesorería | Cuadre |

### Entradas
- Padrón predial/licencias/etc.
- Tablas de valores / tarifas
- Pagos bancarios
- Normativa fiscal municipal

### Salidas
- Liquidaciones
- Pagos
- Rezagos
- Convenios
- Ingresos conciliados
- Eventos: TaxpayerRegistered, TaxAssessmentIssued, TaxPaymentReceived

### Actores
- **Recaudador:** Liquida y cobra
- **Contribuyente:** Paga
- **Tesorero:** Cuadra ingresos
- **Jurídico:** Requerimientos

### Riesgos
- **Liquidación errónea:** Contencioso
- **Pagos no conciliados:** Huecos de caja
- **Padrón desactualizado:** Evasión / inequidad

### Reglas de negocio
1. Una liquidación pagada no se edita; se ajusta con notas de crédito/cancelaciones auditadas.
2. Todo pago genera acuse único idempotente.
3. Rezago se calcula por reglas de recargos/actualización vigentes.
4. Convenios suspenden cobranza dura solo en estados permitidos.

### Notas de alcance (piloto)
**Fuera de Fase 1**.
