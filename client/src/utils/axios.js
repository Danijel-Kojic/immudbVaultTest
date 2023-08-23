import axios from "axios";
import { verifyToken, setSession, setRefresh } from "./common";

const axiosServices = axios.create({
  baseURL: "/api/v1",
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const refresh = window.localStorage.getItem("refresh-token");
      if (refresh && verifyToken(refresh)) {
        axios.post("/api/v1/token/refresh/", { refresh }).then((res) => {
          const { refresh, access } = res.data;
          setSession(access);
          setRefresh(refresh);
        });
        window.location.href = "/bank";
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(
      (error?.response && error?.response?.data) || "Wrong Services"
    );
  }
);

export default axiosServices;
