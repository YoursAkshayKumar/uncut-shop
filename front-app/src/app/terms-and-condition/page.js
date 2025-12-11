import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import SectionTop from "@components/terms-policy/section-top-bar";
import Footer from "@layout/footer";
import TermsArea from "@components/terms-policy/terms-area";

export const metadata = {
  title: "Terms & Conditions- Uncut Designs",
};

export default function Terms() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <SectionTop
        title="Terms and Conditions"
        subtitle="Please read these Terms and Conditions carefully before using our website and services. By accessing or using our Service, you agree to be bound by these Terms."
      />
      <TermsArea />
      <Footer />
    </Wrapper>
  );
}
