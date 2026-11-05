package mx.gov.erpgrp.common.web;

import java.util.List;

/**
 * API-001 / SA-MS error contract.
 */
public record ApiError(
        String code,
        String message,
        String traceId,
        String correlationId,
        String requestId,
        List<ApiErrorDetail> details
) {
    public record ApiErrorDetail(String field, String issue, Object rejectedValue) {}

    public static ApiError of(String code, String message, String traceId, String correlationId, String requestId) {
        return new ApiError(code, message, traceId, correlationId, requestId, List.of());
    }
}
