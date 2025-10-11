"use client";
import React from "react";
import CouponTable from "./coupon-table";
import useCouponSubmit, { CouponFormData } from "@/hooks/useCouponSubmit"; // ⬅️ IMPORT CouponFormData
import { useGetCouponQuery } from "@/redux/coupon/couponApi";
import Loading from "../common/loading";
import ErrorMsg from "../common/error-msg";
import GlobalImgUpload from "../category/global-img-upload";
import CouponFormField from "../brand/form-field-two";
import ProductType from "../products/add-product/product-type";

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
  
  // get specific coupon
  const { data: coupon, isError, isLoading } = useGetCouponQuery(id);
  
  // decide to render
  let content = null;
  if (isLoading) {
    content = <Loading loading={isLoading} spinner="fade" />;
  }
  if (!coupon && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  
  if (coupon && !isError) {
    content = (
      <>
        <div className="col-span-12 lg:col-span-4">
          {/* 🎯 FIX 1: Add Type Assertion (data as CouponFormData) to resolve the "undefined" type error */}
          <form onSubmit={handleSubmit((data) => handleSubmitEditCoupon(data as CouponFormData, id))}>
            <div className="mb-6 bg-white px-8 py-8 rounded-md">
              {/* coupon image upload */}
              <div className="bg-white">
                <GlobalImgUpload
                  isSubmitted={isSubmitted}
                  setImage={setLogo}
                  image={logo}
                  setIsSubmitted={setIsSubmitted}
                  default_img={coupon.logo}
                />
              </div>
              {/* coupon image upload */}
              <CouponFormField
                register={register}
                errors={errors}
                name="Name"
                isReq={true}
                default_val={coupon.title}
              />
              <CouponFormField
                register={register}
                errors={errors}
                name="Code"
                isReq={true}
                default_val={coupon.couponCode}
              />
              {/* 🎯 FIX 2: Ensure the date field handles the backend format */}
              <CouponFormField
                register={register}
                errors={errors}
                name="endTime"
                isReq={true}
                type="date"
                // Assuming coupon.endTime is an ISO string (e.g., "2024-12-31T...")
                // We use slice(0, 10) to get "YYYY-MM-DD" format required by date input
                default_val={coupon.endTime ? coupon.endTime.slice(0, 10) : ''} 
              />
              <CouponFormField
                register={register}
                errors={errors}
                name="discountPercentage"
                isReq={true}
                default_val={coupon.discountPercentage}
              />
              <CouponFormField
                register={register}
                errors={errors}
                name="minimumAmount"
                isReq={true}
                default_val={coupon.minimumAmount}
              />

              <button className="tp-btn px-7 py-2">Edit Coupon</button>
            </div>
          </form>
        </div>
      </>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {content}
        <div className="col-span-12 lg:col-span-8">
          {/* brand table start */}
          <div className="relative overflow-x-auto bg-white px-8 py-4 rounded-md">
            <div className="overflow-scroll 2xl:overflow-visible">
              <CouponTable cls="w-[975px] 2xl:w-full" setOpenSidebar={setOpenSidebar} />
            </div>
          </div>
          {/* brand table end */}
        </div>
      </div>
    </>
  );
};

export default CouponEditArea;