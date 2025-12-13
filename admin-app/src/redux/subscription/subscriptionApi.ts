import { apiSlice } from "../api/apiSlice";

export interface ISubscription {
  _id: string;
  email: string;
  status: "active" | "unsubscribed";
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionResponse {
  success: boolean;
  result: ISubscription[];
}

export interface SubscriptionDelResponse {
  success: boolean;
  message: string;
}

export const subscriptionApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get all subscriptions
    getAllSubscriptions: builder.query<SubscriptionResponse, void>({
      query: () => `/api/subscription/all`,
      providesTags: ["AllSubscriptions"],
      keepUnusedDataFor: 600,
    }),
    // delete subscription
    deleteSubscription: builder.mutation<SubscriptionDelResponse, string>({
      query(id: string) {
        return {
          url: `/api/subscription/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AllSubscriptions"],
    }),
    // update subscription status
    updateSubscriptionStatus: builder.mutation<
      { success: boolean; message: string; data: ISubscription },
      { id: string; status: "active" | "unsubscribed" }
    >({
      query({ id, status }) {
        return {
          url: `/api/subscription/update-status/${id}`,
          method: "PATCH",
          body: { status },
        };
      },
      invalidatesTags: ["AllSubscriptions"],
    }),
  }),
});

export const {
  useGetAllSubscriptionsQuery,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionStatusMutation,
} = subscriptionApi;
