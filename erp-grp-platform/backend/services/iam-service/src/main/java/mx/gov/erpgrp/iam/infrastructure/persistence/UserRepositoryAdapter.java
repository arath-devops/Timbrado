package mx.gov.erpgrp.iam.infrastructure.persistence;

import mx.gov.erpgrp.common.domain.TenantId;
import mx.gov.erpgrp.iam.domain.model.User;
import mx.gov.erpgrp.iam.domain.port.UserRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class UserRepositoryAdapter implements UserRepository {
    private final SpringDataUserRepository repository;

    public UserRepositoryAdapter(SpringDataUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public User save(User user) {
        var entity = new UserJpaEntity();
        entity.setId(user.id());
        entity.setTenantId(user.tenantId().value());
        entity.setUsername(user.username());
        entity.setEmail(user.email());
        entity.setStatus(user.status());
        entity.setMfaEnabled(user.mfaEnabled());
        entity.setRoles(user.roles());
        entity.setCreatedBy("system");
        entity.setModifiedBy("system");
        repository.save(entity);
        return user;
    }

    @Override
    public Optional<User> findById(TenantId tenantId, UUID id) {
        return repository.findByTenantIdAndId(tenantId.value(), id).map(this::toDomain);
    }

    @Override
    public Optional<User> findByUsername(TenantId tenantId, String username) {
        return repository.findByTenantIdAndUsername(tenantId.value(), username).map(this::toDomain);
    }

    private User toDomain(UserJpaEntity entity) {
        var user = User.create(new TenantId(entity.getTenantId()), entity.getUsername(), entity.getEmail(), entity.getCreatedBy());
        // Note: create generates new id/events; for read-model reconstruction use a dedicated rehydrate factory in production.
        entity.getRoles().forEach(user::assignRole);
        user.pullDomainEvents();
        return user;
    }
}
