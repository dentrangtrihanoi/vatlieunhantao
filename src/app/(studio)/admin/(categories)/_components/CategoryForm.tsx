"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputGroup } from "@/components/ui/input";
import cn from "@/utils/cn";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import toast from "react-hot-toast";
import ImageUpload from "../../_components/ImageUpload";
import TiptapEditor from "../../_components/TiptapEditor";
import { errorDialog } from "@/utils/confirmDialog";
import { createCategory, updateCategory } from "@/app/actions/category";

interface CategoryInput {
  title: string;
  slug: string;
  desc: string;
  descBottom: string;
  image: File | null | string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

type CategoryProps = {
  category?: Category; // Existing category for editing
};

export default function CategoryForm({ category }: CategoryProps) {
  const { handleSubmit, control, watch, register, reset, setValue } =
    useForm<CategoryInput>({
      defaultValues: {
        title: category?.title || "", // Prefill title if editing
        slug: category?.slug || "", // Prefill slug
        desc: category?.description || "",
        descBottom: category?.descriptionBottom || "",
        image: category?.img || null,
        imageAlt: (category as any)?.imageAlt || "", // New image will be stored here
        metaTitle: category?.metaTitle || "",
        metaDescription: category?.metaDescription || "",
        robotsIndex: category?.robotsIndex ?? true,
        robotsFollow: category?.robotsFollow ?? true,
      },
    });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const imageFile = watch("image");

  const onSubmit = async (data: CategoryInput) => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      const slugified = data.slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
      formData.append("title", data.title);
      formData.append("slug", slugified);
      formData.append("desc", data.desc);
      formData.append("descBottom", data.descBottom);
      formData.append("metaTitle", data.metaTitle);
      formData.append("metaDescription", data.metaDescription);
      formData.append("robotsIndex", String(data.robotsIndex));
      formData.append("robotsFollow", String(data.robotsFollow));
      if (data.imageAlt) formData.append("imageAlt", data.imageAlt);
      if (data.image instanceof File) {
        formData.append("image", data.image); // Only add file if selected
      } else if (typeof data.image === "string") {
        formData.append("image", data.image); // Only add file if selected
      }
      // ✅ Show error only if NO image is present
      if (!data.image && !category?.img) {
        return errorDialog("Image is required");
      }
      let result;
      if (category) {
        result = await updateCategory(category.id, formData);
      } else {
        result = await createCategory(formData);
      }
      if (result?.success) {
        toast.success(
          `Category ${category ? "updated" : "created"} successfully`
        );
        reset();
        router.push("/admin/categories");
      } else {
        toast.error(result?.message || "Failed to upload category");
      }
    } catch (error: any) {
      console.error("Error uploading category:", error);
      toast.error(error?.message || "Failed to upload category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 mb-5">
        {/* Title Input */}
        <Controller
          control={control}
          name="title"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <InputGroup
                label="Title"
                type="text"
                required
                error={!!fieldState.error}
                errorMessage="Title is required"
                name={field.name}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            </div>
          )}
        />

        {/* Slug Input */}
        <Controller
          control={control}
          name="slug"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <InputGroup
                label="Slug"
                type="text"
                required
                error={!!fieldState.error}
                errorMessage="Slug is required"
                name={field.name}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            </div>
          )}
        />

        {/* SEO Meta Fields */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Controller
            control={control}
            name="metaTitle"
            rules={{ required: false }}
            render={({ field }) => (
              <InputGroup
                label="Meta Title (SEO)"
                type="text"
                placeholder="Meta Title"
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="metaDescription"
            rules={{ required: false }}
            render={({ field }) => (
              <InputGroup
                label="Meta Description (SEO)"
                type="text"
                placeholder="Meta Description"
                {...field}
              />
            )}
          />
        </div>

        {/* SEO Robots Meta */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Controller
            control={control}
            name="robotsIndex"
            render={({ field }) => (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 border rounded-md accent-blue-600 border-gray-4 focus:ring-0 focus:ring-transparent"
                  checked={field.value}
                  onChange={field.onChange}
                />
                <span className="text-sm text-gray-600">Index</span>
              </label>
            )}
          />

          <Controller
            control={control}
            name="robotsFollow"
            render={({ field }) => (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 border rounded-md accent-blue-600 border-gray-4 focus:ring-0 focus:ring-transparent"
                  checked={field.value}
                  onChange={field.onChange}
                />
                <span className="text-sm text-gray-600">Follow</span>
              </label>
            )}
          />
        </div>

        {/* Description Input */}
        <div className="rounded-[10px] break-after-column mb-5">
          <Controller
            control={control}
            name="desc"
            render={({ field, fieldState }) => (
              <TiptapEditor
                label="Description (Top)"
                value={field.value}
                onChange={field.onChange}
                errMsg={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Description Bottom Input */}
        <div className="rounded-[10px] break-after-column mb-5">
          <Controller
            control={control}
            name="descBottom"
            render={({ field, fieldState }) => (
              <TiptapEditor
                label="Description (Bottom)"
                value={field.value}
                onChange={field.onChange}
                errMsg={fieldState.error?.message}
              />
            )}
          />
        </div>

      </div>



      {/* preview image */}
      <Controller
        control={control}
        name="image"
        rules={{
          required: true,
        }}
        render={({ field, fieldState }) => (
          <ImageUpload
            label="Category Image (Recommended: 80x70)"
            images={
              imageFile ? [imageFile] : category?.img ? [category.img] : null
            }
            setImages={(files) => field.onChange(files?.[0] || null)}
            required={true}
            error={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            altText={watch("imageAlt")}
            onAltTextChange={(val) => setValue("imageAlt", val)}
            altTextLabel="Alt text ảnh danh mục (SEO)"
          />
        )}
      />

      {/* Submit Button */}
      <button
        className={cn(
          "inline-flex items-center gap-2 font-normal text-white bg-blue py-3 px-4 rounded-lg text-sm ease-out duration-200 hover:bg-blue-dark",
          { "opacity-80 pointer-events-none": isLoading }
        )}
        disabled={isLoading}
      >
        {isLoading
          ? "Saving..."
          : category
            ? "Update Category"
            : "Save Category"}
      </button>
    </form>
  );
}
