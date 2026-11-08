-- Flyway V1 — procurement-service
-- Database: procurement_db
-- Document: DA-MVP-001
-- Engine: PostgreSQL
-- NOTE: Application generates UUIDs; no serial PKs.


CREATE TABLE purchase_requisition (
    id                      UUID PRIMARY KEY,
    tenant_id               UUID NOT NULL,
    status                  VARCHAR(32) NOT NULL,
    org_unit_id             UUID NOT NULL,
    allocation_id           UUID NOT NULL,
    case_file_id            UUID,
    currency                CHAR(3) NOT NULL DEFAULT 'MXN',
    total_amount            NUMERIC(19,4) NOT NULL,
    justification           VARCHAR(1000),
    process_instance_id     UUID,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_req_status CHECK (status IN ('DRAFT','SUBMITTED','APPROVED','REJECTED','CANCELLED')),
    CONSTRAINT ck_req_currency CHECK (currency = 'MXN'),
    CONSTRAINT ck_req_total CHECK (total_amount >= 0)
);
CREATE INDEX idx_req_tenant_status ON purchase_requisition (tenant_id, status);
CREATE INDEX idx_req_allocation ON purchase_requisition (tenant_id, allocation_id);

CREATE TABLE purchase_requisition_line (
    id              UUID PRIMARY KEY,
    requisition_id  UUID NOT NULL REFERENCES purchase_requisition(id) ON DELETE CASCADE,
    line_no         INT NOT NULL,
    description     VARCHAR(500) NOT NULL,
    quantity        NUMERIC(19,4) NOT NULL,
    unit_price      NUMERIC(19,4) NOT NULL,
    unit_code       VARCHAR(32),
    line_total      NUMERIC(19,4) NOT NULL,
    CONSTRAINT uk_req_line_no UNIQUE (requisition_id, line_no),
    CONSTRAINT ck_req_line_qty CHECK (quantity > 0),
    CONSTRAINT ck_req_line_price CHECK (unit_price >= 0)
);

CREATE TABLE purchase_order (
    id                      UUID PRIMARY KEY,
    tenant_id               UUID NOT NULL,
    status                  VARCHAR(32) NOT NULL,
    requisition_id          UUID REFERENCES purchase_requisition(id) ON DELETE RESTRICT,
    org_unit_id             UUID NOT NULL,
    allocation_id           UUID NOT NULL,
    supplier_code           VARCHAR(64) NOT NULL,
    case_file_id            UUID,
    currency                CHAR(3) NOT NULL DEFAULT 'MXN',
    total_amount            NUMERIC(19,4) NOT NULL,
    notes                   VARCHAR(1000),
    process_instance_id     UUID,
    budget_movement_id      UUID,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_po_status CHECK (status IN ('DRAFT','SUBMITTED','APPROVED','REJECTED','CANCELLED')),
    CONSTRAINT ck_po_currency CHECK (currency = 'MXN'),
    CONSTRAINT ck_po_total CHECK (total_amount >= 0)
);
CREATE INDEX idx_po_tenant_status ON purchase_order (tenant_id, status);
CREATE INDEX idx_po_allocation ON purchase_order (tenant_id, allocation_id);
CREATE INDEX idx_po_supplier ON purchase_order (tenant_id, supplier_code);

CREATE TABLE purchase_order_line (
    id                  UUID PRIMARY KEY,
    purchase_order_id   UUID NOT NULL REFERENCES purchase_order(id) ON DELETE CASCADE,
    line_no             INT NOT NULL,
    description         VARCHAR(500) NOT NULL,
    quantity            NUMERIC(19,4) NOT NULL,
    unit_price          NUMERIC(19,4) NOT NULL,
    unit_code           VARCHAR(32),
    line_total          NUMERIC(19,4) NOT NULL,
    CONSTRAINT uk_po_line_no UNIQUE (purchase_order_id, line_no),
    CONSTRAINT ck_po_line_qty CHECK (quantity > 0),
    CONSTRAINT ck_po_line_price CHECK (unit_price >= 0)
);


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


COMMENT ON COLUMN purchase_order.allocation_id IS 'Soft ref to budget_db.budget_allocation.id';
COMMENT ON COLUMN purchase_order.case_file_id IS 'Soft ref to document_db.case_file.id';
COMMENT ON COLUMN purchase_order.budget_movement_id IS 'Soft ref to budget_db.budget_movement.id when COMMITTED';
