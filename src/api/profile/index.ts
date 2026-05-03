import apiClient from "..";

export const useGetUserInfo = () => {
  return apiClient.get(`/get-user-info`);
};

export const useUpdateUserInfo = (payload: object) => {
  return apiClient.post(`/update-user-details`, payload);
};

export const extractUserInfoData = (response: any) => {
  if (response?.data?.data && typeof response.data.data === "object") {
    return response.data.data;
  }

  if (response?.data && typeof response.data === "object") {
    return response.data;
  }

  return {};
};
