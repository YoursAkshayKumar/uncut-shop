import { apiSlice } from "src/redux/api/apiSlice";

export const subscriptionApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // add subscription
    addSubscription: builder.mutation({
      query: (data) => ({
        url: `api/subscription/add`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useAddSubscriptionMutation,
} = subscriptionApi;
