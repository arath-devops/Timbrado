-- Flyway V1 — catalog-service
-- Database: catalog_db
-- Document: DA-MVP-001
-- Engine: PostgreSQL
-- NOTE: Application generates UUIDs; no serial PKs.


CREATE TABLE catalog_type (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    code            VARCHAR(64) NOT NULL,
    name            VARCHAR(120) NOT NULL,
    active          BOOLEAN NOT NULL DEFAULT TRUE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT uk_catalog_type_tenant_code UNIQUE (tenant_id, code),
    CONSTRAINT ck_catalog_type_code CHECK (code IN ('ORG_UNIT','BUDGET_CATEGORY','SUPPLIER_BASIC','CURRENCY','DOC_TYPE'))
);

CREATE TABLE catalog_item (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    type_id         UUID NOT NULL REFERENCES catalog_type(id) ON DELETE RESTRICT,
    type_code       VARCHAR(64) NOT NULL,
    code            VARCHAR(64) NOT NULL,
    name            VARCHAR(200) NOT NULL,
    description     VARCHAR(500),
    status          VARCHAR(32) NOT NULL,
    attributes      JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_catalog_item_status CHECK (status IN ('ACTIVE','INACTIVE')),
    CONSTRAINT uk_catalog_item_tenant_type_code UNIQUE (tenant_id, type_code, code)
);
CREATE INDEX idx_catalog_item_tenant_type_status ON catalog_item (tenant_id, type_code, status);
CREATE INDEX idx_catalog_item_attributes ON catalog_item USING GIN (attributes);


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


COMMENT ON TABLE catalog_item IS 'Master data items; deactivate instead of delete';
