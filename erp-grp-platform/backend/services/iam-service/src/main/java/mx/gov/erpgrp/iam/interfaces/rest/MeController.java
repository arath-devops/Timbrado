package mx.gov.erpgrp.iam.interfaces.rest;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import mx.gov.erpgrp.iam.application.MenuCatalog;
import mx.gov.erpgrp.iam.infrastructure.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "/api/v1/me", produces = MediaType.APPLICATION_JSON_VALUE)
public class MeController {

    private final UserAccountRepository userAccountRepository;

    public MeController(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @GetMapping
    public MeResponse me(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        var user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión inválida"));
        return new MeResponse(
                user.getId(),
                user.getTenantId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                stringList(jwt.getClaim("roles")),
                stringList(jwt.getClaim("modules")),
                jwt.getClaimAsString("company_code"),
                jwt.getClaimAsString("sid")
        );
    }

    @GetMapping("/menus")
    public MenuResponse menus(@AuthenticationPrincipal Jwt jwt) {
        Set<String> modules = new LinkedHashSet<>(stringList(jwt.getClaim("modules")));
        List<MenuCatalog.MenuNode> items = MenuCatalog.forModules(modules);
        return new MenuResponse(items);
    }

    @SuppressWarnings("unchecked")
    private static List<String> stringList(Object claim) {
        if (claim instanceof Collection<?> col) {
            return col.stream().map(String::valueOf).toList();
        }
        return List.of();
    }

    public record MeResponse(
            UUID id,
            UUID tenantId,
            String username,
            String email,
            String displayName,
            List<String> roles,
            List<String> modules,
            String companyCode,
            String sid
    ) {}

    public record MenuResponse(List<MenuCatalog.MenuNode> items) {}
}
