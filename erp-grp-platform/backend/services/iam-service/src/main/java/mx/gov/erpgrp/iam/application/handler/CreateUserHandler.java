package mx.gov.erpgrp.iam.application.handler;

import mx.gov.erpgrp.common.security.TenantContext;
import mx.gov.erpgrp.iam.application.command.CreateUserCommand;
import mx.gov.erpgrp.iam.domain.model.User;
import mx.gov.erpgrp.iam.domain.port.UserRepository;
import mx.gov.erpgrp.iam.infrastructure.messaging.DomainEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateUserHandler {
    private final UserRepository userRepository;
    private final DomainEventPublisher eventPublisher;

    public CreateUserHandler(UserRepository userRepository, DomainEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public User handle(CreateUserCommand command) {
        var tenantId = TenantContext.require();
        userRepository.findByUsername(tenantId, command.username()).ifPresent(u -> {
            throw new IllegalStateException("Username already exists: " + command.username());
        });
        var user = User.create(tenantId, command.username(), command.email(), "system");
        if (command.roleCode() != null && !command.roleCode().isBlank()) {
            user.assignRole(command.roleCode());
        }
        var saved = userRepository.save(user);
        eventPublisher.publish(saved.pullDomainEvents());
        return saved;
    }
}
