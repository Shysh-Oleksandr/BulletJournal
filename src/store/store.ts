import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

import { applyMiddleware, configureStore } from "@reduxjs/toolkit";

import { emptyAxiosApi } from "./api/emptyAxiosApi";
import rootReducer from "./rootReducer";

const middlewares = applyMiddleware(thunk, emptyAxiosApi.middleware);

const enhancers = middlewares;

export const store = configureStore({
  reducer: rootReducer,
  enhancers: [enhancers],
  // serializableCheck false because of redux-persist
  middleware: (gDM) =>
    gDM({
      serializableCheck: false,
      immutableCheck: { warnAfter: 128 },
    }),
});

const persistor = persistStore(store, null);

export { persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
