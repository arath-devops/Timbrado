package mx.gov.erpgrp.iam.interfaces.rest;

import jakarta.validation.Valid;
import mx.gov.erpgrp.iam.application.command.CreateUserCommand;
import mx.gov.erpgrp.iam.application.handler.CreateUserHandler;
import mx.gov.erpgrp.iam.interfaces.dto.UserResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final CreateUserHandler createUserHandler;

    public UserController(CreateUserHandler createUserHandler) {
        this.createUserHandler = createUserHandler;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public UserResponse create(@Valid @RequestBody CreateUserCommand command) {
        var user = createUserHandler.handle(command);
        return new UserResponse(user.id(), user.username(), user.email(), user.status().name(), user.roles());
    }
}
