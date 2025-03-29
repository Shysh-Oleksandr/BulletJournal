import React, { FC, ReactNode } from "react";

import { client } from "store/api/client";

import { useUnauthorizedResponseInterceptor } from "./useUnauthorizedResponseInterceptor";

const UnauthorizedInterceptor: FC<{ children: ReactNode }> = ({ children }) => {
  useUnauthorizedResponseInterceptor(client);

  return <>{children}</>;
};

export default UnauthorizedInterceptor;
