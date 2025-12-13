import { apiSlice } from "src/redux/api/apiSlice";

export const sliderApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get active sliders
    getActiveSliders: builder.query({
      query: () => `api/slider/active`,
      providesTags: ["Sliders"],
      keepUnusedDataFor: 600,
    }),
  }),
});

export const {
  useGetActiveSlidersQuery,
} = sliderApi;

