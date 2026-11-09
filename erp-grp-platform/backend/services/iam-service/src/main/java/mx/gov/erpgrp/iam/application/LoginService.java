package mx.gov.erpgrp.iam.application;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;
import mx.gov.erpgrp.iam.domain.RoleEntity;
import mx.gov.erpgrp.iam.domain.TenantEntity;
import mx.gov.erpgrp.iam.domain.UserAccountEntity;
import mx.gov.erpgrp.iam.domain.UserRoleEntity;
import mx.gov.erpgrp.iam.infrastructure.RoleRepository;
import mx.gov.erpgrp.iam.infrastructure.TenantRepository;
import mx.gov.erpgrp.iam.infrastructure.UserAccountRepository;
import mx.gov.erpgrp.iam.infrastructure.UserRoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LoginService {

    private final TenantRepository tenantRepository;
    private final UserAccountRepository userAccountRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenIssuer tokenIssuer;

    public LoginService(
            TenantRepository tenantRepository,
            UserAccountRepository userAccountRepository,
            UserRoleRepository userRoleRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            TokenIssuer tokenIssuer
    ) {
        this.tenantRepository = tenantRepository;
        this.userAccountRepository = userAccountRepository;
        this.userRoleRepository = userRoleRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenIssuer = tokenIssuer;
    }

    @Transactional(readOnly = true)
    public LoginResult login(LoginCommand command) {
        if (isBlank(command.companyCode()) || isBlank(command.username()) || isBlank(command.password())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empresa, usuario y contraseña son obligatorios");
        }

        TenantEntity tenant = tenantRepository.findByCodeIgnoreCase(command.companyCode().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Empresa o credenciales inválidas"));
        if (!"ACTIVE".equalsIgnoreCase(tenant.getStatus())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Empresa inactiva");
        }

        UserAccountEntity user = userAccountRepository
                .findByTenantIdAndUsernameIgnoreCase(tenant.getId(), command.username().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Empresa o credenciales inválidas"));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no activo");
        }
        if (user.getPasswordHash() == null || !passwordEncoder.matches(command.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Empresa o credenciales inválidas");
        }

        List<UserRoleEntity> links = userRoleRepository.findByUserId(user.getId());
        List<UUID> roleIds = links.stream().map(UserRoleEntity::getRoleId).toList();
        List<RoleEntity> roles = roleIds.isEmpty() ? List.of() : roleRepository.findByIdIn(roleIds);

        List<String> roleCodes = roles.stream().map(RoleEntity::getCode).sorted().toList();
        LinkedHashSet<String> modules = new LinkedHashSet<>();
        for (RoleEntity role : roles) {
            modules.addAll(JsonListParser.parse(role.getModules()));
        }

        UUID sessionId = UUID.randomUUID();
        TokenIssuer.IssuedToken issued = tokenIssuer.issue(
                user.getId(),
                user.getUsername(),
                tenant.getId(),
                tenant.getCode(),
                roleCodes,
                List.copyOf(modules),
                sessionId
        );

        return new LoginResult(
                issued.accessToken(),
                "Bearer",
                issued.expiresInSeconds(),
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                tenant.getCode(),
                tenant.getName(),
                tenant.getId(),
                roleCodes,
                List.copyOf(modules)
        );
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
