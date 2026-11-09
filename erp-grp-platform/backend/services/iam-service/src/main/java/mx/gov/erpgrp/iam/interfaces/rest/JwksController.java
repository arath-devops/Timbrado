package mx.gov.erpgrp.iam.interfaces.rest;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JwksController {

    private final RSAKey iamRsaKey;

    public JwksController(RSAKey iamRsaKey) {
        this.iamRsaKey = iamRsaKey;
    }

    @GetMapping(path = "/oauth2/jwks", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> jwks() {
        return new JWKSet(iamRsaKey.toPublicJWK()).toJSONObject();
    }
}
