package mx.gov.erpgrp.common.domain;

import java.time.Instant;

public record AuditMeta(
        String createdBy,
        Instant createdAt,
        String modifiedBy,
        Instant modifiedAt,
        long version
) {
    public static AuditMeta create(String actor) {
        var now = Instant.now();
        return new AuditMeta(actor, now, actor, now, 0L);
    }

    public AuditMeta touch(String actor) {
        return new AuditMeta(createdBy, createdAt, actor, Instant.now(), version + 1);
    }
}
