package mx.gov.erpgrp.iam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "mx.gov.erpgrp.iam",
        "mx.gov.erpgrp.common"
})
public class IamServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(IamServiceApplication.class, args);
    }
}
