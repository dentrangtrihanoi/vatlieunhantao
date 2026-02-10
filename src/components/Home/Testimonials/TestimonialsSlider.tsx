"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import SingleItem from "./SingleItem";
import TestimonialsHeader from "./TestimonialsHeader";
import { useTestimonialSwiper } from "./useTestimonialSwiper";
import { Testimonial } from "@/types/testimonial";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const BREAKPOINTS = {
    0: { slidesPerView: 1 },
    1000: { slidesPerView: 2 },
    1200: { slidesPerView: 3 },
} as const;

interface Props {
    data: Testimonial[];
}

const TestimonialsSlider = ({ data }: Props) => {
    const { sliderRef, handlePrev, handleNext, onSlideChange, currentIndex } =
        useTestimonialSwiper();

    // If no data, maybe show nothing or fallback?
    if (!data || data.length === 0) return null;

    return (
        <div className="swiper testimonial-carousel common-carousel p-5">
            <TestimonialsHeader
                onPrev={handlePrev}
                onNext={handleNext}
                isPrevDisabled={currentIndex === 0}
                isNextDisabled={currentIndex === data.length - 1} // Logic might need check if looping? Swiper usually handles loop. But here manual nav. 
            />

            <Swiper
                className="testimonial-swiper"
                ref={sliderRef}
                slidesPerView={3}
                spaceBetween={20}
                breakpoints={BREAKPOINTS}
                onSlideChange={onSlideChange}
            >
                {/* We can duplicate data to simulate minimal items for swiper if needed, but if we have dynamic data, we normally just render it. 
            The original code triplicated data: [...data, ...data, ...data]. 
            Maybe to ensure enough slides? 
            If user has 1 testimonial, 3 slidesPerView might look bad.
            I will render data as is for now. If user adds enough testimonials it's fine.
        */}
                {data.map((item, key) => (
                    <SwiperSlide key={key}>
                        <SingleItem testimonial={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TestimonialsSlider;
