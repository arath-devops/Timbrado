package mx.gov.erpgrp.common.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ApiError.ApiErrorDetail> details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> new ApiError.ApiErrorDetail(fe.getField(), fe.getDefaultMessage(), fe.getRejectedValue()))
                .toList();
        return ResponseEntity.badRequest().body(new ApiError(
                "VALIDATION_ERROR",
                "Request validation failed",
                headerOrNew(request, "X-Trace-Id"),
                headerOrNew(request, "X-Correlation-Id"),
                headerOrNew(request, "X-Request-Id"),
                details
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        return ResponseEntity.badRequest().body(ApiError.of(
                "VALIDATION_ERROR",
                ex.getMessage(),
                headerOrNew(request, "X-Trace-Id"),
                headerOrNew(request, "X-Correlation-Id"),
                headerOrNew(request, "X-Request-Id")
        ));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiError> handleIllegalState(IllegalStateException ex, HttpServletRequest request) {
        HttpStatus status = ex.getMessage() != null && ex.getMessage().contains("TenantContext")
                ? HttpStatus.UNAUTHORIZED
                : HttpStatus.CONFLICT;
        return ResponseEntity.status(status).body(ApiError.of(
                status == HttpStatus.UNAUTHORIZED ? "UNAUTHORIZED" : "CONFLICT",
                ex.getMessage(),
                headerOrNew(request, "X-Trace-Id"),
                headerOrNew(request, "X-Correlation-Id"),
                headerOrNew(request, "X-Request-Id")
        ));
    }

    private static String headerOrNew(HttpServletRequest request, String name) {
        String value = request.getHeader(name);
        return value == null || value.isBlank() ? UUID.randomUUID().toString().replace("-", "") : value;
    }
}
