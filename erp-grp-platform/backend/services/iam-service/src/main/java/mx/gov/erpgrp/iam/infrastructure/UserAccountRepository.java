package mx.gov.erpgrp.iam.infrastructure;

import java.util.Optional;
import java.util.UUID;
import mx.gov.erpgrp.iam.domain.UserAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccountEntity, UUID> {
    Optional<UserAccountEntity> findByTenantIdAndUsernameIgnoreCase(UUID tenantId, String username);
}
