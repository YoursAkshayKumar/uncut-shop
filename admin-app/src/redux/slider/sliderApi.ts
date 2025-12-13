import { apiSlice } from "../api/apiSlice";
import { SliderDelResponse, SliderResponse, ISliderAddResponse, IAddSlider, ISliderItem } from "@/types/slider-type";

export const sliderApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get all sliders
    getAllSliders: builder.query<SliderResponse, void>({
      query: () => `/api/slider/all`,
      providesTags: ["AllSliders"],
      keepUnusedDataFor: 600,
    }),
    // get active sliders
    getActiveSliders: builder.query<SliderResponse, void>({
      query: () => `/api/slider/active`,
      providesTags: ["ActiveSliders"],
      keepUnusedDataFor: 600,
    }),
    // add slider
    addSlider: builder.mutation<ISliderAddResponse, IAddSlider>({
      query(data: IAddSlider) {
        return {
          url: `/api/slider/add`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AllSliders", "ActiveSliders"],
    }),
    // edit slider
    editSlider: builder.mutation<ISliderAddResponse, { id: string; data: Partial<IAddSlider> }>({
      query({ id, data }) {
        return {
          url: `/api/slider/edit/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["AllSliders", "ActiveSliders", "getSlider"],
    }),
    // get single slider
    getSlider: builder.query<{ success: boolean; result: ISliderItem }, string>({
      query: (id) => `/api/slider/get/${id}`,
      providesTags: ['getSlider']
    }),
    // delete slider
    deleteSlider: builder.mutation<SliderDelResponse, string>({
      query(id: string) {
        return {
          url: `/api/slider/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AllSliders", "ActiveSliders"],
    }),
  }),
});

export const {
  useGetAllSlidersQuery,
  useGetActiveSlidersQuery,
  useDeleteSliderMutation,
  useAddSliderMutation,
  useEditSliderMutation,
  useGetSliderQuery,
} = sliderApi;

