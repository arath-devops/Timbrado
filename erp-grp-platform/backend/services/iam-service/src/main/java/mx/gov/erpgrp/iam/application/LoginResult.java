package mx.gov.erpgrp.iam.application;

import java.util.List;
import java.util.UUID;

public record LoginResult(
        String accessToken,
        String tokenType,
        long expiresIn,
        UUID userId,
        String username,
        String displayName,
        String companyCode,
        String companyName,
        UUID tenantId,
        List<String> roles,
        List<String> modules
) {}
