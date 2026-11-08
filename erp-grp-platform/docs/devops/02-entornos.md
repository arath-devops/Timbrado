# Entornos

| Env | Cluster | Namespace prefix | Aprobación |
|-----|---------|------------------|------------|
| local | kind/k3d / compose | local | no |
| dev | shared | erpgrp-dev | auto |
| qa | shared | erpgrp-qa | auto post-CI |
| uat | dedicated | erpgrp-uat | manual |
| prod | dedicated multi-AZ | erpgrp-prod | 2 aprobadores + canary |
