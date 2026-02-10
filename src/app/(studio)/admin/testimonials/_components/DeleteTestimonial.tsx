"use client";

import { deleteTestimonial } from "@/app/actions/testimonial";
import { TrashIcon } from "@/assets/icons";
import { confirmDialog, successDialog } from "@/utils/confirmDialog";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

export default function DeleteTestimonial({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            try {
                const isConfirmed = await confirmDialog(
                    "Are you sure?",
                    "Delete this testimonial?"
                );

                if (!isConfirmed) {
                    return;
                }
                const response = await deleteTestimonial(id);
                if (response?.success) {
                    successDialog("Testimonial deleted successfully");
                } else {
                    toast.error(response?.error || "Failed to delete testimonial");
                }
            } catch (err: any) {
                toast.error(err?.message || "Failed to delete testimonial");
            }
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="p-1.5 border rounded-md text-gray-7 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red size-8 inline-flex items-center justify-center border-gray-3"
            title="Delete"
        >
            {isPending ? (
                <span className="w-5 h-5 border-2 border-gray-300 rounded-full border-blue animate-spin" />
            ) : (
                <TrashIcon />
            )}
        </button>
    );
}
