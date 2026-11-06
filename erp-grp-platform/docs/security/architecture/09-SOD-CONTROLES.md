# 9. Segregación de funciones (SoD) y controles
## SEC-ARCH-001

## 9.1 Pares SoD críticos

| ID | Conflicto | Mitigación |
|----|-----------|------------|
| SOD-01 | Crear requisición/OC **y** aprobar la misma | Deny ABAC same actor |
| SOD-02 | Aprobar OC **y** ejecutar pago | Roles distintos + enforce |
| SOD-03 | Match factura **y** ejecutar pago | Roles PUR_AP vs TRE_PAYMASTER |
| SOD-04 | Calcular nómina **y** dispersar | OUT-F1 preventivo |
| SOD-05 | Administrar roles **y** aprobar pagos U3+ | SECURITY_OFFICER vs PAYMASTER |
| SOD-06 | Modificar presupuesto **y** auditar el mismo cambio sin 2da línea | Auditor read-only |
| SOD-07 | Grant TENANT_ALL a sí mismo | Requiere Dual control / maker-checker |

## 9.2 Controles operativos

| Control | Frecuencia |
|---------|------------|
| Revisión de accesos (UAR) | Trimestral |
| Revisión de excepciones break-glass | Semanal |
| Monitoreo fallos MFA / locks | Continuo |
| Recertificación de approval_limit | Semestral |
| Pruebas de aislamiento multi-tenant | Cada release |

## 9.3 Break-glass

1. Rol `ADMIN`/`SUPER_ADMIN` + MFA step-up  
2. Motivo obligatorio  
3. `AUDIT_BREAK_GLASS` + notify Security Officer  
4. Ticket con expiración de elevación (TTL corto)

## 9.4 Justificación final del modelo

Este diseño permite al municipio piloto operar Compras+Presupuesto con control realista de autoridad (org/depto/monto), sin construir cientos de roles nominativos, y escala a Holding multi-empresa cuando el `sectorProfile` cambie.
