package mx.gov.erpgrp.common.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableMethodSecurity
@Profile("!local")
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
public class ResourceServerSecurityConfig {

    /**
     * UI estática (login/shell) fuera del filter chain OAuth2 → evita HTTP 401 en /app/.
     */
    @Bean
    WebSecurityCustomizer staticUiSecurityCustomizer() {
        return web -> web.ignoring().requestMatchers(
                new AntPathRequestMatcher("/"),
                new AntPathRequestMatcher("/login.html"),
                new AntPathRequestMatcher("/app"),
                new AntPathRequestMatcher("/app/"),
                new AntPathRequestMatcher("/app/**"),
                new AntPathRequestMatcher("/assets/**"),
                new AntPathRequestMatcher("/favicon.ico")
        );
    }

    @Bean
    SecurityFilterChain resourceServerFilterChain(
            HttpSecurity http,
            TenantContextFilter tenantContextFilter,
            @Value("${erpgrp.security.public-paths:}") String publicPaths
    ) throws Exception {
        LinkedHashSet<String> pathSet = new LinkedHashSet<>();
        pathSet.addAll(List.of(
                "/actuator/health/**",
                "/actuator/info",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/api/v1/auth/**",
                "/oauth2/token",
                "/oauth2/jwks",
                "/api/v1/iam/oauth2/**",
                "/api/v1/meta/**"
        ));
        if (publicPaths != null && !publicPaths.isBlank()) {
            Arrays.stream(publicPaths.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .forEach(pathSet::add);
        }
        String[] publics = pathSet.toArray(String[]::new);

        // Solo API/actuator/docs pasan por JWT; HTML/CSS/JS no.
        http.securityMatcher("/api/**", "/oauth2/**", "/actuator/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(publics).permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter())));

        http.addFilterAfter(tenantContextFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    private Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Object rolesClaim = jwt.getClaim("roles");
            if (!(rolesClaim instanceof Collection<?> roles)) {
                return List.of();
            }
            return roles.stream()
                    .map(String::valueOf)
                    .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        });
        return converter;
    }
}
