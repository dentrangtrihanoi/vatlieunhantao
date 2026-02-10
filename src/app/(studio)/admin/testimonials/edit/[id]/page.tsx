import { getTestimonialById } from "@/get-api-data/testimonial";
import TestimonialForm from "../../_components/TestimonialForm";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditTestimonialPage({ params }: Props) {
    const { id } = await params;
    const testimonial = await getTestimonialById(id);

    if (!testimonial) {
        return <div>Testimonial not found</div>;
    }

    return (
        <div className="w-full max-w-3xl mx-auto bg-white border rounded-xl shadow-1 border-gray-3">
            <div className="flex items-center justify-between gap-5 px-6 py-5 border-b border-gray-3">
                <h1 className="text-base font-semibold text-dark">Edit Testimonial</h1>
            </div>

            <div className="p-6">
                <TestimonialForm testimonial={testimonial} />
            </div>
        </div>
    );
}
