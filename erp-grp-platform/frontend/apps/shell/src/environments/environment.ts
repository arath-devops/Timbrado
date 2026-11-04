export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
  oidc: {
    issuer: 'http://localhost:8081',
    clientId: 'erpgrp-shell',
    scope: 'openid profile erp.read erp.write grp.read grp.write',
  },
};
