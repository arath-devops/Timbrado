CREATE TABLE budget_cycle (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    fiscal_year INT NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by VARCHAR(128) NOT NULL,
    modified_at TIMESTAMPTZ NOT NULL,
    modified_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    UNIQUE(tenant_id, fiscal_year)
);

CREATE TABLE budget_allocation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    cycle_id UUID NOT NULL REFERENCES budget_cycle(id),
    clave VARCHAR(64) NOT NULL,
    authorized NUMERIC(19,4) NOT NULL,
    committed NUMERIC(19,4) NOT NULL DEFAULT 0,
    accrued NUMERIC(19,4) NOT NULL DEFAULT 0,
    paid NUMERIC(19,4) NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by VARCHAR(128) NOT NULL,
    modified_at TIMESTAMPTZ NOT NULL,
    modified_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    UNIQUE(tenant_id, cycle_id, clave),
    CONSTRAINT chk_budget_balances CHECK (
        authorized >= committed AND committed >= accrued AND accrued >= paid
    )
);

CREATE TABLE budget_movement (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    allocation_id UUID NOT NULL REFERENCES budget_allocation(id),
    movement_type VARCHAR(32) NOT NULL,
    amount NUMERIC(19,4) NOT NULL,
    currency CHAR(3) NOT NULL,
    reference_type VARCHAR(64) NOT NULL,
    reference_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by VARCHAR(128) NOT NULL
);

CREATE INDEX idx_budget_alloc_tenant_status ON budget_allocation(tenant_id, status);
CREATE INDEX idx_budget_mov_alloc ON budget_movement(allocation_id, created_at DESC);
