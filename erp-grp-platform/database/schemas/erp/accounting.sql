CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    version_label VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by VARCHAR(128) NOT NULL,
    modified_at TIMESTAMPTZ NOT NULL,
    modified_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE account (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    chart_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    code VARCHAR(64) NOT NULL,
    name VARCHAR(256) NOT NULL,
    account_type VARCHAR(32) NOT NULL,
    nature VARCHAR(16) NOT NULL,
    UNIQUE(tenant_id, chart_id, code)
);

CREATE TABLE journal_entry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    number VARCHAR(64) NOT NULL,
    accounting_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL,
    total_debit NUMERIC(19,4) NOT NULL,
    total_credit NUMERIC(19,4) NOT NULL,
    currency CHAR(3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by VARCHAR(128) NOT NULL,
    modified_at TIMESTAMPTZ NOT NULL,
    modified_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    UNIQUE(tenant_id, number),
    CONSTRAINT chk_journal_balanced CHECK (total_debit = total_credit)
);

CREATE TABLE journal_line (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    journal_entry_id UUID NOT NULL REFERENCES journal_entry(id),
    account_id UUID NOT NULL REFERENCES account(id),
    debit NUMERIC(19,4) NOT NULL DEFAULT 0,
    credit NUMERIC(19,4) NOT NULL DEFAULT 0,
    cost_center_id UUID NULL,
    budget_item_id UUID NULL
);

CREATE INDEX idx_journal_tenant_date ON journal_entry(tenant_id, accounting_date DESC);
CREATE INDEX idx_journal_line_account ON journal_line(tenant_id, account_id);
