import { useMutation } from "@tanstack/react-query";
import { client } from "store/api/client";

import { LoginRequest, LoginResponse } from "../types";

const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async ({ fire_token, uid }) => {
      const { data } = await client.post<LoginResponse>(
        "/users/login",
        { uid },
        { headers: { Authorization: `Bearer ${fire_token}` } },
      );

      return data;
    },
  });
};

export const authApi = {
  useLoginMutation,
};
