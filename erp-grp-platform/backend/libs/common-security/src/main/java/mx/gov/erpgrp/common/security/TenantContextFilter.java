package mx.gov.erpgrp.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Resolves tenant from JWT (CA-TEN-001). X-Tenant-Id only as echo for local mismatch checks.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 20)
public class TenantContextFilter extends OncePerRequestFilter {

    public static final String HEADER_TENANT = "X-Tenant-Id";
    public static final String HEADER_CORRELATION = "X-Correlation-Id";
    public static final String HEADER_REQUEST = "X-Request-Id";
    public static final String HEADER_TRACE = "X-Trace-Id";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
                UUID tenantId = UUID.fromString(jwt.getClaimAsString("tenant_id"));
                String headerTenant = request.getHeader(HEADER_TENANT);
                if (headerTenant != null && !headerTenant.isBlank() && !headerTenant.equals(tenantId.toString())) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write(
                            "{\"code\":\"FORBIDDEN\",\"message\":\"TENANT_HEADER_MISMATCH\"}"
                    );
                    return;
                }
                @SuppressWarnings("unchecked")
                List<String> roles = jwt.getClaim("roles") instanceof List<?> list
                        ? list.stream().map(String::valueOf).toList()
                        : List.of();
                @SuppressWarnings("unchecked")
                List<String> modules = jwt.getClaim("modules") instanceof List<?> list
                        ? list.stream().map(String::valueOf).toList()
                        : List.of();
                UUID userId = jwt.getSubject() != null ? UUID.fromString(jwt.getSubject()) : null;
                TenantContext.set(new TenantContext.Context(
                        tenantId,
                        jwt.getClaimAsString("tenant_code"),
                        jwt.getClaimAsString("plane"),
                        userId,
                        roles,
                        modules,
                        parseUuid(request.getHeader(HEADER_CORRELATION)),
                        parseUuid(request.getHeader(HEADER_REQUEST)),
                        request.getHeader(HEADER_TRACE)
                ));
                response.setHeader(HEADER_TENANT, tenantId.toString());
            }
            String correlation = request.getHeader(HEADER_CORRELATION);
            if (correlation != null) {
                response.setHeader(HEADER_CORRELATION, correlation);
            }
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private static UUID parseUuid(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
