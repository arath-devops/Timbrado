package mx.gov.erpgrp.common.security;

import java.util.List;
import java.util.UUID;

/**
 * CA-TEN-001 runtime tenant context.
 */
public final class TenantContext {

    public record Context(
            UUID tenantId,
            String tenantCode,
            String plane,
            UUID userId,
            List<String> roles,
            List<String> modules,
            UUID correlationId,
            UUID requestId,
            String traceId
    ) {}

    private static final ThreadLocal<Context> CURRENT = new ThreadLocal<>();

    private TenantContext() {}

    public static void set(Context context) {
        CURRENT.set(context);
    }

    public static Context get() {
        return CURRENT.get();
    }

    public static Context require() {
        Context ctx = CURRENT.get();
        if (ctx == null || ctx.tenantId() == null) {
            throw new IllegalStateException("TenantContext is not set");
        }
        return ctx;
    }

    public static UUID requireTenantId() {
        return require().tenantId();
    }

    public static void clear() {
        CURRENT.remove();
    }
}
