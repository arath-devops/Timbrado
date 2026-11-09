package mx.gov.erpgrp.iam.infrastructure;

import java.util.Optional;
import java.util.UUID;
import mx.gov.erpgrp.iam.domain.TenantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<TenantEntity, UUID> {
    Optional<TenantEntity> findByCodeIgnoreCase(String code);
}
