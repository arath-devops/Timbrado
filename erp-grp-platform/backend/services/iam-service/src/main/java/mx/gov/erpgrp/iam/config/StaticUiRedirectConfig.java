package mx.gov.erpgrp.iam.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Atajos de UI local: / → login, /app → /app/ */
@Configuration
public class StaticUiRedirectConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addRedirectViewController("/", "/login.html");
        registry.addRedirectViewController("/app", "/app/");
    }
}
