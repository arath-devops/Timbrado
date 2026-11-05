CREATE TABLE purchase_requisition (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    number VARCHAR(64) NOT NULL,
    requester_id UUID NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by VARCHAR(128) NOT NULL,
    modified_at TIMESTAMPTZ NOT NULL,
    modified_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    UNIQUE(tenant_id, number)
);

CREATE TABLE purchase_order (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    number VARCHAR(64) NOT NULL,
    supplier_id UUID NOT NULL,
    status VARCHAR(32) NOT NULL,
    total_amount NUMERIC(19,4) NOT NULL,
    currency CHAR(3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by VARCHAR(128) NOT NULL,
    modified_at TIMESTAMPTZ NOT NULL,
    modified_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    UNIQUE(tenant_id, number)
);

CREATE TABLE po_line (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    purchase_order_id UUID NOT NULL REFERENCES purchase_order(id),
    line_no INT NOT NULL,
    sku VARCHAR(64) NOT NULL,
    qty NUMERIC(19,6) NOT NULL,
    unit_price NUMERIC(19,4) NOT NULL,
    UNIQUE(purchase_order_id, line_no)
);

CREATE TABLE goods_receipt (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    purchase_order_id UUID NOT NULL REFERENCES purchase_order(id),
    received_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by VARCHAR(128) NOT NULL
);
