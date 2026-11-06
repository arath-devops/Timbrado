# Programas Sociales
## GRP-SOC · Prioridad piloto: **OUT-F1**

### Objetivo
Diseñar y operar programas de beneficio social: padrones, elegibilidad, asignación y dispersión de apoyos con control presupuestal.

### Procesos

| ID | Proceso | Descripción |
|----|---------|-------------|
| SOC-01 | Diseñar programa / reglas | Elegibilidad y montos |
| SOC-02 | Empadronar beneficiarios | Alta en padrón |
| SOC-03 | Evaluar elegibilidad | Reglas automáticas/manuales |
| SOC-04 | Asignar beneficio | Padrón aprobado del periodo |
| SOC-05 | Dispersar apoyo | Liga a tesorería/presupuesto |
| SOC-06 | Auditar padrón / depurar | Bajas y duplicados |

### Entradas
- Reglas del programa
- Datos de ciudadanos/beneficiarios
- Presupuesto etiquetado
- Validaciones de identidad

### Salidas
- Padrón
- Beneficios asignados
- Dispersiones
- Depuraciones
- Eventos: BeneficiaryEnrolled, BenefitDisbursed

### Actores
- **Operador de programa:** Gestiona padrón
- **Validador:** Elegibilidad
- **Tesorería:** Paga
- **Auditoría social / contraloría:** Supervisa

### Riesgos
- **Duplicidad de beneficiarios:** Desvío
- **Padrón capturado sin reglas:** Clientelismo / error
- **Pago sin presupuesto etiquetado:** Irregularidad

### Reglas de negocio
1. Un beneficiario no puede recibir dos veces el mismo apoyo en el mismo periodo salvo regla explícita.
2. Toda dispersión exige elegibilidad vigente + disponibilidad presupuestal.
3. Depuración de padrón es irreversible selectiva con auditoría.

### Notas de alcance (piloto)
**Fuera de Fase 1**.
