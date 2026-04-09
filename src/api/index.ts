import axios, { AxiosResponse } from "axios";
import { baseURL } from "../constants/api";
import { getJwtToken } from "../utils/getJwtToken";
import { logout } from "../utils/useLogout";
import { showErrorToast } from "../utils/toast";

const apiClient = axios.create({
  baseURL,
  timeout: 100000,
});
let isHandlingUnauthorized = false;

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
    if (error.response?.status === 401 && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
      try {
        showErrorToast("You have been logged out. Please sign in again.", {
          title: "Session expired",
          duration: 3200,
        });
        await logout();
        console.log("Unauthorized access. Redirecting to login...");
      } finally {
        isHandlingUnauthorized = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
