import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import SectionTop from "@components/terms-policy/section-top-bar";
import Footer from "@layout/footer";
import ReturnArea from "@components/terms-policy/return-area";

export const metadata = {
  title: "Return Policy - Uncut Designs",
};

export default function ReturnPolicy() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <SectionTop
        title="Return Policy"
        subtitle="We want you to be completely satisfied with your purchase. Learn about our return and refund policy, including eligibility, process, and timelines."
      />
      <ReturnArea />
      <Footer />
    </Wrapper>
  );
}

