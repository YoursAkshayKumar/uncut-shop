"use client";
import React, { useEffect, useState } from "react";
import useSliderSubmit from "@/hooks/useSliderSubmit";
import GlobalImgUpload from "../category/global-img-upload";
import FormField from "../products/form-field";
import BrandStatus from "../brand/brand-status";
import { ISliderItem } from "@/types/slider-type";
import ErrorMsg from "../common/error-msg";

type IPropType = {
  slider: ISliderItem;
};

const EditSlider = ({ slider }: IPropType) => {
  const {
    errors,
    handleSubmit,
    register,
    setBackgroundImage,
    setBackgroundImageTablet,
    setBackgroundImageMobile,
    setProductImage,
    setStatus,
    handleSubmitEditSlider,
    isSubmitted,
    setIsSubmitted,
    backgroundImage,
    backgroundImageTablet,
    backgroundImageMobile,
    productImage,
    status,
  } = useSliderSubmit();
  
  const [backgroundImageError, setBackgroundImageError] = useState<string>("");

  useEffect(() => {
    if (slider) {
      setBackgroundImage(slider.backgroundImage || "");
      setBackgroundImageTablet(slider.backgroundImageTablet || "");
      setBackgroundImageMobile(slider.backgroundImageMobile || "");
      setProductImage(slider.productImage || "");
      setStatus(slider.status || "active");
    }
  }, [slider, setBackgroundImage, setBackgroundImageTablet, setBackgroundImageMobile, setProductImage, setStatus]);

  // handle Change status
  const handleChange = (value: string | number | undefined) => {
    setStatus(value as string);
  };

  const onSubmit = (data: any) => {
    // Clear previous error
    setBackgroundImageError("");
    
    // Validate background image
    if (!backgroundImage || backgroundImage.trim() === "") {
      setBackgroundImageError("Background image is required!");
      return;
    }
    
    handleSubmitEditSlider(data, slider._id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <div className="bg-white px-8 py-8 rounded-md">
          <h4 className="text-[22px]">General</h4>
          <FormField
            title="title"
            isRequired={false}
            placeHolder="Slider Title"
            register={register}
            errors={errors}
            defaultValue={slider.title}
          />
          <FormField
            title="pre title"
            isRequired={false}
            placeHolder="Pre Title"
            register={register}
            errors={errors}
            defaultValue={slider.preTitle}
          />

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6">
              <FormField
                title="button text"
                isRequired={false}
                placeHolder="Button Text"
                bottomTitle="Text for the call-to-action button."
                defaultValue={slider.buttonText}
                register={register}
                errors={errors}
              />
              <FormField
                title="button link"
                isRequired={false}
                placeHolder="/shop"
                bottomTitle="Link URL for the button."
                defaultValue={slider.buttonLink}
                register={register}
                errors={errors}
              />
              <FormField
                title="order"
                type="number"
                isRequired={false}
                placeHolder="0"
                bottomTitle="Display order (lower numbers appear first)."
                defaultValue={slider.order}
                register={register}
                errors={errors}
              />
            </div>
          </div>

          {/* Background Images Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="text-lg font-medium mb-4">Background Images</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Desktop */}
              <div>
                <p className="mb-3 text-sm font-medium text-black">Desktop <span className="text-red-500">*</span></p>
                <div className="mb-2 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs font-medium text-blue-800 mb-0.5">📐 Size:</p>
                  <p className="text-xs text-blue-700">1920 × 700px (or 1600 × 600px for laptops)</p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-theme transition-colors bg-gray-50">
                  <GlobalImgUpload
                    isSubmitted={isSubmitted}
                    setImage={setBackgroundImage}
                    image={backgroundImage}
                    setIsSubmitted={setIsSubmitted}
                  />
                </div>
                {backgroundImageError && (
                  <ErrorMsg msg={backgroundImageError} />
                )}
              </div>

              {/* Tablet */}
              <div>
                <p className="mb-3 text-sm font-medium text-black">Tablet <span className="text-gray-400 text-xs">(Optional)</span></p>
                <div className="mb-2 px-2 py-1.5 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-xs font-medium text-green-800 mb-0.5">📐 Size:</p>
                  <p className="text-xs text-green-700">1024 × 600px</p>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors bg-gray-50">
                  <GlobalImgUpload
                    isSubmitted={isSubmitted}
                    setImage={setBackgroundImageTablet}
                    image={backgroundImageTablet}
                    setIsSubmitted={setIsSubmitted}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Falls back to desktop</p>
              </div>

              {/* Mobile */}
              <div>
                <p className="mb-3 text-sm font-medium text-black">Mobile <span className="text-gray-400 text-xs">(Optional)</span></p>
                <div className="mb-2 px-2 py-1.5 bg-purple-50 border border-purple-200 rounded-md">
                  <p className="text-xs font-medium text-purple-800 mb-0.5">📐 Size:</p>
                  <p className="text-xs text-purple-700">768 × 500px</p>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors bg-gray-50">
                  <GlobalImgUpload
                    isSubmitted={isSubmitted}
                    setImage={setBackgroundImageMobile}
                    image={backgroundImageMobile}
                    setIsSubmitted={setIsSubmitted}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Falls back to tablet/desktop</p>
              </div>

              {/* Product Image */}
              <div>
                <p className="mb-3 text-sm font-medium text-black">Product Image <span className="text-gray-400 text-xs">(Optional)</span></p>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors bg-gray-50">
                  <GlobalImgUpload
                    isSubmitted={isSubmitted}
                    setImage={setProductImage}
                    image={productImage}
                    setIsSubmitted={setIsSubmitted}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="mb-5 text-base text-black">Status</p>
            <BrandStatus handleChange={handleChange} default_value={slider.status} />
          </div>
        </div>
      </div>
      <button className="tp-btn px-5 py-2 mt-5" type="submit">
        Submit Slider
      </button>
    </form>
  );
};

export default EditSlider;
