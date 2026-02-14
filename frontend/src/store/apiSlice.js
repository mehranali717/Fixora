import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const normalizeBaseUrl = (raw) => {
  const value = (raw || "http://localhost:5000/api").replace(/\/+$/, "");
  return value.endsWith("/api") ? value : `${value}/api`;
};

const baseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE);

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Auth", "Service", "Category", "Booking", "Review", "User", "Analytics"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (payload) => ({ url: "auth/register", method: "POST", body: payload }),
    }),
    login: builder.mutation({
      query: (payload) => ({ url: "auth/login", method: "POST", body: payload }),
    }),
    refresh: builder.mutation({
      query: () => ({ url: "auth/refresh", method: "POST" }),
    }),
    logoutApi: builder.mutation({
      query: () => ({ url: "auth/logout", method: "POST" }),
    }),
    me: builder.query({
      query: () => "auth/me",
      providesTags: ["Auth"],
    }),

    getServices: builder.query({
      query: (params = {}) => ({ url: "services", params }),
      providesTags: ["Service"],
    }),
    getServiceById: builder.query({
      query: (id) => `services/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Service", id }],
    }),
    createService: builder.mutation({
      query: (payload) => ({
        url: "services",
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `services/${id}`,
        method: "PUT",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Service"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({ url: `services/${id}`, method: "DELETE" }),
      invalidatesTags: ["Service"],
    }),
    getServiceReviews: builder.query({
      query: (id) => `services/${id}/reviews`,
      providesTags: ["Review"],
    }),

    getCategories: builder.query({
      query: () => "categories",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (payload) => ({ url: "categories", method: "POST", body: payload }),
      invalidatesTags: ["Category"],
    }),

    createBooking: builder.mutation({
      query: (payload) => ({ url: "bookings", method: "POST", body: payload }),
      invalidatesTags: ["Booking"],
    }),
    getMyBookings: builder.query({
      query: () => "bookings/my",
      providesTags: ["Booking"],
    }),
    getAllBookings: builder.query({
      query: () => "bookings",
      providesTags: ["Booking"],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `bookings/${id}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: ["Booking", "Analytics"],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({ url: `bookings/${id}/cancel`, method: "PATCH" }),
      invalidatesTags: ["Booking", "Analytics"],
    }),

    createReview: builder.mutation({
      query: (payload) => ({ url: "reviews", method: "POST", body: payload }),
      invalidatesTags: ["Review", "Service"],
    }),

    getUsers: builder.query({
      query: () => "users",
      providesTags: ["User"],
    }),
    blockUser: builder.mutation({
      query: ({ id, isBlocked }) => ({ url: `users/${id}/block`, method: "PATCH", body: { isBlocked } }),
      invalidatesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({ url: "users/me", method: "PATCH", body: payload }),
      invalidatesTags: ["Auth", "User"],
    }),

    getAnalytics: builder.query({
      query: () => "admin/analytics",
      providesTags: ["Analytics"],
    }),
    updatePricing: builder.mutation({
      query: ({ id, price }) => ({ url: `admin/pricing/${id}`, method: "PATCH", body: { price } }),
      invalidatesTags: ["Service", "Analytics"],
    }),

    createCheckout: builder.mutation({
      query: (bookingId) => ({ url: "payments/checkout", method: "POST", body: { bookingId } }),
    }),
    uploadServiceImage: builder.mutation({
      query: (formData) => ({ url: "upload/service-image", method: "POST", body: formData }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutApiMutation,
  useMeQuery,
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceReviewsQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  useCreateReviewMutation,
  useGetUsersQuery,
  useBlockUserMutation,
  useUpdateProfileMutation,
  useGetAnalyticsQuery,
  useUpdatePricingMutation,
  useCreateCheckoutMutation,
  useUploadServiceImageMutation,
} = api;