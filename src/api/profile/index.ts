import {baseURL} from '../../constants/api';
import apiClient from '..';

export const useGetUserInfo = () => {
  return apiClient.get(`/get-user-info`);
};

export const useUpdateUserInfo = (payload: object) => {
  return apiClient.post(`/update-user`, payload);
};
