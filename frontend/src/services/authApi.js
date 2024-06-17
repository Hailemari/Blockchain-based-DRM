import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://manage-content.onrender.com/';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: 'auth/signup',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: 'auth/users',
        method: 'GET',
      }),
    }),
    removeUser: builder.mutation({
      query: (userId) => ({
        url: `auth/users/${userId}`,
        method: 'DELETE',
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: 'auth/profile',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),


    updateProfile: builder.mutation({
      query: (body) => ({
        url: 'auth/update-profile',
        method: 'PUT',
        body,
        Authorization : `Bearer ${localStorage.getItem('token')}`,

      }),
    }),


    forgotPassword: builder.mutation({
      query: (body) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: `auth/reset-password/${body.resetToken}`,
        method: 'POST',
        body,
      }),
    }),

  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useRemoveUserMutation,
  useUpdateProfileMutation,
  useGetUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  
} = authApi;
