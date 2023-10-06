import {
  createListenerMiddleware,
  TypedStartListening,
  TypedStopListening,
} from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "store/store";

const appListenerMiddleware = createListenerMiddleware({
  onError: (error, errorInfo) => {
    console.error(`raised by: ${errorInfo.raisedBy}`, error);
  },
});

export default appListenerMiddleware;

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export type AppStopListening = TypedStopListening<RootState, AppDispatch>;

export const startAppListening =
  appListenerMiddleware.startListening as AppStartListening;
