'use client';
import { useState } from "react";
// internal
import bg from "@assets/img/cta/13/cta-bg-1.jpg";
import { useAddSubscriptionMutation } from "src/redux/features/subscriptionApi";

const ShopCta = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addSubscription] = useAddSubscriptionMutation();

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      setMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await addSubscription({ email }).unwrap();
      if (result.success) {
        setMessage(result.message || "Successfully subscribed!");
        setEmail("");
      }
    } catch (error) {
      setMessage(
        error?.data?.message || 
        error?.message || 
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="cta__area pt-50 pb-50 p-relative include-bg jarallax"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="container">
        <div className="cta__inner-13 white-bg">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="cta__content-13">
                <h3 className="cta__title-13">
                  Subscribe for <br />
                  Latest Trends & Offers
                </h3>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="cta__form-13">
                <form onSubmit={handleSubmit}>
                  <div className="cta__input-13">
                    <input 
                      type="email" 
                      placeholder="Enter Your Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    <button 
                      type="submit" 
                      className="tp-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </button>
                  </div>
                  {message && (
                    <div 
                      className={`mt-2 text-sm ${
                        message.includes("Successfully") || message.includes("already subscribed")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopCta;
