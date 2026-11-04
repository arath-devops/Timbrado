package mx.gov.erpgrp.gateway;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import reactor.core.publisher.Mono;

@Configuration
public class TenantKeyResolver {
    @Bean
    KeyResolver tenantKeyResolver() {
        return exchange -> exchange.getPrincipal()
                .filter(JwtAuthenticationToken.class::isInstance)
                .cast(JwtAuthenticationToken.class)
                .map(jwt -> jwt.getToken().getClaimAsString("tenant_id"))
                .switchIfEmpty(Mono.just("anonymous"));
    }
}
