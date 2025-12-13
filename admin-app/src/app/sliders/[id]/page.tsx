"use client";
import { use } from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import EditSlider from "../../components/slider/edit-slider";
import { useGetSliderQuery } from "@/redux/slider/sliderApi";

const EditSliderPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data: slider, isLoading } = useGetSliderQuery(id);

  if (isLoading) {
    return (
      <Wrapper>
        <div className="body-content px-8 py-8 bg-slate-100">
          <h2>Loading...</h2>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Edit Slider" subtitle="Sliders" />
        {/* breadcrumb end */}

        {/*edit slider area start */}
        <div className="grid grid-cols-12">
          <div className="col-span-12 2xl:col-span-10">
            {slider?.result && <EditSlider slider={slider.result} />}
          </div>
        </div>
        {/*edit slider area end */}
      </div>
    </Wrapper>
  );
};

export default EditSliderPage;

