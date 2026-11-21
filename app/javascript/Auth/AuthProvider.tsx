import React, { useContext, useEffect, useRef } from "react";
import { useState, createContext } from "react";
import { AuthStore, UserType, CurrentCharacterSummary } from "./AuthStore";
import { SESSION_EXPIRED, tokenExpiresAt } from "./session";
import { Client } from "../Api";
import { toast } from "../Components/ui";
import { useError } from "../Errors";

/**
 * setTimeout's ceiling (~24.8 days). A token that outlives it is still caught
 * by the check when the tab comes back into view, or by its first 401.
 */
const MAX_TIMER_MS = 2 ** 31 - 1;

interface AuthContextType {
  user: UserType | null;
  currentCharacter: CurrentCharacterSummary | null;
  getToken: () => string | null;
  signin: (email: string, password: string, callback: VoidFunction) => void;
  signup: (
    email: string,
    password: string,
    passwordConfirmation: string,
    callback: VoidFunction,
  ) => void;
  signout: (callback: VoidFunction) => void;
  setCurrentCharacter: (characterId: number | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storage = AuthStore();
  const [user, setUser] = useState(storage.getUser());
  const client = Client();
  const errors = useError();
  // Read by the window listeners, which outlive any one render.
  const userRef = useRef(user);
  userRef.current = user;

  const clearSession = () => {
    storage.removeUser();
    setUser(null);
  };

  /** The token stopped working: drop it, and say so once. */
  const expireSession = () => {
    if (!userRef.current) return;
    clearSession();
    toast({
      title: "Your session expired",
      description: "Log in again to pick up where you left off.",
    });
  };

  // A request whose token the server rejected.
  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED, expireSession);
    return () => window.removeEventListener(SESSION_EXPIRED, expireSession);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The token's own expiry, so an idle tab also ends up at the login screen:
  // checked now, when it is due, and whenever the tab comes back into view.
  useEffect(() => {
    const expiresAt = tokenExpiresAt(user?.token);
    if (!expiresAt) return;
    const check = () => {
      if (Date.now() >= expiresAt) expireSession();
    };
    check();
    const timer = setTimeout(
      check,
      Math.min(Math.max(expiresAt - Date.now(), 0), MAX_TIMER_MS),
    );
    document.addEventListener("visibilitychange", check);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", check);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const mergeUser = (
    existing: UserType | null,
    incoming: any,
    token?: string,
  ): UserType => {
    return {
      id: incoming?.id ?? existing?.id,
      email: incoming?.email ?? existing?.email ?? "",
      token: token ?? existing?.token ?? "",
      current_character_id: incoming?.current_character_id ?? null,
      current_character: incoming?.current_character ?? null,
    };
  };

  // The stored user can be stale (a deleted current character, say), so
  // re-read it from the server once per page load.
  useEffect(() => {
    if (!user?.token) return;
    client
      .get({ path: "/users/me", token: user.token })
      .then((res) => {
        const merged = mergeUser(user, res.data, user.token);
        storage.saveUser(merged);
        setUser(merged);
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signin = (email: string, password: string, callback: VoidFunction) => {
    let data = {
      user: {
        email: email,
        password: password,
      },
    };

    client
      .post({ path: "/users/login", payload: data })
      .then((data) => {
        const merged = mergeUser(user, data.user, data.token);
        storage.saveUser(merged);
        setUser(merged);
        callback();
      })
      .catch((error) => {
        console.log(error);
        errors.setError("Invalid email or password. Please try again!");
      });
  };

  const signup = (
    email: string,
    password: string,
    passwordConfirmation: string,
    callback: VoidFunction,
  ) => {
    let data = {
      user: {
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      },
    };

    client
      .post({ path: "/users", payload: data })
      .then((data) => {
        const merged = mergeUser(user, data.user, data.token);
        storage.saveUser(merged);
        setUser(merged);
        callback();
      })
      .catch((error) => {
        console.log(error);
        errors.setError(
          "Username is taken or passwords dont match. Please try again!",
        );
      });
  };

  // Tokens are stateless JWTs, so signing out is forgetting ours. Tell the
  // server too, but sign out locally even when that fails (say, the token had
  // already expired).
  const signout = (callback: VoidFunction) => {
    const token = user && user.token;
    clearSession();
    callback();
    if (token)
      client
        .destroy({ path: "/users/logout", token, showSuccessToast: false })
        .catch(() => undefined);
  };

  const getToken = () => {
    return user && user.token;
  };

  const setCurrentCharacter = async (characterId: number | null) => {
    if (!user) return;
    try {
      const response = await client.patch({
        path: "/users/current_character",
        payload: { character_id: characterId },
        token: user.token,
        showSuccessToast: false,
      });
      const merged = mergeUser(user, response.data, user.token);
      storage.saveUser(merged);
      setUser(merged);
    } catch (err) {
      errors.setError(err);
    }
  };

  const auth: AuthContextType = {
    user,
    currentCharacter: user?.current_character ?? null,
    getToken,
    signin,
    signup,
    signout,
    setCurrentCharacter,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
