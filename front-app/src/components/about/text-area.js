

const TextArea = () => {
  return (
    <section className="about__text pt-115 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-lg-4">
            <div
              className="about__text-wrapper wow fadeInUp"
              data-wow-delay=".3s"
              data-wow-duration="1s"
            >
              <h3 className="about__text-title">
                Your trusted destination <br /> for quality products.
              </h3>
            </div>
          </div>
          <div className="col-xl-8 col-lg-8">
            <div
              className="about__text wow fadeInUp"
              data-wow-delay=".6s"
              data-wow-duration="1s"
            >
              <p>
                Welcome to Uncuts Shop, your premier online destination for quality products. 
                We are committed to providing you with an exceptional shopping experience, 
                offering a carefully curated selection of products that meet the highest standards 
                of quality and value. Our mission is to make shopping convenient, enjoyable, and 
                accessible for everyone.
              </p>

              <p>
                At Uncuts Shop, we believe in building lasting relationships with our customers 
                through transparency, excellent customer service, and a commitment to delivering 
                products that exceed expectations. Whether you're looking for everyday essentials 
                or something special, we're here to help you find exactly what you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextArea;
