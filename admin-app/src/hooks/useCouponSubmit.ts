import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
  Control,
  SubmitHandler,
} from "react-hook-form";
import { notifyError, notifySuccess } from "@/utils/toast";
import {
  useAddCouponMutation,
  useEditCouponMutation,
} from "@/redux/coupon/couponApi";
import dayjs from "dayjs";

// 🎯 Define the Form Data interface
export interface CouponFormData {
  Name: string;
  Code: string;
  endTime: string;
  discountPercentage: string;
  minimumAmount: string;
}

// 🎯 Define the Hook return type
interface UseCouponSubmitReturn {
  handleCouponSubmit: SubmitHandler<CouponFormData>;
  handleSubmitEditCoupon: (data: CouponFormData, id: string) => Promise<void>;
  isSubmitted: boolean;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  logo: string;
  setLogo: React.Dispatch<React.SetStateAction<string>>;
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  selectProductType: string;
  setSelectProductType: React.Dispatch<React.SetStateAction<string>>;
  setEditId: React.Dispatch<React.SetStateAction<string>>;
  register: UseFormRegister<CouponFormData>;
  handleSubmit: UseFormHandleSubmit<CouponFormData>;
  errors: FieldErrors<CouponFormData>;
  control: Control<CouponFormData>;
}

const useCouponSubmit = (): UseCouponSubmitReturn => {
  const [logo, setLogo] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [selectProductType, setSelectProductType] = useState<string>("");
  const [editId, setEditId] = useState<string>("");
  const router = useRouter();

  const [addCoupon] = useAddCouponMutation();
  const [editCoupon] = useEditCouponMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CouponFormData>();

  useEffect(() => {
    if (!openSidebar) {
      setLogo("");
      setSelectProductType("");
      reset();
    }
  }, [openSidebar, reset]);

  // ✅ Strictly typed handler
  const handleCouponSubmit: SubmitHandler<CouponFormData> = async (data) => {
    try {
      const coupon_data = {
        logo,
        title: data.Name,
        couponCode: data.Code,
        endTime: dayjs(data.endTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        discountPercentage: data.discountPercentage,
        minimumAmount: data.minimumAmount,
        productType: selectProductType,
      };

      const res = await addCoupon({ ...coupon_data });
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
      } else {
        notifySuccess("Coupon added successfully");
        setIsSubmitted(true);
        setLogo("");
        setOpenSidebar(false);
        setSelectProductType("");
        reset();
      }
    } catch (error) {
      console.error(error);
      notifyError("Something went wrong");
    }
  };

  const handleSubmitEditCoupon = async (data: CouponFormData, id: string) => {
    try {
      const coupon_data = {
        logo,
        title: data.Name,
        couponCode: data.Code,
        endTime: dayjs(data.endTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        discountPercentage: data.discountPercentage,
        minimumAmount: data.minimumAmount,
        productType: selectProductType,
      };
      const res = await editCoupon({ id, data: coupon_data });
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
      } else {
        notifySuccess("Coupon updated successfully");
        router.push("/coupon");
        setIsSubmitted(true);
        reset();
      }
    } catch (error) {
      console.error(error);
      notifyError("Something went wrong");
    }
  };

  return {
    handleCouponSubmit,
    handleSubmitEditCoupon,
    isSubmitted,
    setIsSubmitted,
    logo,
    setLogo,
    register,
    handleSubmit,
    errors,
    openSidebar,
    setOpenSidebar,
    control,
    selectProductType,
    setSelectProductType,
    setEditId,
  };
};

export default useCouponSubmit;
