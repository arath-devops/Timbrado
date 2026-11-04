package mx.gov.erpgrp.iam.application.command;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateUserCommand(
        @NotBlank String username,
        @Email @NotBlank String email,
        String roleCode
) {}
