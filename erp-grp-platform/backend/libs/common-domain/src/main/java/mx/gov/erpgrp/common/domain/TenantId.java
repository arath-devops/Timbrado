package mx.gov.erpgrp.common.domain;

import java.util.Objects;
import java.util.UUID;

public record TenantId(UUID value) {
    public TenantId {
        Objects.requireNonNull(value, "tenantId is required");
    }

    public static TenantId of(String raw) {
        return new TenantId(UUID.fromString(raw));
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
