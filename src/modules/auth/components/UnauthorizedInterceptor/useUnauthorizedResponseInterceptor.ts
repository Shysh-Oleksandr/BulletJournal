import { AxiosInstance } from "axios";

import { authApi } from "modules/auth/api/authApi";
import { useAuthStore } from "modules/auth/hooks/useAuthStore";
import { ApiStatusCodes } from "modules/auth/types";

export const useUnauthorizedResponseInterceptor = (client: AxiosInstance) => {
  const { mutateAsync: refreshToken } = authApi.useRefreshTokenMutation();
  const isRetrying = new Set<string>();

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const requestId = `${error.config.method}:${error.config.url}`;

      if (
        error?.response?.status === ApiStatusCodes.Unauthorized &&
        error.config.url !== "/auth/refresh" &&
        !isRetrying.has(requestId)
      ) {
        try {
          isRetrying.add(requestId);
          const accessToken = error.config.headers.Authorization.split(" ")[1];
          const { access_token } = await refreshToken({
            access_token: accessToken,
          });

          const currentUser = useAuthStore.getState().user;

          if (currentUser && access_token) {
            const updatedUser = {
              ...currentUser,
              access_token,
            };

            useAuthStore.getState().setUser(updatedUser);
          }

          isRetrying.delete(requestId);

          return client({
            ...error.config,
            headers: {
              ...error.config.headers,
              Authorization: `Bearer ${access_token}`,
            },
          });
        } catch (refreshError) {
          isRetrying.delete(requestId);

          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );
};
