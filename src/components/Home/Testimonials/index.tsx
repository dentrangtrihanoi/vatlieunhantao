import { getTestimonials } from "@/get-api-data/testimonial";
import TestimonialsSlider from "./TestimonialsSlider";

const Testimonials = async () => {
  const testimonials = await getTestimonials();

  return (
    <section className="py-[16px]">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 xl:px-0">
        <TestimonialsSlider data={testimonials} />
      </div>
    </section>
  );
};

export default Testimonials;
