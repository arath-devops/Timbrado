package mx.gov.erpgrp.iam.infrastructure;

import java.util.List;
import java.util.UUID;
import mx.gov.erpgrp.iam.domain.UserRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRoleEntity, UserRoleEntity.Pk> {
    List<UserRoleEntity> findByUserId(UUID userId);
}
