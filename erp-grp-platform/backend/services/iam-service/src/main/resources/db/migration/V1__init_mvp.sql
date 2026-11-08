-- Flyway V1 — iam-service
-- Database: iam_db
-- Document: DA-MVP-001
-- Engine: PostgreSQL
-- NOTE: Application generates UUIDs; no serial PKs.


CREATE TABLE user_account (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    username        VARCHAR(64) NOT NULL,
    email           VARCHAR(256) NOT NULL,
    display_name    VARCHAR(120),
    status          VARCHAR(32) NOT NULL,
    password_hash   VARCHAR(255),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_user_status CHECK (status IN ('ACTIVE','LOCKED','DISABLED')),
    CONSTRAINT uk_user_tenant_username UNIQUE (tenant_id, username),
    CONSTRAINT uk_user_tenant_email UNIQUE (tenant_id, email)
);
CREATE INDEX idx_user_tenant_status ON user_account (tenant_id, status);

CREATE TABLE role (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    code            VARCHAR(64) NOT NULL,
    name            VARCHAR(120) NOT NULL,
    description     VARCHAR(255),
    permissions     JSONB NOT NULL DEFAULT '[]'::jsonb,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT uk_role_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE user_role (
    user_id         UUID NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
    role_id         UUID NOT NULL REFERENCES role(id) ON DELETE RESTRICT,
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    assigned_by     UUID NOT NULL,
    PRIMARY KEY (user_id, role_id)
);
CREATE INDEX idx_user_role_role ON user_role (role_id);

CREATE TABLE org_scope_grant (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    user_id         UUID NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
    scope_type      VARCHAR(32) NOT NULL,
    org_unit_id     UUID NOT NULL,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_org_scope_type CHECK (scope_type IN ('OU_SUBTREE','OU_EXACT')),
    CONSTRAINT uk_org_scope UNIQUE (tenant_id, user_id, scope_type, org_unit_id)
);
CREATE INDEX idx_org_scope_user ON org_scope_grant (tenant_id, user_id);

CREATE TABLE session (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    user_id         UUID NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
    revoked         BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_session_expiry CHECK (expires_at > created_at)
);
CREATE INDEX idx_session_tenant_user ON session (tenant_id, user_id);
CREATE INDEX idx_session_expires ON session (expires_at) WHERE revoked = FALSE;


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


COMMENT ON TABLE user_account IS 'IAM — tenant users';
COMMENT ON COLUMN user_account.created_by IS 'Soft ref to acting user UUID';
