-- Fase login: empresa (tenant) + módulos de menú por rol

CREATE TABLE tenant (
    id              UUID PRIMARY KEY,
    code            VARCHAR(64) NOT NULL,
    name            VARCHAR(200) NOT NULL,
    status          VARCHAR(32) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT ck_tenant_status CHECK (status IN ('ACTIVE','DISABLED')),
    CONSTRAINT uk_tenant_code UNIQUE (code)
);

ALTER TABLE role
    ADD COLUMN IF NOT EXISTS modules JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON TABLE tenant IS 'Empresa / tenant — código usado en login (campo empresa)';
COMMENT ON COLUMN role.modules IS 'Códigos de módulo de menú asignados al rol (ej. erp.ap, core.catalog)';
