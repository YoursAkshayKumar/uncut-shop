'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper";
// internal
import { RightArrow } from "@svg/index";
import { useGetActiveSlidersQuery } from "src/redux/features/sliderApi";
import slider_img_1 from "@assets/img/slider/13/slider-1.png";

const HeroBanner = () => {
  const [loop,setLoop] = useState(false);
  const { data: slidersData, isLoading, isError } = useGetActiveSlidersQuery();
  
  useEffect(() => setLoop(true),[]);
  
  // Default fallback data
  const defaultSlider = {
    _id: 'default',
    title: 'Clothes To Fit Your Life.',
    preTitle: 'Your Style. Your Story.',
    backgroundImage: slider_img_1.src || slider_img_1,
    productImage: slider_img_1.src || slider_img_1,
    buttonText: 'Explore The Collection',
    buttonLink: '/shop',
  };
  
  // Use API data if available, otherwise use default
  const slider_data = slidersData?.result && slidersData.result.length > 0
    ? slidersData.result.map((item) => ({
        id: item._id,
        preTitle: item.preTitle && item.preTitle.trim() !== "" ? item.preTitle : null,
        title: item.title && item.title.trim() !== "" ? item.title : null,
        productImage: item.productImage && item.productImage.trim() !== "" ? item.productImage : null,
        bgImageDesktop: item.backgroundImage || slider_img_1,
        bgImageTablet: item.backgroundImageTablet && item.backgroundImageTablet.trim() !== "" 
          ? item.backgroundImageTablet 
          : (item.backgroundImage || slider_img_1),
        bgImageMobile: item.backgroundImageMobile && item.backgroundImageMobile.trim() !== "" 
          ? item.backgroundImageMobile 
          : (item.backgroundImageTablet && item.backgroundImageTablet.trim() !== "" 
            ? item.backgroundImageTablet 
            : (item.backgroundImage || slider_img_1)),
        buttonText: item.buttonText && item.buttonText.trim() !== "" ? item.buttonText : null,
        buttonLink: item.buttonLink && item.buttonLink.trim() !== "" ? item.buttonLink : null,
      }))
    : [{
        id: defaultSlider._id,
        preTitle: defaultSlider.preTitle,
        title: defaultSlider.title,
        productImage: defaultSlider.productImage,
        bgImageDesktop: defaultSlider.backgroundImage,
        bgImageTablet: defaultSlider.backgroundImage,
        bgImageMobile: defaultSlider.backgroundImage,
        buttonText: defaultSlider.buttonText,
        buttonLink: defaultSlider.buttonLink,
      }];
  return (
    <>
      <section className="slider__area slider__area-13">
        <Swiper
          className="slider__active slider__active-13 swiper-container"
          slidesPerView={1}
          spaceBetween={0}
          effect="fade"
          loop={loop}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: '.slider__pagination-13',
            bulletClass: 'slider__pagination-bullet-13',
            bulletActiveClass: 'slider__pagination-bullet-active-13',
          }}
          navigation={{
            nextEl: '.slider__button-next-13',
            prevEl: '.slider__button-prev-13',
          }}
          modules={[EffectFade, Navigation, Pagination, Autoplay]}
        >
          {slider_data.map((item) => {
            // Get the image URLs - handle both Next.js Image object and string paths
            const getImageUrl = (img) => {
              if (typeof img === 'string') return img;
              return (img?.src || img?.default?.src || '/assets/img/slider/13/slider-1.png');
            };
            
            const bgImageDesktopUrl = getImageUrl(item.bgImageDesktop);
            const bgImageTabletUrl = getImageUrl(item.bgImageTablet);
            const bgImageMobileUrl = getImageUrl(item.bgImageMobile);
            
            // Format preTitle with line breaks if it exists
            const formattedPreTitle = item.preTitle ? (
              <>
                {item.preTitle.split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </>
            ) : null;
            
            // Format title with line breaks if it exists
            const formattedTitle = item.title ? (
              <>
                {item.title.split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </>
            ) : null;
            
            return (
            <SwiperSlide
              key={item.id}
              className="slider__item-13 slider__height-13 d-flex align-items-center"
              style={{
                '--bg-image-desktop': `url(${bgImageDesktopUrl})`,
                '--bg-image-tablet': `url(${bgImageTabletUrl})`,
                '--bg-image-mobile': `url(${bgImageMobileUrl})`,
              }}
            >
              <div className="slider__item-13-overlay"></div>
              <div className="container">
                <div className="row align-items-center">
                  <div className={item.productImage ? "col-xl-6 col-lg-6 col-md-6" : "col-xl-12 col-lg-12 col-md-12"}>
                    <div className="slider__content-13">
                      {formattedPreTitle && (
                        <span className="slider__title-pre-13">
                          {formattedPreTitle}
                        </span>
                      )}
                      {formattedTitle && (
                        <h3 className="slider__title-13">{formattedTitle}</h3>
                      )}

                      {item.buttonText && item.buttonLink && (
                        <div className="slider__btn-13">
                          <Link href={item.buttonLink} className="tp-btn-border tp-btn-border-13">
                            {item.buttonText}
                            <span>
                              <RightArrow />
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  {item.productImage && (
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <div className="slider__thumb-13 text-end">
                        <div className="slider__thumb-13-bg-circle"></div>
                        <Image
                          src={item.productImage}
                          alt="slider img"
                          width={600}
                          height={600}
                          priority
                          className="slider__thumb-13-img"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
            );
          })}
        </Swiper>
        
        {/* Navigation Arrows */}
        <div className="slider__navigation-13">
          <button className="slider__button-prev-13" aria-label="Previous slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="slider__button-next-13" aria-label="Next slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {/* Pagination */}
        <div className="slider__pagination-13"></div>
      </section>
    </>
  );
};

export default HeroBanner;
