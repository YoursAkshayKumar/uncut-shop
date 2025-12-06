const ReturnArea = () => {
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
                  At Uncut Designs, we want you to be completely satisfied with your purchase. 
                  If you are not satisfied with your order, we offer a straightforward return and 
                  refund policy. Please read the following information carefully to understand our 
                  return process.
                </p>
                <p>
                  By purchasing from Uncut Designs, you agree to the terms outlined in this Return Policy. 
                  If you have any questions about returns or refunds, please contact our customer service team.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Return Eligibility</h3>
                <p>
                  Items must be returned within 30 days of the delivery date to be eligible for a refund or exchange. 
                  The item must be unused, unworn, and in its original condition with all tags attached. 
                  Items must be in their original packaging when possible.
                </p>
                <p>
                  For hygiene reasons, certain items such as undergarments, swimwear, and intimate apparel 
                  may not be eligible for return unless they are defective or incorrect. Please check the 
                  product description for specific return restrictions.
                </p>
              </div>

              <div className="policy__list mb-35">
                <h3 className="policy__title">Items Eligible for Return:</h3>
                <ul>
                  <li>Items in original, unused condition with tags attached</li>
                  <li>Items with original packaging and accessories</li>
                  <li>Items returned within 30 days of delivery</li>
                  <li>Defective or damaged items</li>
                  <li>Items that differ from the product description</li>
                </ul>
              </div>

              <div className="policy__list mb-35">
                <h3 className="policy__title">Items NOT Eligible for Return:</h3>
                <ul>
                  <li>Items without tags or original packaging</li>
                  <li>Items that have been worn, washed, or damaged by the customer</li>
                  <li>Items returned after 30 days from delivery</li>
                  <li>Customized or personalized items (unless defective)</li>
                  <li>Items purchased during final sale or clearance (unless defective)</li>
                  <li>Underwear, swimwear, and intimate apparel (unless defective or incorrect)</li>
                </ul>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">How to Return an Item</h3>
                <p>
                  To initiate a return, please follow these steps:
                </p>
                <ol style={{ paddingLeft: '20px', marginTop: '15px' }}>
                  <li style={{ marginBottom: '10px' }}>
                    Contact our customer service team at support@uncutdesigns.com or through your account 
                    dashboard to request a return authorization.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    You will receive a Return Merchandise Authorization (RMA) number and return instructions.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Package the item securely in its original packaging (if available) with all tags attached.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Include the RMA number on the return package.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Ship the item back to the address provided in your return instructions.
                  </li>
                </ol>
                <p style={{ marginTop: '15px' }}>
                  We recommend using a trackable shipping method and retaining your shipping receipt until 
                  your return is processed.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Return Shipping Costs</h3>
                <p>
                  If the return is due to our error (wrong item, defective item, or item not as described), 
                  we will cover the return shipping costs. For returns due to customer preference (size, 
                  color, style), the customer is responsible for return shipping costs unless otherwise stated.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Refunds</h3>
                <p>
                  Once we receive and inspect your returned item, we will process your refund. Refunds will 
                  be issued to the original payment method used for the purchase. Please allow 5-10 business 
                  days for the refund to appear in your account after we process it.
                </p>
                <p>
                  Shipping charges are non-refundable unless the return is due to our error. If you received 
                  free shipping on your original order, the cost of standard shipping will be deducted from 
                  your refund.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Exchanges</h3>
                <p>
                  We currently do not offer direct exchanges. If you need a different size or color, please 
                  return the original item for a refund and place a new order for the item you want. 
                  This ensures you receive the correct item quickly.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Damaged or Defective Items</h3>
                <p>
                  If you receive a damaged or defective item, please contact us immediately with photos of 
                  the damage or defect. We will arrange for a replacement or full refund, including return 
                  shipping costs, at no charge to you.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Late or Missing Refunds</h3>
                <p>
                  If you haven't received your refund within 10 business days after we've processed it, 
                  please check with your bank or credit card company first. If the issue persists, 
                  contact us at support@uncutdesigns.com and we will investigate.
                </p>
              </div>

              <div className="policy__contact">
                <h3 className="policy__title policy__title-2">Contact us</h3>
                <p>For questions about returns, refunds, or exchanges, please contact us:</p>

                <ul>
                  <li>
                    Email:{" "}
                    <span>
                      <a href="mailto:support@uncutdesigns.com">support@uncutdesigns.com</a>
                    </span>
                  </li>
                  <li>
                    Please include your order number and RMA number (if applicable) in your inquiry.
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

export default ReturnArea;

