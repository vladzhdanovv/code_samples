import React from "react";

export interface LoginProps {
  email: string;
  password: string;
  remember: boolean;
}

export interface ContextProps {
  user: null | any;
  authenticated: null | boolean;
  isAuthenticating: boolean;
  isLoggedOuting: boolean;
  login: (props: LoginProps) => Promise<{}>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<ContextProps | undefined>(undefined);

export default AuthContext;
