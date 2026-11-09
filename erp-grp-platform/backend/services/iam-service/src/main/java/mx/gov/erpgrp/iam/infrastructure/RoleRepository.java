package mx.gov.erpgrp.iam.infrastructure;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import mx.gov.erpgrp.iam.domain.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<RoleEntity, UUID> {
    Optional<RoleEntity> findByTenantIdAndCode(UUID tenantId, String code);

    List<RoleEntity> findByIdIn(Collection<UUID> ids);
}
