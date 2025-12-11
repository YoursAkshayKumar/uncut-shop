'use client';
import * as dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
//internal import
import { notifyError, notifySuccess } from "@utils/toast";
import { useGetOfferCouponsQuery } from "src/redux/features/coupon/couponApi";
import Loader from "@components/loader/loader";
import { set_coupon } from "src/redux/features/coupon/couponSlice";
import useCartInfo from "./use-cart-info";
import { set_shipping } from "src/redux/features/order/orderSlice";
import {
  useAddOrderMutation,
  useCreatePaymentIntentMutation,
  useVerifyPaymentMutation,
} from "src/redux/features/order/orderApi";

const useCheckoutSubmit = () => {
  const { data: offerCoupons, isError, isLoading } = useGetOfferCouponsQuery();
  const [addOrder, {}] = useAddOrderMutation();
  const [createPaymentIntent, {}] = useCreatePaymentIntentMutation();
  const [verifyPayment, {}] = useVerifyPaymentMutation();
  const { cart_products } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { shipping_info } = useSelector((state) => state.order);
  const { total, setTotal } = useCartInfo();
  const [couponInfo, setCouponInfo] = useState({});
  const [cartTotal, setCartTotal] = useState("");
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountProductType, setDiscountProductType] = useState("");
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [cardError, setCardError] = useState("");
  const [razorpayOrderId, setRazorpayOrderId] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const couponRef = useRef("");

  useEffect(() => {
    if (localStorage.getItem("couponInfo")) {
      const data = localStorage.getItem("couponInfo");
      const coupon = JSON.parse(data);
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountPercentage);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountProductType(coupon.productType);
    }
  }, []);

  useEffect(() => {
    if (minimumAmount - discountAmount > total || cart_products.length === 0) {
      setDiscountPercentage(0);
      localStorage.removeItem("couponInfo");
    }
  }, [minimumAmount, total, discountAmount, cart_products]);

  //calculate total and discount value
  useEffect(() => {
    const result = cart_products?.filter((p) => p.type === discountProductType);
    const discountProductTotal = result?.reduce(
      (preValue, currentValue) =>
        preValue + currentValue.originalPrice * currentValue.orderQuantity,
      0
    );
    let totalValue = "";
    let subTotal = Number((total + shippingCost).toFixed(2));
    let discountTotal = Number(
      discountProductTotal * (discountPercentage / 100)
    );
    totalValue = Number(subTotal - discountTotal);
    setDiscountAmount(discountTotal);
    setCartTotal(totalValue);
  }, [
    total,
    shippingCost,
    discountPercentage,
    cart_products,
    discountProductType,
    discountAmount,
    cartTotal,
  ]);

  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== "undefined" && !razorpayLoaded) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [razorpayLoaded]);

  // handleCouponCode
  const handleCouponCode = (e) => {
    e.preventDefault();

    if (!couponRef.current?.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    if (isLoading) {
      return <Loader loading={isLoading} />;
    }
    if (isError) {
      return notifyError("Something went wrong");
    }
    const result = offerCoupons?.filter(
      (coupon) => coupon.couponCode === couponRef.current?.value
    );

    if (result.length < 1) {
      notifyError("Please Input a Valid Coupon!");
      return;
    }

    if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
      notifyError("This coupon is not valid!");
      return;
    }

    if (total < result[0]?.minimumAmount) {
      notifyError(
        `Minimum ₹${result[0].minimumAmount} required for Apply this coupon!`
      );
      return;
    } else {
      notifySuccess(
        `Your Coupon ${result[0].title} is Applied on ${result[0].productType}!`
      );
      setMinimumAmount(result[0]?.minimumAmount);
      setDiscountProductType(result[0].productType);
      setDiscountPercentage(result[0].discountPercentage);
      dispatch(set_coupon(result[0]));
    }
  };

  // handleShippingCost
  const handleShippingCost = (value) => {
    // setTotal(total + value);
    setShippingCost(value);
  };

  //set values
  useEffect(() => {
    setValue("firstName", shipping_info.firstName);
    setValue("lastName", shipping_info.lastName);
    setValue("address", shipping_info.address);
    setValue("city", shipping_info.city);
    setValue("country", shipping_info.country);
    setValue("zipCode", shipping_info.zipCode);
    setValue("email", shipping_info.email);
    setValue("contact", shipping_info.contact);
  }, [user, setValue, shipping_info,router]);

  // submitHandler
  const submitHandler = async (data) => {
    dispatch(set_shipping(data));
    setIsCheckoutSubmit(true);

    const hasRzpKey = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    if (!hasRzpKey) {
      notifyError("Razorpay key is missing. Please contact support.");
      setIsCheckoutSubmit(false);
      return;
    }

    if (!cartTotal || Number(cartTotal) <= 0) {
      notifyError("Invalid order amount. Please refresh and try again.");
      setIsCheckoutSubmit(false);
      return;
    }

    if (typeof window === "undefined" || !window.Razorpay || !razorpayLoaded) {
      notifyError("Razorpay SDK not loaded. Please refresh the page.");
      setIsCheckoutSubmit(false);
      return;
    }

    let orderInfo = {
      name: `${data.firstName} ${data.lastName}`,
      address: data.address,
      contact: data.contact,
      email: data.email,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      shippingOption: data.shippingOption,
      status: "pending",
      cart: cart_products,
      subTotal: total,
      shippingCost: shippingCost,
      discount: discountAmount,
      totalAmount: cartTotal,
      user:`${user?._id}`
    };

    try {
      // Create Razorpay order on demand so orderId is always fresh
      const paymentIntent = await createPaymentIntent({
        price: Math.round(cartTotal),
      }).unwrap();

      const latestOrderId = paymentIntent?.orderId || paymentIntent?.order_id;
      if (!latestOrderId) {
        notifyError("Payment could not be initialized. Please try again.");
        setIsCheckoutSubmit(false);
        return;
      }

      setRazorpayOrderId(latestOrderId);
      handlePaymentWithRazorpay(orderInfo, {
        orderId: latestOrderId,
        amount: paymentIntent?.amount,
        currency: paymentIntent?.currency,
      });
    } catch (err) {
      console.log(err);
      notifyError("Failed to initialize payment. Please try again.");
      setIsCheckoutSubmit(false);
    }
  };

  // handlePaymentWithRazorpay
  const handlePaymentWithRazorpay = async (orderInfo, paymentMeta = {}) => {
    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentMeta.amount || Math.round(cartTotal * 100), // Amount in paise
        currency: paymentMeta.currency || "INR",
        name: "Uncut Designs",
        description: "Order Payment",
        order_id: paymentMeta.orderId || razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            if (verifyResult.success) {
              const orderData = {
                ...orderInfo,
                paymentIntent: {
                  id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                },
              };

              const result = await addOrder(orderData).unwrap();
              
              if (result?.success) {
                router.push(`/order/${result.order?._id}`);
                notifySuccess("Your Order Confirmed!");
                setIsCheckoutSubmit(false);
              } else {
                notifyError("Order creation failed");
                setIsCheckoutSubmit(false);
              }
            } else {
              notifyError("Payment verification failed");
              setIsCheckoutSubmit(false);
            }
          } catch (error) {
            console.log(error);
            notifyError("Payment verification failed");
            setIsCheckoutSubmit(false);
          }
        },
        prefill: {
          name: user?.name || orderInfo.name,
          email: user?.email || orderInfo.email,
          contact: orderInfo.contact,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            setIsCheckoutSubmit(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log(err);
      notifyError("Failed to process payment");
      setIsCheckoutSubmit(false);
    }
  };

  return {
    handleCouponCode,
    couponRef,
    handleShippingCost,
    discountAmount,
    total,
    shippingCost,
    discountPercentage,
    discountProductType,
    isCheckoutSubmit,
    setTotal,
    register,
    errors,
    cardError,
    submitHandler,
    handleSubmit,
    razorpayOrderId,
    setRazorpayOrderId,
    cartTotal,
    razorpayLoaded,
  };
};

export default useCheckoutSubmit;
