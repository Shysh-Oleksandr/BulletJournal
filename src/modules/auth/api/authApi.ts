import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "store/api/client";

import User, {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../types";

const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async ({ fire_token }) => {
      const { data } = await client.post<LoginResponse>("/auth/login", {
        token: fire_token,
      });

      return data;
    },
  });
};

const useRefreshTokenMutation = () => {
  return useMutation<RefreshTokenResponse, Error, RefreshTokenRequest>({
    mutationFn: async ({ access_token }) => {
      const { data } = await client.post<RefreshTokenResponse>(
        "/auth/refresh",
        {
          token: access_token,
        },
      );

      return data;
    },
  });
};

const useGetUserProfileQuery = () => {
  return useQuery<User, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await client.get<User>("/users/profile");

      return data;
    },
  });
};

export const authApi = {
  useLoginMutation,
  useRefreshTokenMutation,
  useGetUserProfileQuery,
};
