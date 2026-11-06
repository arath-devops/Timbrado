package mx.gov.erpgrp.purchasing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "mx.gov.erpgrp")
public class PurchasingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PurchasingServiceApplication.class, args);
    }
}
