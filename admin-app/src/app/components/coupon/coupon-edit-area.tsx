"use client";
import React from "react";
import CouponTable from "./coupon-table";
import useCouponSubmit, { CouponFormData } from "@/hooks/useCouponSubmit";
import { useGetCouponQuery } from "@/redux/coupon/couponApi";
import Loading from "../common/loading";
import ErrorMsg from "../common/error-msg";
import GlobalImgUpload from "../category/global-img-upload";
import CouponFormField from "../brand/form-field-two";

const CouponEditArea = ({ id }: { id: string }) => {
  const {
    errors,
    handleSubmit,
    isSubmitted,
    logo,
    register,
    setIsSubmitted,
    setLogo,
    setOpenSidebar,
    control,
    setSelectProductType,
    handleSubmitEditCoupon,
  } = useCouponSubmit();

  const { data: coupon, isError, isLoading } = useGetCouponQuery(id);

  let content = null;
  if (isLoading) {
    content = <Loading loading={isLoading} spinner="fade" />;
  } else if (isError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (coupon) {
    content = (
      <div className="col-span-12 lg:col-span-4">
        <form onSubmit={handleSubmit((data) => handleSubmitEditCoupon(data as CouponFormData, id))}>
          <div className="mb-6 bg-white px-8 py-8 rounded-md">
            <GlobalImgUpload
              isSubmitted={isSubmitted}
              setImage={setLogo}
              image={logo}
              setIsSubmitted={setIsSubmitted}
              default_img={coupon?.logo ?? ""}
            />
            <CouponFormField
              register={register}
              errors={errors}
              name="Name"
              isReq={true}
              default_val={coupon?.title ?? ""}
            />
            <CouponFormField
              register={register}
              errors={errors}
              name="Code"
              isReq={true}
              default_val={coupon?.couponCode ?? ""}
            />
            <CouponFormField
              register={register}
              errors={errors}
              name="endTime"
              isReq={true}
              type="date"
              default_val={
                typeof coupon?.endTime === "string"
                  ? coupon.endTime.slice(0, 10)
                  : coupon?.endTime
                    ? new Date(coupon.endTime).toISOString().slice(0, 10)
                    : ""
              }
            />
            <CouponFormField
              register={register}
              errors={errors}
              name="discountPercentage"
              isReq={true}
              default_val={coupon?.discountPercentage ?? ""}
            />
            <CouponFormField
              register={register}
              errors={errors}
              name="minimumAmount"
              isReq={true}
              default_val={coupon?.minimumAmount ?? ""}
            />
            <button className="tp-btn px-7 py-2">Edit Coupon</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {content}
      <div className="col-span-12 lg:col-span-8">
        <div className="relative overflow-x-auto bg-white px-8 py-4 rounded-md">
          <div className="overflow-scroll 2xl:overflow-visible">
            <CouponTable cls="w-[975px] 2xl:w-full" setOpenSidebar={setOpenSidebar} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponEditArea;
