package mx.gov.erpgrp.iam.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Datos demo ACME para probar login.
 * Contraseña de todos los usuarios demo: demo1234
 */
@Component
public class AcmeDemoSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AcmeDemoSeeder.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public static final UUID TENANT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    public static final UUID ADMIN_ID = UUID.fromString("22222222-2222-2222-2222-222222222201");
    public static final UUID BUYER_ID = UUID.fromString("22222222-2222-2222-2222-222222222202");
    public static final UUID ROLE_ADMIN = UUID.fromString("33333333-3333-3333-3333-333333333301");
    public static final UUID ROLE_BUYER = UUID.fromString("33333333-3333-3333-3333-333333333302");

    private final TenantRepository tenantRepository;
    private final UserAccountRepository userAccountRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public AcmeDemoSeeder(
            TenantRepository tenantRepository,
            UserAccountRepository userAccountRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.tenantRepository = tenantRepository;
        this.userAccountRepository = userAccountRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        if (tenantRepository.findByCodeIgnoreCase("ACME").isPresent()) {
            log.info("Seed ACME ya existe — omitiendo");
            return;
        }
        Instant now = Instant.now();
        UUID system = ADMIN_ID;

        TenantEntity tenant = new TenantEntity();
        tenant.setId(TENANT_ID);
        tenant.setCode("ACME");
        tenant.setName("ACME Industrial S.A. de C.V.");
        tenant.setStatus("ACTIVE");
        tenant.setCreatedAt(now);
        tenant.setCreatedBy(system);
        tenant.setUpdatedAt(now);
        tenant.setUpdatedBy(system);
        tenant.setVersion(0);
        tenantRepository.save(tenant);

        RoleEntity adminRole = role(
                ROLE_ADMIN, "ADMIN", "Administrador",
                List.of("users.manage", "roles.manage", "catalog.manage"),
                List.of(
                        "core.shell", "core.iam", "core.catalog", "core.workflow", "core.document", "core.audit", "core.report",
                        "erp.procurement", "erp.inventory", "erp.ap", "erp.ar", "erp.billing", "erp.accounting", "erp.treasury"
                ),
                now, system
        );
        RoleEntity buyerRole = role(
                ROLE_BUYER, "PURCHASING", "Compras",
                List.of("procurement.write", "procurement.read"),
                List.of("core.shell", "core.workflow", "core.catalog", "erp.procurement", "erp.inventory"),
                now, system
        );
        roleRepository.save(adminRole);
        roleRepository.save(buyerRole);

        UserAccountEntity admin = user(ADMIN_ID, "admin.acme", "Administrador ACME", "admin.acme@acme.local", now, system);
        UserAccountEntity buyer = user(BUYER_ID, "compras.acme", "Carlos López", "compras.acme@acme.local", now, system);
        userAccountRepository.save(admin);
        userAccountRepository.save(buyer);

        link(ADMIN_ID, ROLE_ADMIN, now, system);
        link(BUYER_ID, ROLE_BUYER, now, system);

        log.info("Seed ACME listo. Empresa=ACME usuarios=admin.acme|compras.acme password=demo1234");
    }

    private RoleEntity role(UUID id, String code, String name, List<String> perms, List<String> modules, Instant now, UUID by)
            throws Exception {
        RoleEntity r = new RoleEntity();
        r.setId(id);
        r.setTenantId(TENANT_ID);
        r.setCode(code);
        r.setName(name);
        r.setDescription(name);
        r.setPermissions(MAPPER.writeValueAsString(perms));
        r.setModules(MAPPER.writeValueAsString(modules));
        r.setCreatedAt(now);
        r.setCreatedBy(by);
        r.setUpdatedAt(now);
        r.setUpdatedBy(by);
        r.setVersion(0);
        return r;
    }

    private UserAccountEntity user(UUID id, String username, String display, String email, Instant now, UUID by) {
        UserAccountEntity u = new UserAccountEntity();
        u.setId(id);
        u.setTenantId(TENANT_ID);
        u.setUsername(username);
        u.setDisplayName(display);
        u.setEmail(email);
        u.setStatus("ACTIVE");
        u.setPasswordHash(passwordEncoder.encode("demo1234"));
        u.setCreatedAt(now);
        u.setCreatedBy(by);
        u.setUpdatedAt(now);
        u.setUpdatedBy(by);
        u.setVersion(0);
        return u;
    }

    private void link(UUID userId, UUID roleId, Instant now, UUID by) {
        UserRoleEntity ur = new UserRoleEntity();
        ur.setUserId(userId);
        ur.setRoleId(roleId);
        ur.setAssignedAt(now);
        ur.setAssignedBy(by);
        userRoleRepository.save(ur);
    }
}
