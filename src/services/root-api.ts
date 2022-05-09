import axios from "axios";
import { store } from "../store"; // This is outside of Redux

const rootApi = axios.create({
  baseURL: "https://fwa-ec-quiz.herokuapp.com/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

rootApi.interceptors.request.use((config) => {
  if (config.url) {
    if (config.url.substring(0, 6) !== "/auth/") {
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: "Bearer " + token,
        };
      }
    }
  }
  return config;
});

rootApi.interceptors.response.use((response) => response.data);

export default rootApi;
