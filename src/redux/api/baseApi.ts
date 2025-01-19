import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://node-express-chat-app-backend-test.onrender.com/api/v1",
    // baseUrl: "http://localhost:5000/api/v1",
    credentials: "include",
  }),
  tagTypes: ["user", "addedUser"],
  endpoints: () => ({}),
});
