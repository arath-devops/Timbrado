package mx.gov.erpgrp.iam.application;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import mx.gov.erpgrp.iam.config.JwtProperties;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Component;

@Component
public class TokenIssuer {

    private final JwtEncoder jwtEncoder;
    private final JwtProperties jwtProperties;

    public TokenIssuer(JwtEncoder jwtEncoder, JwtProperties jwtProperties) {
        this.jwtEncoder = jwtEncoder;
        this.jwtProperties = jwtProperties;
    }

    public IssuedToken issue(
            UUID userId,
            String username,
            UUID tenantId,
            String companyCode,
            List<String> roles,
            List<String> modules,
            UUID sessionId
    ) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(jwtProperties.getAccessTokenMinutes() * 60L);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(jwtProperties.getIssuer())
                .issuedAt(now)
                .expiresAt(exp)
                .subject(userId.toString())
                .id(UUID.randomUUID().toString())
                .claim("tenant_id", tenantId.toString())
                .claim("company_code", companyCode)
                .claim("username", username)
                .claim("roles", roles)
                .claim("modules", modules)
                .claim("sid", sessionId.toString())
                .build();
        JwsHeader header = JwsHeader.with(SignatureAlgorithm.RS256).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new IssuedToken(token, jwtProperties.getAccessTokenMinutes() * 60L);
    }

    public record IssuedToken(String accessToken, long expiresInSeconds) {}
}
