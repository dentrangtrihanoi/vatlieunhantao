"use client";
import Image from 'next/image';
import { useCallback, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';

import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppSelector } from "@/redux/store";

const PreviewSliderModal = () => {
  const { closePreviewModal, isModalPreviewOpen } = usePreviewSlider();
  const data = useAppSelector((state) => state.productDetailsReducer.value);
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    // @ts-ignore
    sliderRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    // @ts-ignore
    sliderRef.current.swiper.slideNext();
  }, []);

  if (!isModalPreviewOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90"
      onClick={() => closePreviewModal()}
    >
      {/* Close button */}
      <button
        onClick={() => closePreviewModal()}
        aria-label="close"
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 text-white hover:text-gray-300 transition-colors"
      >
        <svg className="fill-current" width="36" height="36" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z" fill="" />
        </svg>
      </button>

      {/* Content — stopPropagation so clicking image doesn't close */}
      <div
        className="relative w-[90vw] h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev button */}
        <button
          onClick={handlePrev}
          aria-label="previous"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:text-gray-300 transition-colors"
        >
          <svg width="36" height="36" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.4082 5.92548C11.0909 5.60817 10.5764 5.60817 10.2591 5.92548L3.75908 12.4255C3.44178 12.7428 3.44178 13.2572 3.75908 13.5745L10.2591 20.0745C10.5764 20.3918 11.0909 20.3918 11.4082 20.0745C11.7255 19.7572 11.7255 19.2428 11.4082 18.9255L6.29517 13.8125H21.667C22.1157 13.8125 22.4795 13.4487 22.4795 13C22.4795 12.5513 22.1157 12.1875 21.667 12.1875H6.29517L11.4082 7.07452C11.7255 6.75722 11.7255 6.24278 11.4082 5.92548Z" fill="#FDFDFD" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={handleNext}
          aria-label="next"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:text-gray-300 transition-colors"
        >
          <svg width="36" height="36" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.5918 5.92548C14.9091 5.60817 15.4236 5.60817 15.7409 5.92548L22.2409 12.4255C22.5582 12.7428 22.5582 13.2572 22.2409 13.5745L15.7409 20.0745C15.4236 20.3918 14.9091 20.3918 14.5918 20.0745C14.2745 19.7572 14.2745 19.2428 14.5918 18.9255L19.7048 13.8125H4.33301C3.88428 13.8125 3.52051 13.4487 3.52051 13C3.52051 12.5513 3.88428 12.1875 4.33301 12.1875H19.7048L14.5918 7.07452C14.2745 6.75722 14.2745 6.24278 14.5918 5.92548Z" fill="#FDFDFD" />
          </svg>
        </button>

        {/* Swiper — full width/height of container */}
        <Swiper
          ref={sliderRef}
          slidesPerView={1}
          spaceBetween={0}
          className="w-full h-full"
        >
          {data.productVariants?.map((img: any, key: number) => (
            <SwiperSlide key={key} className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={img.image ? img.image : "/"}
                  alt={data.title || "thumb-img"}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PreviewSliderModal;
