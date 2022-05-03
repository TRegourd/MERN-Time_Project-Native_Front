import axios from "axios";
import env from "./env";

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

  createProject({ body, token }) {
    console.log(body);
    return base.post(`/projects/`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /** Users */
};

export default services;
