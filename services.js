import axios from "axios";
import env from "./env";
import stringifyRGB from "./lib/colors";

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
    return base.post(`/projects/`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  deleteProject(projectId) {
    return base.delete(`/projects/id/${projectId}`).then((res) => res.data);
  },

  updateProjectName(projectId, name) {
    return base
      .put(`/projects/id/name/${projectId}`, { name })
      .then((res) => res.data);
  },

  updateProjectColor(projectId, color) {
    const { r, g, b } = stringifyRGB(color);

    return base
      .put(`/projects/id/color/${projectId}`, { r, g, b }) // {r,g,b} variable passées en body
      .then((res) => res.data);
  },

  /** Times */

  createNewTimesheet(token, body) {
    return base
      .post(`timesheet/newtimesheet`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data);
  },

  getAllTimesheetList(token) {
    return base
      .get(`/timesheet/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.data);
  },
  
  deleteTimesheetById(token, id) {
    return base
      .delete(`/timesheet/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data);
  },

  /** Users */

  updateCurrentUser(body, token) {
    return base
      .put(`/users`, body, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
  },

  
};

export default services;
