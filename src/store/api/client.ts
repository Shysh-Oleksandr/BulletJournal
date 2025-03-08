import axios from "axios";

import AppConfig from "config/AppConfig";

export const client = axios.create({
  baseURL: AppConfig.apiUrl,
});
