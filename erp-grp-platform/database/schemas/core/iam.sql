CREATE TABLE users (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    username        VARCHAR(128) NOT NULL,
    email           VARCHAR(256) NOT NULL,
    status          VARCHAR(32) NOT NULL,
    mfa_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL,
    created_by      VARCHAR(128) NOT NULL,
    modified_at     TIMESTAMPTZ NOT NULL,
    modified_by     VARCHAR(128) NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_users_tenant_username UNIQUE (tenant_id, username)
);

CREATE TABLE user_roles (
    user_id     UUID NOT NULL REFERENCES users(id),
    role_code   VARCHAR(64) NOT NULL,
    PRIMARY KEY (user_id, role_code)
);

CREATE TABLE roles (
    id          UUID PRIMARY KEY,
    tenant_id   UUID NOT NULL,
    code        VARCHAR(64) NOT NULL,
    name        VARCHAR(128) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL,
    created_by  VARCHAR(128) NOT NULL,
    modified_at TIMESTAMPTZ NOT NULL,
    modified_by VARCHAR(128) NOT NULL,
    version     BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_roles_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE permissions (
    id          UUID PRIMARY KEY,
    code        VARCHAR(128) NOT NULL UNIQUE,
    resource    VARCHAR(128) NOT NULL,
    action      VARCHAR(64) NOT NULL
);

CREATE TABLE role_permissions (
    role_id         UUID NOT NULL REFERENCES roles(id),
    permission_id   UUID NOT NULL REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE sessions (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    user_id         UUID NOT NULL REFERENCES users(id),
    revoked         BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL
);

CREATE TABLE outbox (
    id              UUID PRIMARY KEY,
    aggregate_type  VARCHAR(128) NOT NULL,
    aggregate_id    VARCHAR(64) NOT NULL,
    event_type      VARCHAR(128) NOT NULL,
    payload         TEXT NOT NULL,
    tenant_id       UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL,
    published_at    TIMESTAMPTZ NULL
);

CREATE INDEX idx_users_tenant_status ON users(tenant_id, status);
CREATE INDEX idx_sessions_tenant_user ON sessions(tenant_id, user_id);
CREATE INDEX idx_outbox_unpublished ON outbox(published_at) WHERE published_at IS NULL;
