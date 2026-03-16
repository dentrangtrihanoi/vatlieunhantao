"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputGroup } from "@/components/ui/input";
import cn from "@/utils/cn";
import { useRouter } from "next/navigation";
import { Post } from "@prisma/client";
import toast from "react-hot-toast";
import ImageUpload from "../../_components/ImageUpload";
import TiptapEditor from "../../_components/TiptapEditor";
import { createPost, updatePost } from "@/app/actions/post";
import { generateSlug } from "@/utils/slugGenerate";

interface PostInput {
  title: string;
  metadata?: string;
  slug?: string;
  authorId: number | string;
  categoryId: number | string;
  tags: string[];
  mainImage: {
    image: File | null | string;
  };
  imageAlt: string;
  body: string;
  isFeatured: boolean;
  metaTitle?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

type PostProps = {
  postCategories: {
    id: number;
    slug: string;
    title: string;
    img: string | null;
  }[]; // List of post categories
  authors: {
    name: string;
    id: number;
    slug: string;
    image: string;
  }[]; // List of authors
  postItem?: Post | null; // Existing author for editing
};

export default function PostForm({
  postItem,
  authors,
  postCategories,
}: PostProps) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PostInput>({
    defaultValues: {
      title: postItem?.title || "",
      metadata: postItem?.metadata || "",
      slug: postItem?.slug || "",
      authorId: postItem?.authorId || "",
      categoryId: postItem?.categoryId || "",
      tags: postItem?.tags || [],
      mainImage: {
        image: postItem?.mainImage || null,
      },
      imageAlt: (postItem as any)?.imageAlt || "",
      body: postItem?.body || "",
      isFeatured: postItem?.isFeatured || false,
      metaTitle: postItem?.metaTitle || "",
      robotsIndex: postItem?.robotsIndex ?? true,
      robotsFollow: postItem?.robotsFollow ?? true,
    },
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: PostInput) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.metadata) formData.append("metadata", data.metadata);
      if (data.slug) {
        formData.append("slug", data.slug);
      }
      formData.append("authorId", data.authorId.toString());
      formData.append("categoryId", data.categoryId.toString());
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("body", data.body);
      formData.append("isFeatured", data.isFeatured.toString());
      if (data.metaTitle) formData.append("metaTitle", data.metaTitle);
      formData.append("robotsIndex", data.robotsIndex.toString());
      formData.append("robotsFollow", data.robotsFollow.toString());
      if (data.imageAlt) formData.append("imageAlt", data.imageAlt);
      if (data.mainImage.image) {
        formData.append("mainImage", data.mainImage.image);
      } else {
        toast.error("Main Image is required*");
        setIsLoading(false);
        return;
      }
      let result;
      if (postItem) {
        result = await updatePost(postItem.id, formData);
      } else {
        result = await createPost(formData);
      }
      if (result?.success) {
        toast.success(`Post ${postItem ? "updated" : "created"} successfully`);
        reset();
        router.push("/admin/posts");
      } else {
        toast.error(result?.message || "Failed to upload post");
      }
    } catch (error: any) {
      console.error("Error uploading post", error);
      toast.error(error?.message || "Failed to upload post");
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

        {/* SEO Advanced Settings */}
        <div className="p-4 border rounded-lg border-gray-3 bg-gray-50">
          <h3 className="mb-4 text-sm font-semibold text-dark">Advanced SEO Settings</h3>
          <div className="flex flex-col gap-4">
            {/* Meta Title */}
            <Controller
              control={control}
              name="metaTitle"
              render={({ field }) => (
                <InputGroup
                  label="Meta Title (Optional - Overrides Title for SEO)"
                  type="text"
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Meta Description */}
            <Controller
              control={control}
              name="metadata"
              rules={{ required: false }}
              render={({ field, fieldState }) => (
                <div className="w-full">
                  <InputGroup
                    label="Meta Description"
                    type="text"
                    error={!!fieldState.error}
                    name={field.name}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />

            <div className="flex gap-6">
              {/* Robots Index */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="robotsIndex"
                  {...register("robotsIndex")}
                  className="w-5 h-5 text-blue rounded border-gray-300 focus:ring-blue"
                />
                <label htmlFor="robotsIndex" className="text-sm font-medium text-dark cursor-pointer">
                  Google Index (Allow search engines to show this post)
                </label>
              </div>

              {/* Robots Follow */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="robotsFollow"
                  {...register("robotsFollow")}
                  className="w-5 h-5 text-blue rounded border-gray-300 focus:ring-blue"
                />
                <label htmlFor="robotsFollow" className="text-sm font-medium text-dark cursor-pointer">
                  Google Follow (Follow links in this post)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Switch */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            {...register("isFeatured")}
            className="w-5 h-5 text-blue rounded border-gray-300 focus:ring-blue"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-dark cursor-pointer">
            Đặt làm bài viết tiêu biểu (Sẽ bỏ tích bài cũ)
          </label>
        </div>


        {/* slug Input */}
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

        {/* banner image */}
        <Controller
          control={control}
          name="mainImage"
          rules={{
            required: true,
          }}
          render={({ field, fieldState }) => (
            <ImageUpload
              label="Main Image (Recommended Size 750 × 400)"
              images={postItem?.mainImage ? [postItem.mainImage] : []}
              setImages={(files) =>
                field.onChange({ image: files?.[0] || null })
              }
              showTitle={false}
              required={true}
              error={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        {/* Image Alt Text */}
        <Controller
          control={control}
          name="imageAlt"
          rules={{ maxLength: { value: 125, message: "Tối đa 125 ký tự" } }}
          render={({ field, fieldState }) => {
            const charCount = (field.value || "").length;
            return (
              <div className="w-full">
                <InputGroup
                  label="Alt text ảnh đại diện (SEO)"
                  type="text"
                  placeholder="Mô tả nội dung ảnh cho SEO"
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">Mô tả nội dung ảnh. Tối đa 125 ký tự.</span>
                  <span className="text-xs text-gray-400">{charCount}/125</span>
                </div>
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <InputGroup
              label="Tags (comma separated)"
              type="text"
              {...field}
              onChange={(e) =>
                setValue(
                  "tags",
                  (e.target as HTMLInputElement).value.split(",")
                )
              }
            />
          )}
        />

        {/* category field */}
        <div>
          <label
            htmlFor="categoryId"
            className="block mb-1.5 text-sm text-gray-6"
          >
            Category <span className="text-red">*</span>
          </label>
          <select
            {...register("categoryId", { required: "Category is required" })}
            id="categoryId"
            className={cn(
              "rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0",
              { "border-red-500": errors.categoryId }
            )}
          >
            <option value="">Select a category</option>
            {postCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-red mt-1.5">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* author field */}
        <div>
          <label
            htmlFor="authorId"
            className="block mb-1.5 text-sm text-gray-6"
          >
            Author <span className="text-red">*</span>
          </label>
          <select
            {...register("authorId", { required: "Author is required" })}
            id="authorId"
            className={cn(
              "rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0",
              { "border-red-500": errors.authorId }
            )}
          >
            <option value="">Select a author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          {errors.authorId && (
            <p className="text-sm text-red mt-1.5">{errors.authorId.message}</p>
          )}
        </div>

        {/* Quill Editor for Body */}
        <Controller
          control={control}
          name="body"
          rules={{
            required: "Body is required",
            validate: (value) =>
              value.trim() === "" || value === "<p><br></p>"
                ? "Body is required"
                : true,
          }}
          render={({ field, fieldState }) => (
            <TiptapEditor
              label="Body"
              required
              value={field.value}
              onChange={field.onChange}
              errMsg={fieldState.error?.message}
            />
          )}
        />
      </div>
      {/* Submit Button */}
      <button
        className={cn(
          "inline-flex  items-center gap-2 font-normal text-sm text-white bg-blue py-3 px-5 rounded-lg ease-out duration-200 hover:bg-blue-dark",
          { "opacity-80 pointer-events-none": isLoading }
        )}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : postItem ? "Update Post" : "Save Post"}
      </button>
    </form>
  );
}
