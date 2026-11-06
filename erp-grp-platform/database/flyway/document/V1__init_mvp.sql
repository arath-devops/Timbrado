-- Flyway V1 — document-service
-- Database: document_db
-- Document: DA-MVP-001
-- Engine: PostgreSQL
-- NOTE: Application generates UUIDs; no serial PKs.


CREATE TABLE case_file (
    id                      UUID PRIMARY KEY,
    tenant_id               UUID NOT NULL,
    title                   VARCHAR(200) NOT NULL,
    status                  VARCHAR(32) NOT NULL,
    owning_bounded_context  VARCHAR(64) NOT NULL,
    aggregate_type          VARCHAR(64),
    aggregate_id            UUID,
    org_unit_id             UUID,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_case_file_status CHECK (status IN ('OPEN','CLOSED'))
);
CREATE INDEX idx_case_file_tenant_status ON case_file (tenant_id, status);
CREATE INDEX idx_case_file_aggregate ON case_file (tenant_id, aggregate_type, aggregate_id);

CREATE TABLE document_item (
    id                  UUID PRIMARY KEY,
    tenant_id           UUID NOT NULL,
    case_file_id        UUID NOT NULL REFERENCES case_file(id) ON DELETE RESTRICT,
    doc_type            VARCHAR(64) NOT NULL,
    title               VARCHAR(200),
    status              VARCHAR(32) NOT NULL,
    content_type        VARCHAR(128) NOT NULL,
    size_bytes          BIGINT NOT NULL,
    storage_key         VARCHAR(512) NOT NULL,
    checksum_sha256     CHAR(64),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
,
    CONSTRAINT ck_document_status CHECK (status IN ('AVAILABLE','QUARANTINED','DELETED')),
    CONSTRAINT ck_document_size CHECK (size_bytes >= 0)
);
CREATE INDEX idx_document_case ON document_item (tenant_id, case_file_id);
CREATE INDEX idx_document_status ON document_item (tenant_id, status);

CREATE TABLE document_link (
    id                  UUID PRIMARY KEY,
    tenant_id           UUID NOT NULL,
    document_id         UUID NOT NULL REFERENCES document_item(id) ON DELETE CASCADE,
    bounded_context     VARCHAR(64) NOT NULL,
    aggregate_type      VARCHAR(64) NOT NULL,
    aggregate_id        UUID NOT NULL,
    relation            VARCHAR(32) NOT NULL DEFAULT 'SUPPORTING',
    linked_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    linked_by           UUID NOT NULL,
    CONSTRAINT ck_document_relation CHECK (relation IN ('SUPPORTING','PRIMARY','ANNEX')),
    CONSTRAINT uk_document_link UNIQUE (tenant_id, document_id, bounded_context, aggregate_type, aggregate_id)
);
CREATE INDEX idx_document_link_aggregate ON document_link (tenant_id, bounded_context, aggregate_type, aggregate_id);


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


COMMENT ON COLUMN document_item.storage_key IS 'Object storage key; binary not stored in PostgreSQL';
