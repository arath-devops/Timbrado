#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Levantando infraestructura local (Postgres, Redis, Kafka, Observability)"
docker compose -f infrastructure/docker/docker-compose.yml up -d

echo "==> Esperando Postgres..."
until docker compose -f infrastructure/docker/docker-compose.yml exec -T postgres pg_isready -U erpgrp >/dev/null 2>&1; do
  sleep 2
done

echo "==> Infra lista."
echo "Siguiente:"
echo "  cd backend && mvn -pl services/iam-service -am spring-boot:run"
echo "  cd backend && mvn -pl services/budget-service -am spring-boot:run"
echo "  cd frontend/apps/shell && npm install && npm start"
