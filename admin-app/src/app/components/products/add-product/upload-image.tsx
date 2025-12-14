import React from "react";
import Image from "next/image";
import upload_default from "@assets/img/icons/upload.png";
import { SmClose } from "@/svg";
import useCloudinary from "@/hooks/useCloudinary";

type IPropType = {
  file: { url: string; id: string };
  setFormData?: React.Dispatch<React.SetStateAction<string[]>>;
  setImgUrl?: React.Dispatch<React.SetStateAction<string>>;
  isCenter?:boolean;
};

const UploadImage = ({ file,setFormData,setImgUrl,isCenter=false }: IPropType) => {
  const {handleDeleteImg,item} = useCloudinary(file,setFormData,setImgUrl);
  
  // Check if the URL is a video URL
  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || 
           url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
  };

  // Get video thumbnail for YouTube
  const getVideoThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    }
    return null;
  };

  const videoThumbnail = item.url && isVideoUrl(item.url) ? getVideoThumbnail(item.url) : null;
  const isVideo = item.url ? isVideoUrl(item.url) : false;

  return (
    <>
      {item.url && (
        <div className={`flex flex-row flex-wrap ${isCenter?'items-center justify-center':''}`}>
          <div className="relative">
            {isVideo ? (
              <div className="inline-flex border rounded-md border-gray6 w-24 max-h-24 p-2 relative">
                {videoThumbnail ? (
                  <>
                    <img
                      src={videoThumbnail}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover rounded"
                      style={{ width: '100px', height: '100px' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-1">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded" style={{ width: '100px', height: '100px' }}>
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                )}
                <button
                  onClick={() => handleDeleteImg(file)}
                  type="button"
                  className="absolute -top-4 -right-3 text-red-500 focus:outline-none"
                >
                  <SmClose />
                </button>
              </div>
            ) : (
              <>
                <Image
                  className="inline-flex border rounded-md border-gray6 w-24 max-h-24 p-2"
                  src={item.url}
                  alt="productImg"
                  width={100}
                  height={100}
                />
                <button
                  onClick={() => handleDeleteImg(file)}
                  type="button"
                  className="absolute -top-4 -right-3 text-red-500 focus:outline-none"
                >
                  <SmClose />
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {!item.url && (
        <div className={`flex flex-row flex-wrap ${isCenter?'items-center justify-center':''}`}>
          <div className="relative">
            <Image
              className="inline-flex border rounded-md border-gray6 w-24 max-h-24 p-2"
              src={upload_default}
              alt="productImg"
              width={100}
              height={100}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UploadImage;
