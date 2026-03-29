import apiClient from '..';
import {baseURL} from '../../constants/api';

export const useGetAlerts = () => {
  return apiClient.get(`${baseURL}/get-alerts`);
};

export const useMarkAlertAsRead = () => {
  return apiClient.get(`${baseURL}/mark-alert-as-read`);
};
