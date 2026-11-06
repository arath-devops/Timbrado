package mx.gov.erpgrp.procurement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "mx.gov.erpgrp.procurement",
        "mx.gov.erpgrp.common"
})
public class ProcurementServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProcurementServiceApplication.class, args);
    }
}
