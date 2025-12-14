import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
// internal
import { HeartTwo, CartTwo } from "@svg/index";
import { SocialShare } from "@components/social";
import ProductDetailsPrice from "./product-details-price";
import ProductQuantity from "./product-quantity";
import ProductDetailsCategories from "./product-details-categories";
import ProductDetailsTags from "./product-details-tags";
import ProductVideoPlayer from "./product-video-player";
import { add_cart_product } from "src/redux/features/cartSlice";
import { add_to_wishlist } from "src/redux/features/wishlist-slice";

const ProductDetailsArea = ({ product }) => {
  const {
    _id,
    image,
    relatedImages,
    video,
    title,
    quantity,
    originalPrice,
    discount,
    tags,
    sku,
  } = product || {};
  
  // Check if URL is a video URL
  const isVideoUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || 
           url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
  };

  // Get video thumbnail URL
  const getVideoThumbnail = (url) => {
    if (!url) return null;
    // YouTube thumbnail
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    }
    // Vimeo thumbnail (would need API call, using placeholder for now)
    if (url.includes('vimeo.com')) {
      return null;
    }
    return null;
  };

  // Combine video and images into a single media array
  const mediaItems = useMemo(() => {
    const items = [];
    // Add video as first item if it exists
    if (video && video.trim() !== '') {
      items.push({ type: 'video', url: video, thumbnail: getVideoThumbnail(video) });
    }
    // Add main image
    if (image && image.trim() !== '') {
      items.push({ type: 'image', url: image });
    }
    // Add related images (filter out empty strings and detect video URLs)
    if (relatedImages && relatedImages.length > 0) {
      relatedImages.forEach(img => {
        if (img && img.trim() !== '') {
          // Check if it's a video URL
          if (isVideoUrl(img)) {
            items.push({ type: 'video', url: img, thumbnail: getVideoThumbnail(img) });
          } else {
            items.push({ type: 'image', url: img });
          }
        }
      });
    }
    return items;
  }, [video, image, relatedImages]);

  const [activeMediaUrl, setActiveMediaUrl] = useState(null);
  const [activeMediaType, setActiveMediaType] = useState('image');

  useEffect(() => {
    // Always show main image first, even if video exists
    if (image) {
      setActiveMediaUrl(image);
      setActiveMediaType('image');
    } else if (mediaItems.length > 0) {
      // Fallback to first item if main image not available
      const firstItem = mediaItems[0];
      setActiveMediaUrl(firstItem.url);
      setActiveMediaType(firstItem.type);
    }
  }, [image, mediaItems]);

  const handleMediaClick = (item) => {
    setActiveMediaUrl(item.url);
    setActiveMediaType(item.type);
  };

  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const isWishlistAdded = wishlist.some((item) => item._id === _id);

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };

  // handle add wishlist
  const handleAddWishlist = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  return (
    <section className="product__details-area pb-115">
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-6">
            <div className="product__details-thumb-tab mr-70">
              <div className="product__details-thumb-content w-img">
                <div>
                  {activeMediaType === 'video' && activeMediaUrl ? (
                    <ProductVideoPlayer videoUrl={activeMediaUrl} />
                  ) : activeMediaType === 'image' && activeMediaUrl ? (
                    <Image
                      src={activeMediaUrl}
                      alt="details img"
                      width={960}
                      height={1125}
                      style={{
                        width: "100%",
                        maxHeight: "575px",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                </div>
              </div>
              {mediaItems && mediaItems.length > 0 && (
                <div className="product__details-thumb-nav tp-tab">
                  <nav>
                    <div className="d-flex justify-content-center flex-wrap">
                      {mediaItems
                        .filter(item => item && item.url && item.url.trim() !== '')
                        .map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleMediaClick(item)}
                          className={activeMediaUrl === item.url ? "nav-link active" : "nav-link"}
                          style={{ position: 'relative' }}
                        >
                          {item.type === 'video' ? (
                            <>
                              {item.thumbnail ? (
                                <Image 
                                  src={item.thumbnail} 
                                  alt="video thumbnail" 
                                  width={110} 
                                  height={110}
                                  style={{ objectFit: 'cover' }}
                                />
                              ) : (
                                <div 
                                  style={{
                                    width: '110px',
                                    height: '110px',
                                    backgroundColor: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff'
                                  }}
                                >
                                  <svg
                                    style={{ width: '40px', height: '40px' }}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                </div>
                              )}
                              <div 
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  backgroundColor: 'rgba(0,0,0,0.6)',
                                  borderRadius: '50%',
                                  width: '30px',
                                  height: '30px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  pointerEvents: 'none'
                                }}
                              >
                                <svg
                                  style={{ width: '16px', height: '16px', color: '#fff' }}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </div>
                            </>
                          ) : (
                            item.url && item.url.trim() !== '' && !isVideoUrl(item.url) ? (
                              <Image src={item.url} alt="image" width={110} height={110} />
                            ) : item.url && item.url.trim() !== '' && isVideoUrl(item.url) ? (
                              // Handle video URL that was incorrectly marked as image
                              <>
                                {getVideoThumbnail(item.url) ? (
                                  <Image 
                                    src={getVideoThumbnail(item.url)} 
                                    alt="video thumbnail" 
                                    width={110} 
                                    height={110}
                                    style={{ objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div 
                                    style={{
                                      width: '110px',
                                      height: '110px',
                                      backgroundColor: '#000',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#fff'
                                    }}
                                  >
                                    <svg
                                      style={{ width: '40px', height: '40px' }}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                  </div>
                                )}
                                <div 
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pointerEvents: 'none'
                                  }}
                                >
                                  <svg
                                    style={{ width: '16px', height: '16px', color: '#fff' }}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                </div>
                              </>
                            ) : null
                          )}
                        </button>
                      ))}
                    </div>
                  </nav>
                </div>
              )}
            </div>
          </div>
          <div className="col-xl-5 col-lg-6">
            <div className="product__details-wrapper">
              <div className="product__details-stock">
                <span>{quantity} In Stock</span>
              </div>
              <h3 className="product__details-title">{title}</h3>

              <p className="mt-20">
                Shop Harry.com for every day low prices. Free shipping on orders
                ₹35+ or Pickup In-store and get
              </p>

              {/* Product Details Price */}
              <ProductDetailsPrice price={originalPrice} discount={discount} />
              {/* Product Details Price */}

              {/* quantity */}
              <ProductQuantity />
              {/* quantity */}

              <div className="product__details-action d-flex flex-wrap align-items-center">
                <button
                  onClick={() => handleAddProduct(product)}
                  type="button"
                  className="product-add-cart-btn product-add-cart-btn-3"
                >
                  <CartTwo />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddWishlist(product)}
                  type="button"
                  className={`product-action-btn ${
                    isWishlistAdded ? "active" : ""
                  }`}
                >
                  <HeartTwo />
                  <span className="product-action-tooltip">
                    Add To Wishlist
                  </span>
                </button>
              </div>
              <div className="product__details-sku product__details-more">
                <p>SKU:</p>
                <span>{sku}</span>
              </div>
              {/* ProductDetailsCategories */}
              <ProductDetailsCategories name={product?.category?.name} />
              {/* ProductDetailsCategories */}

              {/* Tags */}
              <ProductDetailsTags tag={tags} />
              {/* Tags */}

              <div className="product__details-share">
                <span>Share:</span>
                <SocialShare />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsArea;
