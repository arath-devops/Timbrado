package mx.gov.erpgrp.common.security;

import mx.gov.erpgrp.common.domain.TenantId;

public final class TenantContext {
    private static final ThreadLocal<TenantId> CURRENT = new ThreadLocal<>();

    private TenantContext() {}

    public static void set(TenantId tenantId) {
        CURRENT.set(tenantId);
    }

    public static TenantId require() {
        var tenantId = CURRENT.get();
        if (tenantId == null) {
            throw new IllegalStateException("TenantContext is not set");
        }
        return tenantId;
    }

    public static void clear() {
        CURRENT.remove();
    }
}
