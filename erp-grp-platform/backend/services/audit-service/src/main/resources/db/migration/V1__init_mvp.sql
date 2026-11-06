-- Flyway V1 — audit-service
-- Database: audit_db
-- Document: DA-MVP-001
-- Engine: PostgreSQL
-- NOTE: Application generates UUIDs; no serial PKs.


CREATE TABLE audit_fact (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    entity_type     VARCHAR(120) NOT NULL,
    entity_id       UUID NOT NULL,
    action          VARCHAR(64) NOT NULL,
    actor           UUID NOT NULL,
    actor_type      VARCHAR(16) NOT NULL DEFAULT 'USER',
    before_state    JSONB,
    after_state     JSONB,
    correlation_id  UUID,
    causation_id    UUID,
    request_id      UUID,
    trace_id        VARCHAR(64),
    source_service  VARCHAR(128),
    occurred_at     TIMESTAMPTZ NOT NULL,
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    content_hash    VARCHAR(128),
    CONSTRAINT ck_audit_actor_type CHECK (actor_type IN ('USER','SYSTEM','M2M'))
);
CREATE INDEX idx_audit_entity_timeline ON audit_fact (tenant_id, entity_type, entity_id, recorded_at);
CREATE INDEX idx_audit_correlation ON audit_fact (tenant_id, correlation_id);
CREATE INDEX idx_audit_actor ON audit_fact (tenant_id, actor, recorded_at DESC);

-- Append-only: revoke UPDATE/DELETE from app role in ops (not in V1 DDL for portability)


CREATE TABLE idempotency_record (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    idempotency_key UUID NOT NULL,
    request_hash    VARCHAR(128) NOT NULL,
    response_body   JSONB,
    http_status     INT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ,
    CONSTRAINT uk_idempotency_tenant_key UNIQUE (tenant_id, idempotency_key)
);
CREATE INDEX idx_idempotency_expires ON idempotency_record (expires_at);


COMMENT ON TABLE audit_fact IS 'Append-only audit facts; no updated_at/version by design';
