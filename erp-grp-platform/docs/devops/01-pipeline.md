# Pipeline CI/CD

```mermaid
flowchart LR
  PR[Pull Request] --> BUILD[Build + Unit Test]
  BUILD --> SAST[SAST / SCA / Secret Scan]
  SAST --> PKG[Package Docker]
  PKG --> PUSH[Push Registry]
  PUSH --> DEV[Deploy Dev auto]
  DEV --> QA[Deploy QA]
  QA --> UAT[Deploy UAT manual]
  UAT --> PROD[Deploy Prod approval]
```

Stages GitHub Actions:
1. detect-changes (path filters)
2. backend-maven (test, spotbugs, jacoco)
3. frontend-npm (lint, test, build)
4. docker-build-push
5. helm-lint / kubeconform
6. deploy-env
