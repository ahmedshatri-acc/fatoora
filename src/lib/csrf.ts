/**
 * Same-origin guard for state-changing routes.
 * sameSite: "strict" on the session cookie already blocks most CSRF, but it
 * does not block login-fixation attacks against an unauthenticated victim.
 * For sensitive auth routes (login/signup/password-reset) we additionally
 * require the Origin header to match the request's host.
 *
 * Returns true if request is same-origin, false to reject.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    // No Origin header — allow only for non-browser callers (curl etc.).
    // Browsers always send Origin on cross-origin POSTs; missing-Origin POSTs
    // from a browser would be same-origin form submits, which we treat as OK.
    return true;
  }
  try {
    const reqUrl = new URL(request.url);
    const orgUrl = new URL(origin);
    return reqUrl.host === orgUrl.host;
  } catch {
    return false;
  }
}
