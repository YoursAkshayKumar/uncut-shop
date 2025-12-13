import React from "react";
import Image from "next/image";
// internal
import SocialLinks from "@components/social";
import icon_1 from "@assets/img/contact/icon/contact-icon-1.png";
import icon_2 from "@assets/img/contact/icon/contact-icon-3.png";
import icon_3 from "@assets/img/contact/icon/contact-icon-2.png";

// single item
function SingleItem({ icon, title, content }) {
  return (
    <div className="col-xl-4 col-lg-4 col-md-6">
      <div className="contact__item text-center mb-30 transition-3 white-bg">
        <div className="contact__icon">
          <Image src={icon} alt="icon" />
        </div>
        <div className="contact__content">
          <span className="contact-item-subtitle">{title}</span>
          {content}
        </div>
      </div>
    </div>
  );
}

const BoxItems = () => {
  return (
    <div
      className={`contact__item-area contact__translate-2`}
    >
      <div className="container">
        <div className="row">
          <SingleItem
            icon={icon_1}
            title="Contact"
            content={
              <>
                <p>
                  <a href="mailto:info@uncutsshop.com">info@uncutsshop.com</a>
                </p>
                <p>
                  <a href="tel:+918445432575">+91-8445432575</a>
                </p>
              </>
            }
          />
          <SingleItem
            icon={icon_2}
            title="Location"
            content={
              <>
                <p>
                  <a
                    rel="noreferrer"
                    href="https://www.google.com/maps"
                    target="_blank"
                  >
                    Online Store - Worldwide Shipping
                  </a>
                </p>
              </>
            }
          />
          <SingleItem
            icon={icon_3}
            title="Social Media"
            content={
              <>
                {" "}
                <p>Follow us on social media</p>
                <div className="contact__social">
                  <SocialLinks />
                </div>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BoxItems;
