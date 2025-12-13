import { useState } from "react";
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form";
import { useAddSliderMutation, useEditSliderMutation } from "@/redux/slider/sliderApi";
import { notifyError, notifySuccess } from "@/utils/toast";

const useSliderSubmit = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [backgroundImageTablet, setBackgroundImageTablet] = useState<string>("");
  const [backgroundImageMobile, setBackgroundImageMobile] = useState<string>("");
  const [productImage, setProductImage] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const router = useRouter();
  // add
  const [addSlider] = useAddSliderMutation();
  // edit
  const [editSlider] = useEditSliderMutation();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // submit handle
  const handleSubmitSlider = async (data: any) => {
    try {
      const slider_data = {
        title: data?.title || "",
        preTitle: data?.pre_title || data?.preTitle || "",
        backgroundImage: backgroundImage,
        backgroundImageTablet: backgroundImageTablet && backgroundImageTablet.trim() !== "" ? backgroundImageTablet : undefined,
        backgroundImageMobile: backgroundImageMobile && backgroundImageMobile.trim() !== "" ? backgroundImageMobile : undefined,
        productImage: productImage || undefined,
        buttonText: data?.button_text || data?.buttonText || "Explore The Collection",
        buttonLink: data?.button_link || data?.buttonLink || "/shop",
        order: data?.order ? parseInt(data.order) : 0,
        status: status
      };
      
      // Validate background image - return early if missing (form will show error)
      if (!backgroundImage || backgroundImage.trim() === "") {
        return;
      }
      const res = await addSlider({ ...slider_data });
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
      } else {
        notifySuccess("Slider added successfully");
        setIsSubmitted(true);
        reset();
        setBackgroundImage("");
        setBackgroundImageTablet("");
        setBackgroundImageMobile("");
        setProductImage("");
      }
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  //handle Submit edit Slider
  const handleSubmitEditSlider = async (data: any, id: string) => {
    try {
      const slider_data = {
        title: data?.title || "",
        preTitle: data?.pre_title || data?.preTitle || "",
        backgroundImage: backgroundImage,
        backgroundImageTablet: backgroundImageTablet && backgroundImageTablet.trim() !== "" ? backgroundImageTablet : undefined,
        backgroundImageMobile: backgroundImageMobile && backgroundImageMobile.trim() !== "" ? backgroundImageMobile : undefined,
        productImage: productImage || undefined,
        buttonText: data?.button_text || data?.buttonText || "Explore The Collection",
        buttonLink: data?.button_link || data?.buttonLink || "/shop",
        order: data?.order ? parseInt(data.order) : 0,
        status: status
      };
      
      // Validate background image - return early if missing (form will show error)
      if (!backgroundImage || backgroundImage.trim() === "") {
        return;
      }
      const res = await editSlider({ id, data: slider_data });
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
      } else {
        notifySuccess("Slider updated successfully");
        router.push('/sliders')
        setIsSubmitted(true);
        reset();
      }
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    setBackgroundImage,
    setBackgroundImageTablet,
    setBackgroundImageMobile,
    setProductImage,
    setStatus,
    handleSubmitSlider,
    isSubmitted,
    setIsSubmitted,
    handleSubmitEditSlider,
    backgroundImage,
    backgroundImageTablet,
    backgroundImageMobile,
    productImage,
    status,
  };
};

export default useSliderSubmit;

