import axios from "axios";
import { useContext, useState } from "react";
import env from "./env";
import tokenAsyncStorage from "./lib/tokenAsyncStorage";
import { AuthContext } from "./AuthProvider";

const baseURL = env.REACT_APP_API_URL;

const base = axios.create({ baseURL });

const services = {
  /** Login / Sign in */

  login(body) {
    return base.post("/auth/login", body);
  },

  signin(body) {
    return base.post("/auth/signin", body);
  },

  /** Projects */

  getProjectsList(token) {
    return base
      .get(`/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);
  },
};

export default services;
