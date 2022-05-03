import { createContext, useEffect, useState } from "react";
import tokenAsyncStorage from "./lib/tokenAsyncStorage";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [logged, setLogged] = useState(false);
  const [token, setToken] = useState();

  useEffect(() => {
    const hasJwt = tokenAsyncStorage.getJwt().then((result) => {
      if (result) {
        setToken(JSON.parse(result));
        setLogged(Boolean(result));
      }
    });
  }, []);

  const value = { logged, setLogged, token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
