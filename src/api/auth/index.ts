import axios from "axios";
import apiClient from "..";
import { baseURL } from "../../constants/api";

export const useLogin = (payload: object) => {
  return axios.post(`${baseURL}/create-otp`, payload, { timeout: 100000 });
};

export const useOtp = (params: { phoneNumber: string; otp: string }) => {
  return axios.post(
    `${baseURL}/verify-otp`,
    {
      phone_number: params.phoneNumber,
      otp: params.otp,
    },
    { timeout: 100000 },
  );
};

export const useCurrentStep = () => {
  return apiClient.get(`${baseURL}/current-step`);
};
