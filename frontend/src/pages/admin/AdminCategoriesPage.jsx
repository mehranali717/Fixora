import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import { useCreateCategoryMutation, useGetCategoriesQuery } from "../../store/apiSlice.js";

export default function AdminCategoriesPage() {
  const { data } = useGetCategoriesQuery();
  const [createCategory, state] = useCreateCategoryMutation();
  const form = useForm({ defaultValues: { name: "", description: "", icon: "" } });

  const onSubmit = async (values) => {
    try {
      await createCategory(values).unwrap();
      toast.success("Category created");
      form.reset();
    } catch (error) {
      toast.error(error?.data?.message || "Category create failed");
    }
  };

  return (
    <section>
      <SectionHeader title="Manage categories" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="card mb-4 grid gap-3 p-4 md:grid-cols-4">
        <input {...form.register("name")} placeholder="Category name" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input {...form.register("description")} placeholder="Description" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input {...form.register("icon")} placeholder="Icon text" className="rounded-lg border border-slate-300 px-3 py-2" />
        <button type="submit" disabled={state.isLoading} className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
          Add category
        </button>
      </form>
      <div className="space-y-2">
        {(data?.data || []).map((category) => (
          <div key={category._id} className="card p-3">
            <p className="font-semibold">{category.name}</p>
            <p className="text-sm text-slate-600">{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
