// internal
import TextArea from "./text-area";
import Services from "./services";
import AboutGallery from "./about-gallery";
import AboutFaqs from "./about-faqs";
import BreadcrumbTwo from "@components/common/breadcrumb/breadcrumb-2";

const About = () => {
  return (
    <>
      <BreadcrumbTwo
        subtitle="About us"
        title={
          <>
            Welcome to <br /> Uncuts Shop
          </>
        }
      />
      <TextArea />
      <Services />
      <AboutGallery />
      <AboutFaqs />
    </>
  );
};

export default About;
