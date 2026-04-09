import axios, { AxiosResponse } from "axios";
import { baseURL } from "../constants/api";
import { getJwtToken } from "../utils/getJwtToken";
import { logout } from "../utils/useLogout";

const apiClient = axios.create({
  baseURL,
  timeout: 100000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getJwtToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 400) {
      await logout();
      console.log("Unauthorized access. Redirecting to login...");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
