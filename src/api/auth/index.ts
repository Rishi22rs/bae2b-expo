import axios from 'axios';
import {baseURL} from '../../constants/api';
import apiClient from '..';

export const useLogin = (payload: object) => {
  return axios
    .post(`${baseURL}/create-otp`, payload, {timeout: 100000})
    .catch(error => {
      console.log('Error:', error.message);
      console.log('Error Config:', error.config);
      console.log('Error Response:', error.response);
    });
};

export const useOtp = (params: {phoneNumber: string; otp: string}) => {
  return axios.get(
    `${baseURL}/verify-otp?phone_number=${params.phoneNumber}&otp=${params.otp}`,
    {timeout: 100000},
  );
};

export const useCurrentStep = () => {
  return apiClient.get(`${baseURL}/current-step`);
};
