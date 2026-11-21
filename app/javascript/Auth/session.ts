/**
 * Fired on window when the server rejects the saved token (a 401 on a request
 * that sent one). AuthProvider listens, drops the session, and PrivateRoute
 * then sends the visitor to log in and back.
 */
const SESSION_EXPIRED = "auth:session-expired";

const announceSessionExpired = () =>
  window.dispatchEvent(new Event(SESSION_EXPIRED));

/**
 * What a request rejects with once the session has ended. Error handlers skip
 * it: AuthProvider has already said so and is heading to the login screen.
 */
class SessionExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "SessionExpiredError";
  }
}

/** When a JWT stops working, in ms since the epoch; null if it can't tell. */
const tokenExpiresAt = (token: string | null | undefined): number | null => {
  const payload = token?.split(".")[1];
  if (!payload) return null;
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const exp = JSON.parse(json).exp;
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
};

export {
  SESSION_EXPIRED,
  SessionExpiredError,
  announceSessionExpired,
  tokenExpiresAt,
};
