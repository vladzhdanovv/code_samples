import React, { useEffect, useState } from "react";

import AuthContext, {
  LoginProps
} from "./auth-context";

import {
  userRequest,
  loginRequest, logoutRequest
} from "../../../api/backoffice/endpoints/auth/index";
import { ResponseErrorType } from "../../../api/backoffice/apiClient";

export interface UserType {
  id: number;
  email: string;
  full_name_initials: string;
}

interface Props {
  checkOnInit?: boolean;
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ checkOnInit = true,
                                         children
                                       }) => {
  const [authState, setAuthState] = useState<{
    user: null | UserType;
    authenticated: null | boolean;
    isAuthenticating: boolean;
  }>({ user: null, authenticated: null, isAuthenticating: true });

  const [isLoggedOuting, setIsLoggedOuting] = useState<boolean>(false)

  const {
    isAuthenticating,
    authenticated,
    user
  } = authState;

  useEffect(() => {
    if (checkOnInit) {
      checkAuthentication();
    }
  }, [checkOnInit]);

  const checkAuthentication = (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (authenticated === null) {
        // The status is null if we haven't checked it, so we have to make a request.
        try {
          const result = await revalidateAuthState();
          return resolve(result);
        } catch (error: ResponseErrorType) {
          setAuthState({ user: null, authenticated: false, isAuthenticating: false });
          return resolve(false);
        }
      } else {
        // If it has been checked with the server before, we can just return the state.
        return resolve(authenticated);
      }
    });
  };

  const revalidateAuthState = (): Promise<boolean | ResponseErrorType> => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await userRequest();

        setAuthState({ user, authenticated: true, isAuthenticating: false });

        return resolve(true);
      } catch (error) {
        setAuthState({ user: null, authenticated: false, isAuthenticating: false });
        return reject(error);
      }
    });
  };

  const login = (
    props: LoginProps
  ): Promise<boolean | ResponseErrorType> => {
    return new Promise(async (resolve, reject) => {
      try {
        await loginRequest(props);
        await revalidateAuthState();
        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    });
  };

  const logout = (): Promise<boolean | ResponseErrorType> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsLoggedOuting(true);
        await logoutRequest();
        setAuthState({ user: null, authenticated: false, isAuthenticating: false });
        setIsLoggedOuting(false);
        return resolve(true);
      } catch (error) {
        setIsLoggedOuting(false);
        return reject(error);
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        isAuthenticating,
        isLoggedOuting,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
