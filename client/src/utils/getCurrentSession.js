import { getUserSession } from "../services/api";
export const getCurrentSession = () => {
  const userId = localStorage.getItem("userId");
  return getUserSession(userId);
};
