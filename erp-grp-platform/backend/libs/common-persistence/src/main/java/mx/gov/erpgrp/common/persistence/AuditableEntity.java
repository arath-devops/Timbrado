package mx.gov.erpgrp.common.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Version;

import java.time.Instant;
import java.util.UUID;

@MappedSuperclass
public abstract class AuditableEntity {

    @Column(name = "tenant_id", nullable = false, updatable = false)
    private UUID tenantId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "created_by", nullable = false, updatable = false, length = 128)
    private String createdBy;

    @Column(name = "modified_at", nullable = false)
    private Instant modifiedAt;

    @Column(name = "modified_by", nullable = false, length = 128)
    private String modifiedBy;

    @Version
    @Column(name = "version", nullable = false)
    private long version;

    @PrePersist
    void prePersist() {
        var now = Instant.now();
        createdAt = now;
        modifiedAt = now;
        if (createdBy == null) {
            createdBy = "system";
        }
        if (modifiedBy == null) {
            modifiedBy = createdBy;
        }
    }

    @PreUpdate
    void preUpdate() {
        modifiedAt = Instant.now();
    }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    public Instant getCreatedAt() { return createdAt; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public Instant getModifiedAt() { return modifiedAt; }
    public String getModifiedBy() { return modifiedBy; }
    public void setModifiedBy(String modifiedBy) { this.modifiedBy = modifiedBy; }
    public long getVersion() { return version; }
}
