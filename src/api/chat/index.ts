import {baseURL} from '../../constants/api';
import apiClient from '..';

export const useGetChatsBetweenUsers = (payload: object) => {
  return apiClient.post(`/get-chat`, payload);
};

export const useAddChatsBetweenUsers = (payload: object) => {
  return apiClient.post(`/add-chat`, payload);
};
