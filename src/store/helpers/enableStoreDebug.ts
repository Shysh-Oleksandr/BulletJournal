import { Store } from "redux";

declare global {
  interface Window {
    store: Store;
  }
}

const enableStoreDebug = (store: Store): void => {
  const isDebuggingInChrome = __DEV__ && Boolean(window.navigator.userAgent);

  if (isDebuggingInChrome) {
    window.store = store;
  }
};

export default enableStoreDebug;
