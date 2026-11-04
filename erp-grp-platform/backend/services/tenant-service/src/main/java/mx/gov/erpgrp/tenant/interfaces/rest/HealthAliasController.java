package mx.gov.erpgrp.tenant.interfaces.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/meta")
public class HealthAliasController {
    @GetMapping("/service")
    public Map<String, String> info() {
        return Map.of("service", "tenant-service", "status", "UP");
    }
}
