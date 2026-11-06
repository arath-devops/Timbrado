# Flyway — MVP databases (DA-MVP-001)

Each directory is a Flyway locations root for one service database.

```text
flyway -url=jdbc:postgresql://localhost:5432/iam_db \
       -locations=filesystem:database/flyway/iam migrate
```

Baseline: `V1__init_mvp.sql` per service.

See `docs/data/mvp/05-FLYWAY-STRATEGY.md`.
