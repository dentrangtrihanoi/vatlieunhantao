import { PlusIcon } from "@/assets/icons";
import { getTestimonials } from "@/get-api-data/testimonial";
import Image from "next/image";
import Link from "next/link";
import { EditIcon } from "../_components/Icons";
import DeleteTestimonial from "./_components/DeleteTestimonial";

export default async function TestimonialPage() {
    const testimonials = await getTestimonials();

    return (
        <div className="w-full max-w-5xl mx-auto bg-white border rounded-xl shadow-1 border-gray-3">
            <div className="flex items-center justify-between gap-5 px-6 py-5 border-b border-gray-3">
                <h2 className="text-base font-semibold text-dark">All Testimonials</h2>
                <Link
                    href="/admin/testimonials/create"
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-normal text-white duration-200 ease-out rounded-lg bg-dark hover:bg-darkLight"
                >
                    <PlusIcon className="w-3 h-3" /> Add Testimonial
                </Link>
            </div>

            <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full text-left bg-white">
                    <thead>
                        <tr className="text-sm border-b border-gray-3">
                            <th className="px-6 py-3 font-medium text-gray-6">Image</th>
                            <th className="px-6 py-3 font-medium text-gray-6">Name</th>
                            <th className="px-6 py-3 font-medium text-gray-6">Role</th>
                            <th className="px-6 py-3 font-medium text-gray-6">Review</th>
                            <th className="px-6 py-3 font-medium text-right text-gray-6">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-3">
                        {testimonials && testimonials.length > 0 ? (
                            testimonials.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-3">
                                        {item.image ? (
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-2 rounded-full flex items-center justify-center text-xs text-gray-5">
                                                No Img
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-sm font-medium text-dark">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-6">
                                        {item.designation}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-6 max-w-[300px] truncate">
                                        {item.review}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            <DeleteTestimonial id={item.id} />
                                            <Link
                                                href={`/admin/testimonials/edit/${item.id}`}
                                                aria-label="Edit testimonial"
                                                className="p-1.5 border rounded-md text-gray-7 bg-transparent hover:bg-blue-light-5 hover:text-blue size-8 inline-flex items-center justify-center border-gray-3"
                                            >
                                                <EditIcon />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-red">
                                    No testimonials found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
