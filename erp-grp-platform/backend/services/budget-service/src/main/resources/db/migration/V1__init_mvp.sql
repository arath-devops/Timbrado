-- Flyway V1 — budget-service
-- Database: budget_db
-- Document: DA-MVP-001
-- Engine: PostgreSQL
-- NOTE: Application generates UUIDs; no serial PKs.


CREATE TABLE budget_cycle (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    code            VARCHAR(32) NOT NULL,
    fiscal_year     INT NOT NULL,
    name            VARCHAR(120) NOT NULL,
    status          VARCHAR(32) NOT NULL,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_cycle_status CHECK (status IN ('DRAFT','ACTIVE','CLOSED')),
    CONSTRAINT ck_cycle_year CHECK (fiscal_year BETWEEN 2000 AND 2100),
    CONSTRAINT uk_cycle_tenant_code UNIQUE (tenant_id, code),
    CONSTRAINT uk_cycle_tenant_year UNIQUE (tenant_id, fiscal_year)
);

CREATE TABLE budget_allocation (
    id                  UUID PRIMARY KEY,
    tenant_id           UUID NOT NULL,
    cycle_id            UUID NOT NULL REFERENCES budget_cycle(id) ON DELETE RESTRICT,
    code                VARCHAR(64) NOT NULL,
    name                VARCHAR(200) NOT NULL,
    category_code       VARCHAR(64),
    org_unit_id         UUID,
    status              VARCHAR(32) NOT NULL,
    authorized_amount   NUMERIC(19,4) NOT NULL,
    committed_amount    NUMERIC(19,4) NOT NULL DEFAULT 0,
    accrued_amount      NUMERIC(19,4) NOT NULL DEFAULT 0,
    paid_amount         NUMERIC(19,4) NOT NULL DEFAULT 0,
    currency            CHAR(3) NOT NULL DEFAULT 'MXN',

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_alloc_status CHECK (status IN ('ACTIVE','FROZEN','CLOSED')),
    CONSTRAINT ck_alloc_currency CHECK (currency = 'MXN'),
    CONSTRAINT ck_alloc_amounts CHECK (
        authorized_amount >= committed_amount
        AND committed_amount >= accrued_amount
        AND accrued_amount >= paid_amount
        AND authorized_amount >= 0
    ),
    CONSTRAINT uk_alloc_tenant_cycle_code UNIQUE (tenant_id, cycle_id, code)
);
CREATE INDEX idx_alloc_tenant_status ON budget_allocation (tenant_id, status);
CREATE INDEX idx_alloc_cycle ON budget_allocation (cycle_id);

CREATE TABLE budget_movement (
    id                  UUID PRIMARY KEY,
    tenant_id           UUID NOT NULL,
    allocation_id       UUID NOT NULL REFERENCES budget_allocation(id) ON DELETE RESTRICT,
    movement_type       VARCHAR(32) NOT NULL,
    amount              NUMERIC(19,4) NOT NULL,
    currency            CHAR(3) NOT NULL DEFAULT 'MXN',
    reference_type      VARCHAR(64) NOT NULL,
    reference_id        UUID NOT NULL,
    idempotency_key     UUID,
    available_after     NUMERIC(19,4),
    failure_code        VARCHAR(64),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by          UUID NOT NULL,
    CONSTRAINT ck_mov_type CHECK (movement_type IN ('COMMIT','RELEASE')),
    CONSTRAINT ck_mov_amount CHECK (amount > 0),
    CONSTRAINT ck_mov_currency CHECK (currency = 'MXN'),
    CONSTRAINT ck_mov_reference_type CHECK (reference_type IN ('PURCHASE_ORDER','PURCHASE_REQUISITION','PURCHASE_REQUEST'))
);
CREATE UNIQUE INDEX uk_mov_idempotency ON budget_movement (tenant_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX idx_mov_allocation_time ON budget_movement (allocation_id, created_at DESC);
CREATE INDEX idx_mov_reference ON budget_movement (tenant_id, reference_type, reference_id);


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


COMMENT ON TABLE budget_movement IS 'Append-only fund movements; COMMIT/RELEASE only in MVP';
COMMENT ON CONSTRAINT ck_alloc_amounts ON budget_allocation IS 'Invariants authorized>=committed>=accrued>=paid';
