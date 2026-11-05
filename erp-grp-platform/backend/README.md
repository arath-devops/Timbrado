# Backend — Arquetipo MVP (ARCH-MVP-001)

Monorepo **Maven multi-module** Java 21 / Spring Boot 3.

## Módulos activos

- `libs/common-*` — domain, security (JWT/tenant), events, web (`ApiError`), persistence (audit fields)
- `gateway-service` — SA-GW-001
- `services/{iam,catalog,audit,workflow,document,procurement,budget}-service`

## Contratos embebidos

Cada servicio incluye:

- `src/main/resources/openapi/v1.yaml` ← `shared/openapi/<svc>/v1.yaml`
- `src/main/resources/db/migration/V1__init_mvp.sql` ← `database/flyway/<svc>/V1__init_mvp.sql`

## Build

```bash
mvn -B verify
```

## Run deps

```bash
docker compose -f ../infrastructure/docker/docker-compose.mvp.yml up -d
```
