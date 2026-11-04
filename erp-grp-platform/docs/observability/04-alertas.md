# Alertas

| Alerta | Condición | Severidad |
|--------|-----------|-----------|
| HighErrorRate | 5xx > 1% 5m | critical |
| HighLatencyP99 | p99 > 500ms 10m | warning |
| KafkaLag | lag > 50k 5m | critical |
| DLQGrowing | dlq > 100 10m | warning |
| DBConnections | > 85% 5m | critical |
| CertificateExpiry | < 15 días | warning |
| BudgetOverrunAttemptSpike | > baseline 3x | warning |
| PayrollJobFailed | any failure | critical |
| MFABypassAttempt | detected | critical |
