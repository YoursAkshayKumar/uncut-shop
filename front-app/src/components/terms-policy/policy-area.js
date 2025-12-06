
const PolicyArea = () => {
  return (
    <section className="policy__area pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="policy__wrapper policy__translate p-relative z-index-1">
              <div className="policy__item mb-35">
                <h4 className="policy__meta">Effective date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                <p>
                  Uncut Designs knows that you care about how your personal information
                  is used and shared, and we take your privacy seriously.
                  Please read the following to learn more about our Privacy
                  Policy. This Privacy Policy also tells you
                  about your rights and choices with respect to your Personal
                  Information, and how you can reach us to update your contact
                  information or get answers to questions you may have about our
                  privacy practices.
                </p>
                <p>
                  By using or accessing our Services in any manner, you
                  acknowledge that you accept the practices and policies
                  outlined in this Privacy Policy, and you hereby consent that
                  Uncut Designs will collect, use, and share your information in the
                  following ways. Remember that your use of Services is at all
                  times subject to our Terms and Conditions, which incorporate this Privacy
                  Policy. Any terms we use in this Privacy Policy without
                  defining them have the definitions given to them in the Terms.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Information Collection</h3>
                <p>
                  You can visit and enjoy our Website without disclosing any
                  Personal Information about yourself. However, for the Service
                  to work properly we will need you to share with us certain
                  Personal Information.
                </p>

                <p>
                  For the purposes of this Privacy Policy, “Personal
                  Information” means information that identifies, relates to,
                  describes, is reasonably capable of being associated with, or
                  could be reasonably linked, directly or indirectly, with a
                  particular consumer, device or household. It does not include
                  de-identified or aggregate information, or public information
                  lawfully available from governmental records.
                </p>
              </div>

              <div className="policy__list mb-35">
                <h3 className="policy__title">Use of Personal Information</h3>
                <ul>
                  <li>To provide and maintain our e-commerce services;</li>
                  <li>To process and fulfill your orders;</li>
                  <li>To register you as a user and to provide the services you require;</li>
                  <li>To communicate with you about your orders, products, and services;</li>
                  <li>To send you marketing communications (with your consent);</li>
                  <li>To detect, prevent and address technical issues and fraud;</li>
                  <li>To notify you about changes to our Service;</li>
                  <li>To provide customer care and support;</li>
                  <li>To improve our website and user experience;</li>
                </ul>
              </div>
              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Data Security</h3>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Cookies and Tracking Technologies</h3>
                <p>
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Third-Party Services</h3>
                <p>
                  We may employ third-party companies and individuals to facilitate our Service, provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used. These third parties have access to your Personal Information only to perform these tasks on our behalf.
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

export default PolicyArea;
