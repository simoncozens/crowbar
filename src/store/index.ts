import { configureStore } from "@reduxjs/toolkit";
import crowbarReducer from "./crowbarSlice";

const store = configureStore({
  reducer: {
    crowbar: crowbarReducer,
  },
  // The CrowbarFont object is not serializable,
  // so we need to disable the serializableCheck middleware.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;