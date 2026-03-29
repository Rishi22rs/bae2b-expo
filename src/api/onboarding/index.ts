import {baseURL} from '../../constants/api';
import apiClient from '..';

export const useAddUserInfo = (payload: object) => {
  return apiClient.post(`/add-user-info`, payload);
};
