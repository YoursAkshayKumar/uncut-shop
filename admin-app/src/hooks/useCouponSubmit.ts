import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// 1. Import necessary types from react-hook-form
import { useForm, UseFormHandleSubmit, UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useAddCouponMutation, useEditCouponMutation, useGetCouponQuery } from "@/redux/coupon/couponApi";
import dayjs from "dayjs";

// 🎯 Step 1: Define the Form Data Interface
// This interface MUST match the field names used in your input components.
// Note: The fields are lowercased and joined in your handleCouponSubmit logic, 
// but the RHF 'name' attributes (e.g., 'Name', 'Code') need to be consistent.
export interface CouponFormData {
  Name: string; 
  Code: string;
  endTime: string;
  discountPercentage: string;
  minimumAmount: string;
  // If product type is handled by 'control' but not directly registered, it's fine.
  // If you register a field for product type, add it here (e.g., productType: string).
}

// 🎯 Step 2: Define the Hook's Return Type for consistency (optional but recommended)
interface UseCouponSubmitReturn {
  handleCouponSubmit: (data: CouponFormData) => Promise<void>;
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
  
  // Strongly typed react-hook-form values
  register: UseFormRegister<CouponFormData>;
  handleSubmit: UseFormHandleSubmit<CouponFormData, undefined>;
  errors: FieldErrors<CouponFormData>;
  control: Control<CouponFormData>;
}


// Change hook return type to the defined interface
const useCouponSubmit = (): UseCouponSubmitReturn => { 
  const [logo, setLogo] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [selectProductType, setSelectProductType] = useState<string>("");
  const [editId, setEditId] = useState<string>("");
  const router = useRouter();

  // add coupon
  const [addCoupon, { }] = useAddCouponMutation();
  // edit coupon
  const [editCoupon, { }] = useEditCouponMutation();
  
  // 🎯 FIX 6: Apply the CouponFormData type to useForm()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CouponFormData>(); // <--- KEY CHANGE HERE

  // ... (useEffect remains the same)
  useEffect(() => {
    if (!openSidebar) {
      setLogo("")
      setSelectProductType("");
      reset();
    }
  }, [openSidebar, reset])
  
  // submit handle
  // 🎯 FIX 7: Use CouponFormData for the data argument
  const handleCouponSubmit = async (data: CouponFormData) => {
    try {
      const coupon_data = {
        logo: logo,
        // Ensure property names here match the backend expectations (lowercase/camelCase)
        title: data.Name, 
        couponCode: data.Code,
        endTime: dayjs(data.endTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
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
        setLogo("")
        setOpenSidebar(false);
        setSelectProductType("");
        reset();
      }
    } catch (error) {
      console.log(error);
      notifyError("Something went wrong");
    }
  };

    //handle Submit edit Category
    // 🎯 FIX 8: Use CouponFormData for the data argument
    const handleSubmitEditCoupon = async (data: CouponFormData, id: string) => {
    try {
      const coupon_data = {
        logo: logo,
        // Ensure property names here match the backend expectations
        title: data.Name, 
        couponCode: data.Code,
        endTime: dayjs(data.endTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
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
        notifySuccess("Coupon update successfully");
        router.push('/coupon')
        setIsSubmitted(true);
        reset();
      }
    } catch (error) {
      console.log(error);
      notifyError("Something went wrong");
    }
  };

  return {
    handleCouponSubmit,
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
    handleSubmitEditCoupon,
    setEditId,
  };
};

export default useCouponSubmit;