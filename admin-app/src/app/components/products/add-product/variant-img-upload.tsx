import React, { useEffect, useState } from "react";
import { Drug } from "@/svg";
import Loading from "../../common/loading";
import { useUploadImageMutation } from "@/redux/cloudinary/cloudinaryApi";
import UploadImage from "./upload-image";
import DefaultUploadImg from "./default-upload-img";
import { SmClose } from "@/svg";

type IPropType = {
  index: number;
  relatedImages: string[];
  setImageURLs: React.Dispatch<React.SetStateAction<string[]>>;
  isSubmitted: boolean;
};

const VariantImgUpload = ({
  index,
  isSubmitted,
  setImageURLs,
  relatedImages,
}: IPropType) => {
  const [uploadImage, { data: uploadData, isError, isLoading, error }] =
    useUploadImageMutation();
  const [inputType, setInputType] = useState<"image" | "videoFile" | "videoUrl">("image");
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Check if current item is a video URL
  useEffect(() => {
    const currentUrl = relatedImages[index] || "";
    if (currentUrl && (currentUrl.includes('youtube.com') || currentUrl.includes('youtu.be') || currentUrl.includes('vimeo.com') || currentUrl.endsWith('.mp4') || currentUrl.endsWith('.webm') || currentUrl.endsWith('.mov'))) {
      setInputType("videoUrl");
      setVideoUrl(currentUrl);
    } else if (currentUrl) {
      setInputType("image");
    }
  }, [relatedImages, index]);

  // handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      uploadImage(formData);
    }
  };

  // handle video file upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      const formData = new FormData();
      formData.append("image", file); // Using same endpoint
      uploadImage(formData);
    }
  };

  // handle video URL change
  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    setImageURLs((prev) => {
      const updatedFormData = [...prev];
      updatedFormData[index] = url;
      return updatedFormData;
    });
  };

  useEffect(() => {
    if (uploadData && !isError) {
      setImageURLs((prev) => {
        const updatedFormData = [...prev];
        updatedFormData[index] = uploadData.data.url;
        return updatedFormData;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, uploadData, isError]);

  const getVideoThumbnail = (url: string) => {
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

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || 
           url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
  };

  const currentUrl = relatedImages[index] || "";
  const isVideo = isVideoUrl(currentUrl);
  const videoThumbnail = getVideoThumbnail(currentUrl);

  return (
    <>
      {/* Toggle between Image, Video File, and Video URL */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setInputType("image");
            setVideoUrl("");
            setImageURLs((prev) => {
              const updated = [...prev];
              updated[index] = "";
              return updated;
            });
          }}
          className={`px-3 py-1 rounded-md text-xs ${
            inputType === "image"
              ? "bg-theme text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Image
        </button>
        <button
          type="button"
          onClick={() => {
            setInputType("videoFile");
            setVideoUrl("");
            setImageURLs((prev) => {
              const updated = [...prev];
              updated[index] = "";
              return updated;
            });
          }}
          className={`px-3 py-1 rounded-md text-xs ${
            inputType === "videoFile"
              ? "bg-theme text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Video File
        </button>
        <button
          type="button"
          onClick={() => {
            setInputType("videoUrl");
            setVideoUrl(currentUrl);
          }}
          className={`px-3 py-1 rounded-md text-xs ${
            inputType === "videoUrl"
              ? "bg-theme text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Video URL
        </button>
      </div>

      {/* Image Upload */}
      {inputType === "image" && (
        <>
          <div className="mb-5">
            <p className="mb-0 text-base text-black">Upload your image here</p>
            <input
              onChange={handleImageUpload}
              type="file"
              name="image"
              accept="image/*"
              id={`product_image_${index + 1}`}
              className="hidden"
            />
            <label
              htmlFor={`product_image_${index + 1}`}
              className="border-2 border-gray6 dark:border-gray-600 border-dashed rounded-md cursor-pointer  flex items-center justify-center h-[44px] leading-[44px] hover:bg-slate-100 transition-all linear ease"
            >
              <span className="mx-auto flex justify-center">
                <Drug />
              </span>
            </label>
          </div>

          {uploadData && !isError ? (
            <div>
              <p className="text-base text-black mb-3">Image</p>
              <span className="mx-auto">
                {isLoading ? (
                  <Loading loading={isLoading} spinner="scale" />
                ) : (
                  <UploadImage
                    file={{
                      url: uploadData ? uploadData.data.url : relatedImages[index],
                      id: uploadData?.data.id,
                    }}
                    setFormData={setImageURLs}
                  />
                )}
              </span>
            </div>
          ) : (
            <div className="mb-5">
              <p className="mb-0 text-base text-black">Image</p>
              <DefaultUploadImg
                img={relatedImages[index]}
                isLoading={isLoading}
                wh={40}
              />
            </div>
          )}
        </>
      )}

      {/* Video File Upload */}
      {inputType === "videoFile" && (
        <>
          <div className="mb-5">
            <p className="mb-0 text-base text-black">Upload your video here</p>
            <input
              onChange={handleVideoFileUpload}
              type="file"
              name="video"
              accept="video/*"
              id={`product_video_${index + 1}`}
              className="hidden"
            />
            <label
              htmlFor={`product_video_${index + 1}`}
              className="border-2 border-gray6 dark:border-gray-600 border-dashed rounded-md cursor-pointer  flex items-center justify-center h-[44px] leading-[44px] hover:bg-slate-100 transition-all linear ease"
            >
              <span className="mx-auto flex justify-center">
                <Drug />
              </span>
            </label>
          </div>

          {uploadData && !isError ? (
            <div>
              <p className="text-base text-black mb-3">Video</p>
              <span className="mx-auto">
                {isLoading ? (
                  <Loading loading={isLoading} spinner="scale" />
                ) : (
                  <div className="relative">
                    <div className="border rounded-md border-gray6 p-2">
                      <p className="text-sm text-gray-600">Video uploaded: {uploadData.data.url}</p>
                      <button
                        onClick={() => {
                          setImageURLs((prev) => {
                            const updated = [...prev];
                            updated[index] = "";
                            return updated;
                          });
                        }}
                        type="button"
                        className="absolute -top-2 -right-2 text-red-500 bg-white rounded-full p-1 focus:outline-none shadow-md"
                      >
                        <SmClose />
                      </button>
                    </div>
                  </div>
                )}
              </span>
            </div>
          ) : currentUrl && !isVideoUrl(currentUrl) ? (
            <div className="mb-5">
              <p className="mb-0 text-base text-black">Video</p>
              <div className="border rounded-md border-gray6 p-2">
                <p className="text-sm text-gray-600">Video: {currentUrl}</p>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* Video URL Input */}
      {inputType === "videoUrl" && (
        <>
          <div className="mb-5">
            <p className="mb-0 text-base text-black">Enter video URL</p>
            <input
              type="url"
              value={videoUrl}
              onChange={handleVideoUrlChange}
              placeholder="Enter video URL (YouTube, Vimeo, or direct video link)"
              className="w-full border border-gray-300 rounded-md p-2 text-sm mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports YouTube, Vimeo, or direct video URLs
            </p>
          </div>

          {currentUrl && (
            <div className="mb-5">
              <p className="mb-0 text-base text-black">Video</p>
              <div className="relative border border-gray-300 rounded-md p-2 mt-2">
                {videoThumbnail ? (
                  <div className="relative">
                    <img
                      src={videoThumbnail}
                      alt="Video thumbnail"
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-2">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded p-4 text-center">
                    <p className="text-sm text-gray-600">Video URL: {currentUrl}</p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setImageURLs((prev) => {
                      const updated = [...prev];
                      updated[index] = "";
                      return updated;
                    });
                    setVideoUrl("");
                  }}
                  type="button"
                  className="absolute -top-2 -right-2 text-red-500 bg-white rounded-full p-1 focus:outline-none shadow-md"
                >
                  <SmClose />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default VariantImgUpload;
