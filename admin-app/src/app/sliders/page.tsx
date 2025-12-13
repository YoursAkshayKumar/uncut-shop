import Wrapper from "@/layout/wrapper";
import AddSlider from "../components/slider/add-slider";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import SliderTables from "../components/slider/slider-table";

const SlidersPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Sliders" subtitle="Sliders" />
        {/* breadcrumb end */}

        {/*add slider area start */}
        <div className="grid grid-cols-12">
          <div className="col-span-12 2xl:col-span-10">
            <AddSlider />
          </div>
        </div>
        {/*add slider area end */}

        {/*slider table start */}
        <div className="grid grid-cols-12 mt-6">
          <div className="col-span-12 2xl:col-span-10">
            <SliderTables />
          </div>
        </div>
        {/*slider table end */}
      </div>
    </Wrapper>
  );
};

export default SlidersPage;

