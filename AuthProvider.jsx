import { createContext, useEffect, useState } from "react";
import tokenAsyncStorage from "./lib/tokenAsyncStorage";
import services from "./services";
import env from "./env";
import axios from "axios";
const baseURL = env.REACT_APP_API_URL;

const base = axios.create({ baseURL });

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [logged, setLogged] = useState(false);
  const [token, setToken] = useState();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    tokenAsyncStorage.getJwt().then((result) => {
      if (result) {
        setToken(JSON.parse(result));
        setLogged(Boolean(result));
        getCurrentUser(JSON.parse(result));
      }
    });
  }, []);

  const getCurrentUser = (token) => {
    return base
      .get(`/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCurrentUser(res.data));
  };

  const value = { logged, setLogged, token, currentUser, setCurrentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
