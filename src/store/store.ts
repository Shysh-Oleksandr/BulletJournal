import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

import { configureStore } from "@reduxjs/toolkit";

import { emptyAxiosApi } from "./api/emptyAxiosApi";
import enableStoreDebug from "./helpers/enableStoreDebug";
import appListenerMiddleware from "./middlewares/listenerMiddleware";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import rootReducer from "./rootReducer";

const middlewares: any = [thunk, emptyAxiosApi.middleware];

if (__DEV__) {
  middlewares.push(loggerMiddleware);
}

export const store = configureStore({
  reducer: rootReducer,
  // serializableCheck false because of redux-persist
  middleware: (gDM) =>
    gDM({
      serializableCheck: false,
      immutableCheck: { warnAfter: 128 },
    })
      .prepend(appListenerMiddleware.middleware)
      .concat(middlewares),
});

const persistor = persistStore(store, null);

export { persistor };

enableStoreDebug(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
