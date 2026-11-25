import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CryptoJS from "crypto-js";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",

    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");

      const encryptedToken = localStorage.getItem("token");
      if (encryptedToken) {
        // Decrypt the token
        const bytes = CryptoJS.AES.decrypt(
          encryptedToken,
          process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_key"
        );
        const token = bytes.toString(CryptoJS.enc.Utf8);

        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({
    
  }),
});

export default baseApi;
