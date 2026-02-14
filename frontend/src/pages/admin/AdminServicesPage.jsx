import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetCategoriesQuery,
  useGetServicesQuery,
  useUpdatePricingMutation,
  useUploadServiceImageMutation,
} from "../../store/apiSlice.js";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export default function AdminServicesPage() {
  const { data: serviceData } = useGetServicesQuery({});
  const { data: categoryData } = useGetCategoriesQuery();
  const [createService, createState] = useCreateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();
  const [updatePricing] = useUpdatePricingMutation();
  const [uploadServiceImage, uploadState] = useUploadServiceImageMutation();
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const categories = categoryData?.data || [];

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 100,
      duration: 60,
      imageUrl: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      if (!OBJECT_ID_REGEX.test(values.category || "")) {
        toast.error("Please select a valid category.");
        return;
      }

      let uploadedImageUrl = values.imageUrl?.trim() || "";

      if (selectedImageFile) {
        if (!selectedImageFile.type?.startsWith("image/")) {
          toast.error("Please select a valid image file.");
          return;
        }

        if (selectedImageFile.size > MAX_IMAGE_SIZE_BYTES) {
          toast.error("Image must be 5MB or smaller.");
          return;
        }

        const formData = new FormData();
        formData.append("image", selectedImageFile);
        const uploadResponse = await uploadServiceImage(formData).unwrap();
        uploadedImageUrl = uploadResponse?.data?.url || "";
      }

      await createService({
        title: values.title,
        description: values.description,
        category: values.category,
        price: Number(values.price),
        duration: Number(values.duration),
        images: uploadedImageUrl ? [uploadedImageUrl] : [],
      }).unwrap();

      toast.success("Service created");
      setSelectedImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      form.reset({ title: "", description: "", category: "", price: 100, duration: 60, imageUrl: "" });
    } catch (error) {
      toast.error(error?.data?.message || "Create service failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id).unwrap();
      toast.success("Service deleted");
    } catch (error) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  const handleQuickPricing = async (id, currentPrice) => {
    const next = Number(window.prompt("Enter new AED price", currentPrice));
    if (!Number.isFinite(next) || next < 0) return;
    try {
      await updatePricing({ id, price: next }).unwrap();
      toast.success("Pricing updated");
    } catch (error) {
      toast.error(error?.data?.message || "Pricing update failed");
    }
  };

  return (
    <section>
      <SectionHeader title="Manage services" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="card mb-4 grid gap-3 p-4 md:grid-cols-2">
        <input {...form.register("title", { required: true })} placeholder="Title" className="rounded-lg border border-slate-300 px-3 py-2" />
        <select {...form.register("category", { required: true })} className="rounded-lg border border-slate-300 px-3 py-2" defaultValue="">
          <option value="" disabled>Select category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
        <textarea {...form.register("description", { required: true })} placeholder="Description" className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2" />
        <input type="number" {...form.register("price", { required: true, min: 0 })} placeholder="Price" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input type="number" {...form.register("duration", { required: true, min: 15 })} placeholder="Duration mins" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => setSelectedImageFile(event.target.files?.[0] || null)}
          className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2"
        />
        <input
          {...form.register("imageUrl")}
          placeholder="Image URL (optional fallback)"
          className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2"
        />
        <button
          type="submit"
          disabled={createState.isLoading || uploadState.isLoading || categories.length === 0}
          className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white md:col-span-2"
        >
          {uploadState.isLoading ? "Uploading image..." : createState.isLoading ? "Creating service..." : "Add service"}
        </button>
      </form>
      <div className="space-y-2">
        {(serviceData?.data || []).map((service) => (
          <article key={service._id} className="card flex flex-wrap items-center justify-between gap-2 p-3">
            <div>
              <p className="font-semibold">{service.title}</p>
              <p className="text-sm text-slate-600">AED {service.price} | {service.duration} mins</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleQuickPricing(service._id, service.price)} className="rounded-lg border border-slate-300 px-3 py-1 text-sm">
                Pricing
              </button>
              <button onClick={() => handleDelete(service._id)} className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}