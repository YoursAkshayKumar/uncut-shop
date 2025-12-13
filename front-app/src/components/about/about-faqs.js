'use client';
import React from "react";
// internal
import { Play } from "@svg/index";
import faq_bg from "@assets/img/faq/faq-img.jpg";
import SingleFaq from "@components/faq/single-faq";
import VideoModal from "@components/common/modals/modal-video";
import useModal from "@hooks/use-modal";

const faq_items = [
  {
    id: "about-one",
    title: "What is your return policy?",
    show: true,
    desc: "We offer a hassle-free return policy. If you're not satisfied with your purchase, you can return items within 30 days of delivery. Items must be in their original condition with tags attached. Please contact our customer service team to initiate a return.",
    parent: "faqaccordion",
  },
  {
    id: "about-two",
    title: "How long does shipping take?",
    desc: "Standard shipping typically takes 5-7 business days. We also offer express shipping options (2-3 business days) for faster delivery. Shipping times may vary based on your location and product availability. You'll receive a tracking number once your order ships.",
    parent: "faqaccordion",
  },
  {
    id: "about-three",
    title: "Do you offer customer support?",
    desc: "Yes! Our dedicated customer support team is available 24/7 to assist you with any questions or concerns. You can reach us via email, live chat, or phone. We're committed to providing you with the best shopping experience possible.",
    parent: "faqaccordion",
  },
];

const AboutFaqs = () => {
  const { isVideoOpen, setIsVideoOpen } = useModal();
  return (
    <React.Fragment>
      <section className="faq__area p-relative">
        <div
          className="faq__video"
          style={{ backgroundImage: `url(${faq_bg.src})` }}
        >
          <div className="faq__video-btn">
            <a
              style={{ cursor: "pointer" }}
              onClick={() => setIsVideoOpen(true)}
              className="tp-pulse-border popup-video"
            >
              <Play />
            </a>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row justify-content-end">
            <div className="col-xxl-7 col-xl-7 col-lg-7">
              <div className="faq__wrapper-2 faq__gradient-border faq__style-2 tp-accordion pl-160">
                <div className="faq__title-wrapper">
                  <span className="faq__title-pre">
                   Have questions? We're here to help
                  </span>
                  <h3 className="faq__title">
                    Frequently Asked Questions
                  </h3>
                </div>
                <div className="accordion" id="faqaccordion">
                  {faq_items.map((item) => (
                    <SingleFaq key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* video modal start */}
      <VideoModal
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={"FWrz3bT-YoE"}
      />
      {/* video modal end */}
    </React.Fragment>
  );
};

export default AboutFaqs;
