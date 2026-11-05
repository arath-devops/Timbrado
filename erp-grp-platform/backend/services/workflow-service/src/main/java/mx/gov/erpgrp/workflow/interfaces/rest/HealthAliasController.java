package mx.gov.erpgrp.workflow.interfaces.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthAliasController {
    @GetMapping("/api/v1/meta/service")
    public Map<String, String> meta() {
        return Map.of(
                "service", "workflow-service",
                "apiVersion", "v1",
                "baseline", "BL-S1-001"
        );
    }
}
