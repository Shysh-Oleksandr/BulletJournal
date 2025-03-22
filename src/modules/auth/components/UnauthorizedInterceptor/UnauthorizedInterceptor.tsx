import React, { FC, ReactNode } from "react";

import { newClient } from "store/api/client";

import { useUnauthorizedResponseInterceptor } from "./useUnauthorizedResponseInterceptor";

const UnauthorizedInterceptor: FC<{ children: ReactNode }> = ({ children }) => {
  useUnauthorizedResponseInterceptor(newClient);

  return <>{children}</>;
};

export default UnauthorizedInterceptor;
