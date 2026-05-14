import api from "./api";

export const changePassword = async (userId: number, newPassword: string) => {
  await api.patch(`/api/users/${userId}/password`, newPassword, {
    headers: { 'Content-Type': 'text/plain' }
  });
};

export const getUserById = async (userId: number) => {
  const response = await api.get(`/api/users/${userId}`);
  return response.data;
};
