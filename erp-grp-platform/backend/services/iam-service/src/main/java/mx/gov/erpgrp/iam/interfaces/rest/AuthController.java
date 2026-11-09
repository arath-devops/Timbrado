package mx.gov.erpgrp.iam.interfaces.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;
import mx.gov.erpgrp.iam.application.LoginCommand;
import mx.gov.erpgrp.iam.application.LoginResult;
import mx.gov.erpgrp.iam.application.LoginService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    private final LoginService loginService;

    public AuthController(LoginService loginService) {
        this.loginService = loginService;
    }

    /**
     * Login de producto: empresa + usuario + contraseña.
     * El rol NO se elige aquí; viene de permisos asignados por el administrador.
     */
    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        LoginResult result = loginService.login(new LoginCommand(
                request.company(),
                request.username(),
                request.password()
        ));
        return LoginResponse.from(result);
    }

    public record LoginRequest(
            @NotBlank String company,
            @NotBlank String username,
            @NotBlank String password
    ) {}

    public record LoginResponse(
            String accessToken,
            String tokenType,
            long expiresIn,
            UserInfo user
    ) {
        static LoginResponse from(LoginResult r) {
            return new LoginResponse(
                    r.accessToken(),
                    r.tokenType(),
                    r.expiresIn(),
                    new UserInfo(
                            r.userId(),
                            r.username(),
                            r.displayName(),
                            r.companyCode(),
                            r.companyName(),
                            r.tenantId(),
                            r.roles(),
                            r.modules()
                    )
            );
        }
    }

    public record UserInfo(
            UUID id,
            String username,
            String displayName,
            String companyCode,
            String companyName,
            UUID tenantId,
            List<String> roles,
            List<String> modules
    ) {}
}
