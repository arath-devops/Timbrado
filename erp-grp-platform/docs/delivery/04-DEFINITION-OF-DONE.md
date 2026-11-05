# 4. Definition of Done — Servicios MVP
## DEL-S1-001 · DoD-001

| Campo | Valor |
|-------|--------|
| Documento | DoD-001 |
| Roles | Engineering Manager · Tech Lead |
| Aplica a | `iam`, `catalog`, `audit`, `workflow`, `document`, `procurement`, `budget` |
| Stack | Java 21 · Spring Boot 3 · PostgreSQL · Kafka · Redis · Docker · Kubernetes |
| Entradas | SF-001, DoR-001, BL-S1-001, SA-MS-001, SEC-ARCH-001 |
| Estado | **Vigente** |
| Gate | Un servicio **no** se declara Done ni se mergea a rama liberable sin checklist PASS |

---

## 4.1 Principio

> Un servicio MVP está **Done** solo cuando el incremento es **correcto, seguro, observable, verificable y desplegable** en el entorno de integración del piloto — no cuando “compila” o “el endpoint responde en local”.

DoR controla la **entrada** a desarrollo.  
DoD controla la **salida** a “terminado / integrable / liberable”.

### Dimensiones obligatorias

| Dimensión | Pregunta de cierre |
|-----------|--------------------|
| **Código** | ¿Implementa el Baseline sin deuda bloqueante? |
| **Calidad** | ¿Pasa calidad estática, build reproducible y cobertura mínima? |
| **Seguridad** | ¿Authn/authz, secretos y superficie OWASP básica están cubiertos? |
| **Observabilidad** | ¿Logs, métricas y traces permiten diagnosticar el happy path? |
| **Testing** | ¿Unit + integration (+ contract donde aplique) demuestran los CA? |
| **Deployment** | ¿Imagen Docker + manifiestos K8s + pipeline CI verdes? |

**Regla EM/TL:** cualquier FAIL en checklist de categoría crítica (§4.3–4.12 marcados Must) bloquea Done. Waivers solo por escrito del Engineering Manager + Tech Lead, con fecha de caducidad ≤ 1 sprint.

---

## 4.2 Criterios de aceptación globales (servicio Done)

Un servicio MVP se considera **terminado** cuando cumple **todos** estos CA:

| ID | Criterio de aceptación |
|----|------------------------|
| CA-G-01 | Endpoints del Baseline del servicio están implementados y documentados en OpenAPI publicado. |
| CA-G-02 | Migraciones Flyway aplican en limpio (up) sobre PostgreSQL vacío y son reproducibles. |
| CA-G-03 | Eventos publicados/consumidos del Baseline usan envelope SA-MS y outbox/inbox idempotente. |
| CA-G-04 | Toda request de negocio valida JWT y `tenant_id`; no hay fuga cross-tenant en pruebas. |
| CA-G-05 | Logs estructurados con `correlationId` / `tenantId` / `service` en rutas críticas. |
| CA-G-06 | Métricas RED (o equivalentes) y health `liveness`/`readiness` expuestos. |
| CA-G-07 | Imagen Docker multi-stage construye en CI y arranca con health OK. |
| CA-G-08 | Manifiestos Kubernetes (Deployment/Service/Config/Secret refs/HPA opcional) aplican en entorno int. |
| CA-G-09 | Pipeline CI: compile → test → quality gate → image → (deploy int o artefacto versionado) en verde. |
| CA-G-10 | README del servicio + contrato + runbook mínimo actualizados. |
| CA-G-11 | Cobertura y quality gates de §4.13 en PASS. |
| CA-G-12 | Ningún ítem OUT del Scope Freeze implementado “de contrabando”. |
| CA-G-13 | Demo del rol del servicio en el happy path municipal verificada en integración (o contrato verificado si es dependencia pura). |
| CA-G-14 | Sin secretos en repo; configuración vía env/Secret. |

---

## 4.3 Checklist — API (Must)

| # | Ítem | Must |
|---|------|------|
| API-01 | Prefijo `/api/v1` para recursos de negocio | Yes |
| API-02 | OpenAPI 3.x generado/publicado (`/v3/api-docs` o artefacto en `shared/openapi`) alineado al código | Yes |
| API-03 | Endpoints del Baseline (BL-S1) implementados; no hay paths zombie sin doc | Yes |
| API-04 | Errores en formato `ApiError { code, message, traceId, details[] }` | Yes |
| API-05 | Códigos de negocio estables (`INSUFFICIENT_FUNDS`, etc.) documentados | Yes |
| API-06 | Validación Bean Validation / inputs; 400 en payload inválido | Yes |
| API-07 | `Authorization: Bearer` en endpoints protegidos | Yes |
| API-08 | `Idempotency-Key` en comandos críticos (commit/release y equivalentes) | Yes* |
| API-09 | `X-Correlation-Id` aceptado/propagado (generar si falta) | Yes |
| API-10 | Paginación/filtros en listados acordados (si el Baseline los exige) | If applicable |
| API-11 | Versionado: cambios breaking solo vía política `/api/v2` (no en Sprint 1 ad hoc) | Yes |
| API-12 | Actuator: `/actuator/health/liveness` y `/readiness` (sin exponer secretos) | Yes |
| API-13 | Prueba contract o smoke HTTP automatizada de paths Must | Yes |

\*Obligatorio en `budget-service` y cualquier POST con side-effect financiero/idempotente.

**CA API:** colección Postman/Bruno o tests `@SpringBootTest`/`MockMvc`/`WebTestClient` cubren 100% de paths Must del Baseline del servicio.

---

## 4.4 Checklist — Base de datos (Must)

| # | Ítem | Must |
|---|------|------|
| DB-01 | Database dedicada `{service}_db` (DB-per-service) | Yes |
| DB-02 | Flyway (o Liquibase, si ADR lo fija; default Flyway) versionado en repo | Yes |
| DB-03 | `tenant_id` en tablas de negocio multi-tenant | Yes |
| DB-04 | Campos auditoría mínimos: `created_at`, `created_by`, `updated_at`, `updated_by` | Yes |
| DB-05 | Optimistic locking (`version`) en agregados concurrentes | Yes* |
| DB-06 | Índices para queries del Baseline (FK lógicas por ID, tenant+entity, etc.) | Yes |
| DB-07 | Sin FK físicas a tablas de otro servicio | Yes |
| DB-08 | Migración `clean → migrate` verificada en CI | Yes |
| DB-09 | Seed/demo data script o job documentado (no hardcode productivo) | Yes |
| DB-10 | Política de backups referida a estándar de entorno (int/prod) | Ops |
| DB-11 | Conexión vía pool (Hikari) con límites definidos | Yes |
| DB-12 | Redis solo para cache/sesión/idempotency — no fuente de verdad de negocio | Yes |

\*Must en `budget` (movimientos) y `procurement` (OC); recomendado en demás agregados mutables.

**CA DB:** migración idempotente en pipeline; test de repositorio/agregado cubre invariantes (`authorized ≥ committed` en budget).

---

## 4.5 Checklist — Eventos (Must)

| # | Ítem | Must |
|---|------|------|
| EV-01 | Topic naming `{layer}.{domain}.events` | Yes |
| EV-02 | Envelope: `eventId`, `eventType`, `eventVersion`, `occurredAt`, `tenantId`, `correlationId`, `causationId`, `producer`, `payload` | Yes |
| EV-03 | Outbox transaccional en el mismo commit de negocio al publicar | Yes |
| EV-04 | Inbox / dedup por `eventId` (o clave idempotente) al consumir | Yes |
| EV-05 | Eventos del Baseline del servicio implementados (ni más ni menos sin CR) | Yes |
| EV-06 | Schema (Avro/JSON Schema) versionado para eventos Must | Yes |
| EV-07 | Key Kafka `tenantId:aggregateId` | Yes |
| EV-08 | Reintentos con DLQ o política documentada de poison messages | Yes |
| EV-09 | Orden/at-least-once asumido; consumidores idempotentes | Yes |
| EV-10 | Prueba de publicación/consumo (embedded/testcontainers/contract) | Yes |

**CA Eventos:** dado un comando Must, existe al menos un test que verifica outbox/evento (o consumer side-effect) sin doble aplicación.

---

## 4.6 Checklist — Seguridad (Must)

| # | Ítem | Must |
|---|------|------|
| SEC-01 | Resource Server valida JWT (JWKS IAM) en APIs de negocio | Yes |
| SEC-02 | Claim `tenant_id` obligatorio; mismatch → 401/403 | Yes |
| SEC-03 | Autorización por rol/permiso mínimo del Baseline en endpoints mutadores | Yes |
| SEC-04 | Sin secretos en código, imágenes o logs | Yes |
| SEC-05 | Secrets vía variables de entorno / K8s Secret / vault acordado | Yes |
| SEC-06 | TLS en tránsito hacia el entorno int/prod (terminación en ingress/mesh según ADR) | Yes |
| SEC-07 | Cabeceras de seguridad básicas en edge (cuando el servicio es expuesto) | Yes |
| SEC-08 | Dependencias escaneadas (OWASP Dependency-Check o Snyk/Trivy en CI) sin críticos abiertos | Yes |
| SEC-09 | Imagen escaneada (Trivy/Grype): sin vulnerabilidades **Critical** sin waiver | Yes |
| SEC-10 | Principio least privilege en ServiceAccount K8s | Yes |
| SEC-11 | No exposición pública de Actuator sensible (`env`, `heapdump` off) | Yes |
| SEC-12 | Prueba negativa cross-tenant automatizada | Yes |
| SEC-13 | MFA/SSO avanzado | Out (Scope Freeze) — no bloquea DoD MVP slice |

**CA Seguridad:** test automatizado demuestra rechazo cross-tenant; scan CI en verde según umbral §4.13.

---

## 4.7 Checklist — Logs (Must)

| # | Ítem | Must |
|---|------|------|
| LOG-01 | Logging estructurado JSON (o key=value estable) | Yes |
| LOG-02 | Campos: `timestamp`, `level`, `service`, `logger`, `message`, `correlationId`, `tenantId` | Yes |
| LOG-03 | `traceId`/`spanId` cuando hay OTel | Yes |
| LOG-04 | Nivel default INFO; DEBUG no en prod/int estable | Yes |
| LOG-05 | Sin PII sensible (passwords, tokens, secretos); enmascarar datos personales innecesarios | Yes |
| LOG-06 | Errores 5xx con stack en log, no en response body al cliente | Yes |
| LOG-07 | Access/audit de mutaciones críticas además de AuditFact de negocio | Rec |
| LOG-08 | Correlación extremo a extremo en happy path verificada manual o test | Yes |

**CA Logs:** en una traza E2E del rol del servicio, se puede seguir `correlationId` desde API → DB/outbox → evento.

---

## 4.8 Checklist — Métricas y traces (Must)

| # | Ítem | Must |
|---|------|------|
| MET-01 | Micrometer + Prometheus endpoint o OTLP metrics export | Yes |
| MET-02 | Métricas RED: rate, errors, duration por endpoint crítico | Yes |
| MET-03 | Métricas de negocio mínimas del servicio (ej. commits, OC approved) | Rec* |
| MET-04 | JVM basics (memoria, GC) disponibles | Yes |
| MET-05 | OpenTelemetry tracing instrumentado (HTTP + JDBC + Kafka) | Yes |
| MET-06 | Sampling policy documentada para int | Rec |
| MET-07 | Dashboard mínimo del servicio (o panel en dashboard MVP) enlazado | Rec |
| MET-08 | Alertas: error rate y latency p99 sobre umbral (int) | Rec |

\*Must en `budget` (`commit_total`, `commit_fail_total`) y `procurement` (`po_approved_total`).

**CA Métricas:** tras smoke E2E, `http.server.requests` (o equivalente) muestra la ruta Must; health readiness falla si DB o Kafka crítico no está disponible (según política del servicio).

---

## 4.9 Checklist — Docker (Must)

| # | Ítem | Must |
|---|------|------|
| DOCK-01 | Dockerfile multi-stage (build + runtime JRE mínimo) | Yes |
| DOCK-02 | Usuario no-root en runtime | Yes |
| DOCK-03 | Imagen basada en distroless/temurin JRE 21 acordada | Yes |
| DOCK-04 | `HEALTHCHECK` o dependencia de probes K8s documentada | Yes |
| DOCK-05 | Tags inmutables: `{service}:{semver}` y `{service}:{gitsha}` | Yes |
| DOCK-06 | `.dockerignore` excluye target/, .git, secretos | Yes |
| DOCK-07 | Build reproducible en CI (mismo Dockerfile) | Yes |
| DOCK-08 | Compose snippet o doc de arranque local del servicio + deps | Yes |
| DOCK-09 | Scan de imagen en CI (Critical = fail) | Yes |

**CA Docker:** `docker build` + run con env de int-local responde `readiness=UP` con dependencias levantadas.

---

## 4.10 Checklist — Kubernetes (Must)

| # | Ítem | Must |
|---|------|------|
| K8S-01 | Deployment con resources requests/limits | Yes |
| K8S-02 | Service ClusterIP (o acordado) | Yes |
| K8S-03 | livenessProbe y readinessProbe configurados | Yes |
| K8S-04 | ConfigMap para config no sensible | Yes |
| K8S-05 | Secret refs para credenciales DB/Kafka/Redis | Yes |
| K8S-06 | ServiceAccount dedicado least privilege | Yes |
| K8S-07 | Pod anti-affinity / topology — opcional en int | Rec |
| K8S-08 | HPA — opcional Sprint 1; documentado si no aplica | Rec |
| K8S-09 | NetworkPolicy básica (si el cluster la exige) | If applicable |
| K8S-10 | Manifiestos en `/infrastructure` o chart Helm versionado | Yes |
| K8S-11 | Rolling update strategy sin downtime de readiness | Yes |
| K8S-12 | Aplicación verificada en namespace de integración | Yes |

**CA K8s:** `kubectl rollout status` OK; probes verdes; pods no en `CrashLoopBackOff` tras deploy int.

---

## 4.11 Checklist — CI/CD (Must)

| # | Ítem | Must |
|---|------|------|
| CI-01 | Pipeline en PR: compile Java 21 + tests | Yes |
| CI-02 | Quality gate estático (SpotBugs/Checkstyle/PMD o Spotless + Error Prone — stack acordado) | Yes |
| CI-03 | Coverage gate (§4.13) falla el build si no se cumple | Yes |
| CI-04 | Build de imagen y push a registry del entorno | Yes |
| CI-05 | Scan dependencias + imagen | Yes |
| CI-06 | Migración DB validada (job o testcontainers) | Yes |
| CI-07 | Deploy automático o botonado a **integración** tras main/release branch | Yes |
| CI-08 | Versionamiento semántico / tag de artefacto | Yes |
| CI-09 | Bloqueo de merge si CI rojo | Yes |
| CI-10 | No deploy a producción municipal en Sprint 1 sin acta aparte | Yes (restricción) |

**CA CI/CD:** PR de ejemplo del servicio en verde; artefacto desplegado en int con health UP.

---

## 4.12 Checklist — Documentación (Must)

| # | Ítem | Must |
|---|------|------|
| DOC-01 | README del servicio: propósito, stack, cómo correr local, env vars | Yes |
| DOC-02 | OpenAPI alineado al Baseline | Yes |
| DOC-03 | Lista de eventos publicados/consumidos + schema refs | Yes |
| DOC-04 | Modelo de datos / migraciones explicadas (changelog corto) | Yes |
| DOC-05 | Runbook: fallos comunes (DB down, Kafka lag, 401 JWKS) | Yes |
| DOC-06 | Matriz de roles → endpoints (mínima) | Yes |
| DOC-07 | Referencia a DoR/DoD/Scope Freeze del MVP | Yes |
| DOC-08 | CHANGELOG o notas de versión del servicio | Yes |
| DOC-09 | Diagramas técnicos exhaustivos | No (no bloquea DoD Sprint 1) |

**CA Docs:** un ingeniero nuevo arranca el servicio en local solo con el README en ≤ 30 minutos (smoke verificable).

---

## 4.13 Calidad, testing y coberturas mínimas

### 4.13.1 Pirámide de pruebas (por servicio)

| Tipo | Qué cubre | Mínimo Done |
|------|-----------|-------------|
| **Unit** | Dominio, invariantes, mappers, policies | Obligatorias para reglas de negocio Must |
| **Integration** | API + DB (Testcontainers Postgres) | Al menos 1 por agregado/comando Must |
| **Messaging** | Outbox/consumer idempotencia | Al menos 1 publish y 1 consume si aplica |
| **Contract** | OpenAPI / pact o smoke vs stub vecino | Must en contratos críticos (`CommitBudget`, JWT) |
| **Security** | Cross-tenant, 401 sin token, 403 rol | Must |
| **E2E plataforma** | Happy path municipal | A nivel sistema (no todo servicio lo posee solo); participación verificada |

### 4.13.2 Porcentajes mínimos de cobertura (JaCoCo line coverage)

| Ámbito | Mínimo | Notas |
|--------|--------|-------|
| **Servicio completo (line)** | **70%** | Gate CI fail &lt; 70% |
| **Paquete domain / application (core de negocio)** | **80%** | Excluir solo configs generadas |
| **Adapters (web/persistence) críticos** | **60%** | Compensar con integration tests |
| **Branches en invariantes de fondos / estados OC** | **90%** | `budget` movimientos; `procurement` state machine |
| **Exclusiones permitidas** | — | DTOs puro, configs Spring, generated sources — listadas en `jacoco` |

| Métrica estática | Umbral |
|------------------|--------|
| SpotBugs / Error Prone | 0 findings **High/Critical** sin waiver |
| Dependencias CVE Critical | 0 sin waiver EM |
| Duplicación (opcional CPD) | Informativa Sprint 1; no gate duro |

### 4.13.3 Criterios de aceptación de testing

| ID | Criterio |
|----|----------|
| CA-T-01 | `./mvnw verify` (o Gradle equivalente) verde en CI con coverage gate. |
| CA-T-02 | Testcontainers (o Postgres de CI) ejercita migraciones reales. |
| CA-T-03 | Al menos un test de idempotencia donde el Baseline lo exige. |
| CA-T-04 | Al menos un test de rechazo cross-tenant. |
| CA-T-05 | Mutaciones Must generan verificación de AuditFact (directa o vía API de audit en int). |
| CA-T-06 | No se aceptan `@Disabled` en tests Must sin ticket y waiver. |

---

## 4.14 Matriz DoD por servicio MVP (énfasis)

| Servicio | Énfasis extra para declarar Done |
|----------|----------------------------------|
| **iam-service** | JWKS, emisión token, `/me`, menus; tests de claims; Redis sesión/denylist si aplica |
| **catalog-service** | CRUD lista cerrada; deactivate; consumers pueden resolver códigos |
| **audit-service** | Append-only enforced; query por entidad; ingesta M2M autenticada |
| **workflow-service** | `PO_APPROVAL` deployado; start/complete; eventos outcome con `businessRef` |
| **document-service** | Upload a object storage; link; no binarios en Postgres; auth de descarga |
| **budget-service** | Invariante fondos; commit/release idempotentes; métricas de commit fail |
| **procurement-service** | State machine OC; integración WF+Budget+Document; sin APPROVED sin COMMITTED |

**Dependencia de Done entre servicios (integración):**

```text
iam → catalog/audit → workflow/document → budget → procurement
```

`procurement` solo puede declararse **Done de integración** cuando `budget` y `workflow` están Done (o mocks contract-approved con waiver temporal EM — no para release demo final).

---

## 4.15 Checklist maestro de cierre (sign-off)

El Tech Lead marca PASS/FAIL. Engineering Manager valida waivers.

| Dimensión | PASS |
|-----------|------|
| Código (Baseline + sin OUT) | ☐ |
| API (§4.3) | ☐ |
| Base de datos (§4.4) | ☐ |
| Eventos (§4.5) | ☐ |
| Seguridad (§4.6) | ☐ |
| Logs (§4.7) | ☐ |
| Métricas (§4.8) | ☐ |
| Docker (§4.9) | ☐ |
| Kubernetes (§4.10) | ☐ |
| CI/CD (§4.11) | ☐ |
| Documentación (§4.12) | ☐ |
| Cobertura / quality gates (§4.13) | ☐ |
| CA globales (§4.2) | ☐ |
| Participación happy path / demo | ☐ |

**Firma lógica**

| Rol | Nombre | Fecha |
|-----|--------|-------|
| Tech Lead | ________ | ________ |
| Engineering Manager | ________ | ________ |

---

## 4.16 Relación DoR ↔ DoD

| Gate | Pregunta |
|------|----------|
| DoR-1/2/3 | ¿Podemos construir / integrar / demostrar? |
| **DoD-001** | ¿El servicio está **terminado** para MVP spine? |

Sin DoR no se inicia.  
Sin DoD no se considera entregado.
