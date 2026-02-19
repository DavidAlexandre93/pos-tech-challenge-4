import { Role } from '@/types';

export const ROOT_ROUTES = {
  login: 'Login',
  app: 'App'
} as const;

export type RootRoute = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];
export type AppTabName = 'Posts' | 'Docentes' | 'Alunos' | 'Admin';

export function resolveRootRoute(isLoading: boolean, hasUser: boolean): RootRoute | null {
  if (isLoading) {
    return null;
  }

  return hasUser ? ROOT_ROUTES.app : ROOT_ROUTES.login;
}

export function getAvailableTabs(role?: Role): AppTabName[] {
  if (role === 'teacher') {
    return ['Posts', 'Docentes', 'Alunos', 'Admin'];
  }

  return ['Posts'];
}

export function canManageContent(role?: Role): boolean {
  return role === 'teacher';
}
