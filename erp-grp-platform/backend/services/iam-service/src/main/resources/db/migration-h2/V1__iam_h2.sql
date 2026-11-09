-- Esquema H2 compatible (perfil local / tests)

CREATE TABLE tenant (
    id              UUID PRIMARY KEY,
    code            VARCHAR(64) NOT NULL,
    name            VARCHAR(200) NOT NULL,
    status          VARCHAR(32) NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_tenant_code UNIQUE (code)
);

CREATE TABLE user_account (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    username        VARCHAR(64) NOT NULL,
    email           VARCHAR(256) NOT NULL,
    display_name    VARCHAR(120),
    status          VARCHAR(32) NOT NULL,
    password_hash   VARCHAR(255),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_user_tenant_username UNIQUE (tenant_id, username),
    CONSTRAINT uk_user_tenant_email UNIQUE (tenant_id, email)
);

CREATE TABLE role (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    code            VARCHAR(64) NOT NULL,
    name            VARCHAR(120) NOT NULL,
    description     VARCHAR(255),
    permissions     VARCHAR(4000) NOT NULL DEFAULT '[]',
    modules         VARCHAR(4000) NOT NULL DEFAULT '[]',
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_role_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE user_role (
    user_id         UUID NOT NULL,
    role_id         UUID NOT NULL,
    assigned_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    assigned_by     UUID NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE org_scope_grant (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    user_id         UUID NOT NULL,
    scope_type      VARCHAR(32) NOT NULL,
    org_unit_id     UUID NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE session (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    user_id         UUID NOT NULL,
    revoked         BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL
);
