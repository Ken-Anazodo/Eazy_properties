import { configureStore } from "@reduxjs/toolkit";

import filterSlice from "../../features/filter/filterSlice";
import propertySlice from "../../features/property/propertySlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import baseApi from "../../features/baseApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    property: propertySlice,
    filter: filterSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

