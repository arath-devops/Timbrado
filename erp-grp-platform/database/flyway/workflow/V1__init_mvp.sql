-- Flyway V1 — workflow-service
-- Database: workflow_db
-- Document: DA-MVP-001
-- Engine: PostgreSQL
-- NOTE: Application generates UUIDs; no serial PKs.


CREATE TABLE process_definition (
    id              UUID PRIMARY KEY,
    tenant_id       UUID,
    process_key     VARCHAR(64) NOT NULL,
    version_no      INT NOT NULL,
    definition_json JSONB NOT NULL,
    active          BOOLEAN NOT NULL DEFAULT TRUE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT uk_process_def_key_ver UNIQUE (process_key, version_no)
);
CREATE INDEX idx_process_def_active ON process_definition (process_key) WHERE active = TRUE;

CREATE TABLE process_instance (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    definition_id   UUID NOT NULL REFERENCES process_definition(id) ON DELETE RESTRICT,
    process_key     VARCHAR(64) NOT NULL,
    status          VARCHAR(32) NOT NULL,
    bounded_context VARCHAR(64) NOT NULL,
    aggregate_type  VARCHAR(64) NOT NULL,
    aggregate_id    UUID NOT NULL,
    variables       JSONB NOT NULL DEFAULT '{}'::jsonb,
    correlation_id  UUID,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_process_status CHECK (status IN ('RUNNING','COMPLETED','REJECTED','CANCELLED'))
);
CREATE INDEX idx_process_tenant_status ON process_instance (tenant_id, status);
CREATE INDEX idx_process_business_ref ON process_instance (tenant_id, bounded_context, aggregate_type, aggregate_id);
CREATE INDEX idx_process_correlation ON process_instance (tenant_id, correlation_id);

CREATE TABLE task (
    id                  UUID PRIMARY KEY,
    tenant_id           UUID NOT NULL,
    process_instance_id UUID NOT NULL REFERENCES process_instance(id) ON DELETE CASCADE,
    process_key         VARCHAR(64) NOT NULL,
    name                VARCHAR(120) NOT NULL,
    status              VARCHAR(32) NOT NULL,
    outcome             VARCHAR(16),
    candidate_roles     JSONB NOT NULL DEFAULT '[]'::jsonb,
    assignee_id         UUID,
    comment_text        VARCHAR(1000),
    completed_at        TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_task_status CHECK (status IN ('OPEN','COMPLETED','CANCELLED')),
    CONSTRAINT ck_task_outcome CHECK (outcome IS NULL OR outcome IN ('APPROVE','REJECT'))
);
CREATE INDEX idx_task_inbox ON task (tenant_id, status);
CREATE INDEX idx_task_process ON task (process_instance_id);


CREATE TABLE outbox (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    aggregate_type  VARCHAR(128) NOT NULL,
    aggregate_id    UUID NOT NULL,
    event_type      VARCHAR(128) NOT NULL,
    event_version   INT NOT NULL DEFAULT 1,
    payload         JSONB NOT NULL,
    correlation_id  UUID,
    causation_id    UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at    TIMESTAMPTZ NULL
);
CREATE INDEX idx_outbox_unpublished ON outbox (created_at) WHERE published_at IS NULL;
CREATE INDEX idx_outbox_tenant_agg ON outbox (tenant_id, aggregate_type, aggregate_id);


CREATE TABLE inbox (
    event_id        UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    event_type      VARCHAR(128) NOT NULL,
    consumer_name   VARCHAR(128) NOT NULL DEFAULT 'default',
    payload         JSONB,
    received_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at    TIMESTAMPTZ NULL,
    CONSTRAINT uk_inbox_event_consumer UNIQUE (event_id, consumer_name)
);
CREATE INDEX idx_inbox_tenant_type ON inbox (tenant_id, event_type);


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

