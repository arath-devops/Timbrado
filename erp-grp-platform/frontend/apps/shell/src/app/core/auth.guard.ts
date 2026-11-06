import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  // En arquetipo: permitir acceso local; en prod validar sesión OIDC/PKCE.
  return true;
};
