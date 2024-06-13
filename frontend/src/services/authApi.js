import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "../api/api";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: "user/signup",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "user/login",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "user/logout",
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "user/resetPassword",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "user/change-password",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: "user/profile",
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "user/updateProfile",
        method: "POST",
        body,
      }),
    }),
    saveProfilePic: builder.mutation({
      query: (body) => ({
        url: "user/saveProfilePic",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useSaveProfilePicMutation,
  useUpdateProfileMutation,
} = authApi;
