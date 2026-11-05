# Retención

| Clase de topic | Retención | Compactación |
|----------------|-----------|--------------|
| Domain/integration events | 90 días (prod) / 30 (no-prod) | No |
| Snapshot/read-model changelogs | 7 días + compact | compact |
| Commands (notification) | 14 días | No |
| DLQ | 30 días | No |
| Audit bridge | 365 días | No |

Cold storage: export periódico a Object Storage (Parquet) para compliance >1 año.
