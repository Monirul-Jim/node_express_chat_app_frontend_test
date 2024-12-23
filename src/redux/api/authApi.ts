import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    getAllUser: builder.query({
      query: () => ({
        url: "/auth",
        method: "GET",
      }),
    }),
    updateIsDeleted: builder.mutation({
      query: ({ userId, isDeleted }) => ({
        url: `/auth/${userId}/isDeleted`,
        method: "PATCH",
        body: { isDeleted },
      }),
    }),

    // Update role of a user
    updateRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/auth/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
    }),

    // Update status of a user
    updateStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/auth/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetAllUserQuery,
  useUpdateIsDeletedMutation,
  useUpdateRoleMutation,
  useUpdateStatusMutation,
} = authApi;
