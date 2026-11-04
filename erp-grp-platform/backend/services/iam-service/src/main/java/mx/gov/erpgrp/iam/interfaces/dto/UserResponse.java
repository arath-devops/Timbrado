package mx.gov.erpgrp.iam.interfaces.dto;

import java.util.Set;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        String email,
        String status,
        Set<String> roles
) {}
