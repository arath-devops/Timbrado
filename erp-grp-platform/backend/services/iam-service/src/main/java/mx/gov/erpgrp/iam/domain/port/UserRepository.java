package mx.gov.erpgrp.iam.domain.port;

import mx.gov.erpgrp.common.domain.TenantId;
import mx.gov.erpgrp.iam.domain.model.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(TenantId tenantId, UUID id);
    Optional<User> findByUsername(TenantId tenantId, String username);
}
