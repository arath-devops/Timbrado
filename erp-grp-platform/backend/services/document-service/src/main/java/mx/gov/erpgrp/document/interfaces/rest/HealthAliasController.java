package mx.gov.erpgrp.document.interfaces.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthAliasController {
    @GetMapping("/api/v1/meta/service")
    public Map<String, String> meta() {
        return Map.of(
                "service", "document-service",
                "apiVersion", "v1",
                "baseline", "BL-S1-001"
        );
    }
}
