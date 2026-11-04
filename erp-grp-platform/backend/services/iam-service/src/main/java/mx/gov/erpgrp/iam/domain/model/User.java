package mx.gov.erpgrp.iam.domain.model;

import mx.gov.erpgrp.common.domain.AggregateRoot;
import mx.gov.erpgrp.common.domain.TenantId;
import mx.gov.erpgrp.iam.domain.event.UserCreated;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class User extends AggregateRoot {
    private final UUID id;
    private final TenantId tenantId;
    private String username;
    private String email;
    private UserStatus status;
    private boolean mfaEnabled;
    private final Set<String> roles = new HashSet<>();

    private User(UUID id, TenantId tenantId, String username, String email) {
        this.id = id;
        this.tenantId = tenantId;
        this.username = username;
        this.email = email;
        this.status = UserStatus.ACTIVE;
        this.mfaEnabled = false;
    }

    public static User create(TenantId tenantId, String username, String email, String actor) {
        var user = new User(UUID.randomUUID(), tenantId, username, email);
        user.registerEvent(new UserCreated(UUID.randomUUID(), Instant.now(), tenantId, user.id, username, email));
        return user;
    }

    public void assignRole(String roleCode) {
        roles.add(roleCode);
    }

    public void lock() {
        this.status = UserStatus.LOCKED;
    }

    public void enableMfa() {
        this.mfaEnabled = true;
    }

    public UUID id() { return id; }
    public TenantId tenantId() { return tenantId; }
    public String username() { return username; }
    public String email() { return email; }
    public UserStatus status() { return status; }
    public boolean mfaEnabled() { return mfaEnabled; }
    public Set<String> roles() { return Set.copyOf(roles); }
}
