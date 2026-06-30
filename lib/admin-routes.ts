const ADMIN_PUBLIC_BASE_PATH = "/nora-admin-a8f2x91";
const ADMIN_LOGIN_PUBLIC_PATH = "/nora-login-k4m7p2";
const ADMIN_ENTRY_PUBLIC_PATH = "/nora-enter-v6q3r8";

export const ADMIN_INTERNAL_BASE_PATH = "/admin";
export const ADMIN_INTERNAL_LOGIN_PATH = "/login";
export const ADMIN_INTERNAL_ENTRY_PATH = "/admin/enter";

export const ADMIN_PUBLIC_PATH = ADMIN_PUBLIC_BASE_PATH;
export const ADMIN_PUBLIC_LOGIN_PATH = ADMIN_LOGIN_PUBLIC_PATH;
export const ADMIN_PUBLIC_ENTRY_PATH = ADMIN_ENTRY_PUBLIC_PATH;

function normalizeAdminChildPath(pathname: string) {
  return pathname === ADMIN_INTERNAL_BASE_PATH
    ? ""
    : pathname.slice(ADMIN_INTERNAL_BASE_PATH.length);
}

export function buildAdminPublicPath(pathname = ADMIN_INTERNAL_BASE_PATH) {
  const childPath = normalizeAdminChildPath(pathname);
  return `${ADMIN_PUBLIC_BASE_PATH}${childPath}`;
}

export function isAdminPublicPath(pathname: string) {
  return pathname === ADMIN_PUBLIC_BASE_PATH || pathname.startsWith(`${ADMIN_PUBLIC_BASE_PATH}/`);
}

export function isAdminPublicLoginPath(pathname: string) {
  return pathname === ADMIN_LOGIN_PUBLIC_PATH;
}

export function isAdminPublicEntryPath(pathname: string) {
  return pathname === ADMIN_ENTRY_PUBLIC_PATH;
}
