import React, { useContext } from "react";
import { useState, createContext } from "react";
import { AuthStore, UserType, CurrentCharacterSummary } from "./AuthStore";
import { Client } from "../Api";
import { useError } from "../Errors";

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

  const signout = (callback: VoidFunction) => {
    const token = user && user.token;
    client.destroy({ path: "/users/logout", token: token }).then(() => {
      storage.removeUser();
      setUser(null);
      callback();
    });
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
