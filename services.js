import axios from "axios";
import env from "./env";

const baseURL = env.REACT_APP_API_URL;

console.log(baseURL);

const base = axios.create({ baseURL });

const services = {
  login(body) {
    // email, password
    return base.post("/auth/login", body);
  },

  signin(body) {
    return base.post("/auth/signin", body);
  },
};

export default services;
