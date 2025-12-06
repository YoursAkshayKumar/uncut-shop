import React from "react";

const PaymentCardElement = ({ cardError, cart_products, isCheckoutSubmit, razorpayLoaded }) => {
  return (
    <div className="my-2">
      <div className="payment-info">
        <p>You will be redirected to Razorpay secure payment gateway to complete your payment.</p>
      </div>
      <div className="order-button-payment mt-25">
        <button
          type="submit"
          className="tp-btn"
          disabled={!razorpayLoaded || cart_products.length === 0 || isCheckoutSubmit}
        >
          {isCheckoutSubmit ? "Processing..." : "Place order"}
        </button>
      </div>
      {cardError && (
        <p className="mt-15" style={{ color: "red" }}>
          {cardError}
        </p>
      )}
    </div>
  );
};

export default PaymentCardElement;
