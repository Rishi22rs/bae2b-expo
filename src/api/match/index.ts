import {baseURL} from '../../constants/api';
import apiClient from '..';

export const useGetNearbyUsers = (payload: object) => {
  return apiClient.post(`/get-nearby-users`, payload);
};

export const useAddLikeDislike = (payload: object) => {
  console.log('dkngkdn=>>>');
  return apiClient.post(`/add-like-dislike`, payload);
};

export const useMatchedUserData = () => {
  return apiClient.get(`/matched-user-data`);
};

export const useMatchedUserIds = () => {
  return apiClient.get(`/matched-user-ids`);
};

export const useUpdateUserLocation = (payload: object) => {
  return apiClient.post(`/update-user-location`, payload);
};

export const unmatch = () => {
  return apiClient.get(`/unmatch`);
};
