import Link from "next/link";

const TermsArea = () => {
  return (
    <section className="policy__area pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="policy__wrapper policy__translate p-relative z-index-1">
              <div className="policy__item mb-35">
                <h4 className="policy__meta">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </h4>
                <p>
                  These are the Terms and Conditions governing the use of this
                  Service and the agreement that operates between You and Uncut Designs.
                  These Terms and Conditions set out the rights and
                  obligations of all users regarding the use of the Service. Your
                  access to and use of the Service is conditioned on Your
                  acceptance of and compliance with these Terms and Conditions.
                  These Terms and Conditions apply to all visitors, users and
                  others who access or use the Service.
                </p>
                <p>
                  By using or accessing our Services in any manner, you
                  acknowledge that you accept these Terms and Conditions. If you disagree
                  with any part of these terms, then you may not access the Service.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Definitions</h3>
                <p>
                  The words of which the initial letter is capitalized have
                  meanings defined under the following conditions. The following
                  definitions shall have the same meaning regardless of whether
                  they appear in singular or in plural.
                </p>
              </div>

              <div className="policy__list mb-35">
                <h3 className="policy__title">
                  Key Definitions:
                </h3>
                <ul>
                  <li>
                    <strong>Company</strong> (referred to as either &quot;the
                    Company&quot;, &quot;We&quot;, &quot;Us&quot; or
                    &quot;Our&quot; in this Agreement) refers to Uncut Designs.
                  </li>
                  <li>
                    <strong>Device</strong> means any device that can access the
                    Service such as a computer, a cellphone or a digital tablet.
                  </li>
                  <li>
                    <strong>Service</strong> refers to our e-commerce website and services.
                  </li>
                  <li>
                    <strong>Website</strong> refers to Uncut Designs, accessible from{" "}
                    <Link
                      href="/"
                      rel="external nofollow noopener"
                      target="_blank"
                    >
                      our website
                    </Link>
                  </li>
                  <li>
                    <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service.
                  </li>
                </ul>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Placing Orders</h3>
                <p>
                  When you place an order through our Service, you are making an offer to purchase products. We reserve the right to accept or reject your order for any reason, including product availability, errors in pricing or product information, or issues identified by our fraud prevention measures.
                </p>
                <p>
                  All prices are in the currency displayed on the website and are subject to change without notice. We reserve the right to correct any errors in pricing, even after an order has been placed.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Payment Terms</h3>
                <p>
                  Payment must be received by us before we ship your order. We accept various payment methods as displayed on our checkout page. By providing payment information, you represent and warrant that you are authorized to use the payment method.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Product Information</h3>
                <p>
                  We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, colors, or other content on the Service is accurate, complete, reliable, current, or error-free. If a product offered by us is not as described, your sole remedy is to return it in unused condition.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Intellectual Property</h3>
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Uncut Designs and its licensors. The Service is protected by copyright, trademark, and other laws.
                </p>
              </div>
              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Limitation of Liability</h3>
                <p>
                  In no event shall Uncut Designs, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Changes to Terms</h3>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </div>

              <div className="policy__contact">
                <h3 className="policy__title policy__title-2">Contact us</h3>
                <p>You may contact us at any time via:</p>

                <ul>
                  <li>
                    Email:{" "}
                    <span>
                      <a href="mailto:support@uncutdesigns.com">support@uncutdesigns.com</a>
                    </span>
                  </li>
                </ul>

                <div className="policy__address">
                  <p>
                    <a
                      rel="noreferrer"
                      href="#"
                      target="_blank"
                    >
                      Uncut Designs <br /> Please contact us for our business address
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsArea;
