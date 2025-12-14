import React, { useEffect, useState } from "react";
import Loading from "../../common/loading";
import useUploadImage from "@/hooks/useUploadImg";
import { SmClose } from "@/svg";

type IPropType = {
  videoUrl: string;
  setVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  isSubmitted: boolean;
  default_video?: string;
};

const ProductVideoUpload = ({
  videoUrl,
  setVideoUrl,
  isSubmitted,
  default_video,
}: IPropType) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const [inputType, setInputType] = useState<"url" | "upload">("url");
  const { handleImageUpload, uploadData, isError, isLoading } = useUploadImage();

  useEffect(() => {
    if (uploadData && !isError && inputType === "upload") {
      setVideoUrl(uploadData.data.url);
    }
  }, [uploadData, isError, setVideoUrl, inputType]);

  useEffect(() => {
    if (default_video && initialLoad) {
      setVideoUrl(default_video);
      setInitialLoad(false);
    }
  }, [default_video, initialLoad, setVideoUrl]);

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      const formData = new FormData();
      formData.append("image", file); // Using same endpoint, backend should handle video
      handleImageUpload(e);
    }
  };

  const handleDeleteVideo = () => {
    setVideoUrl("");
  };

  const getVideoThumbnail = (url: string) => {
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

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <p className="text-base text-black mb-4">Product Video</p>
      
      {/* Toggle between URL and Upload */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setInputType("url");
            setVideoUrl("");
          }}
          className={`px-4 py-2 rounded-md text-sm ${
            inputType === "url"
              ? "bg-theme text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Video URL
        </button>
        <button
          type="button"
          onClick={() => {
            setInputType("upload");
            setVideoUrl("");
          }}
          className={`px-4 py-2 rounded-md text-sm ${
            inputType === "upload"
              ? "bg-theme text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Upload Video
        </button>
      </div>

      {/* URL Input */}
      {inputType === "url" && (
        <div className="mb-4">
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL (YouTube, Vimeo, or direct video link)"
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supports YouTube, Vimeo, or direct video URLs
          </p>
        </div>
      )}

      {/* File Upload */}
      {inputType === "upload" && (
        <div className="mb-4">
          {isLoading ? (
            <Loading loading={isLoading} spinner="fade" />
          ) : (
            <div>
              <input
                onChange={handleVideoFileUpload}
                type="file"
                name="video"
                id="product_video"
                accept="video/*"
                className="hidden"
              />
              <label
                htmlFor="product_video"
                className="text-tiny w-full inline-block py-1 px-4 rounded-md border border-gray6 text-center hover:cursor-pointer hover:bg-theme hover:text-white hover:border-theme transition"
              >
                Upload Video File
              </label>
            </div>
          )}
        </div>
      )}

      {/* Video Preview */}
      {videoUrl && (
        <div className="mt-4 relative">
          <div className="border border-gray-300 rounded-md p-2 relative">
            {getVideoThumbnail(videoUrl) ? (
              <div className="relative">
                <img
                  src={getVideoThumbnail(videoUrl) || ""}
                  alt="Video thumbnail"
                  className="w-full h-48 object-cover rounded"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-4">
                    <svg
                      className="w-12 h-12 text-white"
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
                <p className="text-sm text-gray-600">Video URL: {videoUrl}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Video will be displayed on product details page
                </p>
              </div>
            )}
            <button
              onClick={handleDeleteVideo}
              type="button"
              className="absolute -top-2 -right-2 text-red-500 bg-white rounded-full p-1 focus:outline-none shadow-md z-10"
            >
              <SmClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVideoUpload;
