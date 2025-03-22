import axios, { AxiosInstance } from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AppConfig from "config/AppConfig";

export const client = axios.create({
  baseURL: AppConfig.apiUrl,
});

export const newClient = axios.create({
  baseURL: AppConfig.newApiUrl,
});

const applyAuthorizationInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config) => {
      try {
        const storedUserJSON = await AsyncStorage.getItem("user");

        if (storedUserJSON) {
          const user = JSON.parse(storedUserJSON);

          if (user?.access_token) {
            config.headers!.Authorization = `Bearer ${user.access_token}`;
          }
        }
      } catch (error) {
        console.error("Failed to get user from AsyncStorage", error);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
};

applyAuthorizationInterceptor(newClient);
