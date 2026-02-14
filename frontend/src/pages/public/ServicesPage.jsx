import { useMemo, useState } from "react";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import ServiceCard from "../../components/services/ServiceCard.jsx";
import { useGetCategoriesQuery, useGetServicesQuery } from "../../store/apiSlice.js";

export default function ServicesPage() {
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });
  const serviceQuery = useGetServicesQuery(filters);
  const categoriesQuery = useGetCategoriesQuery();

  const services = useMemo(() => serviceQuery.data?.data || [], [serviceQuery.data]);
  const categories = useMemo(() => categoriesQuery.data?.data || [], [categoriesQuery.data]);

  return (
    <section>
      <SectionHeader
        title="All Services"
        subtitle="Search and filter professional services across UAE by category, price and rating."
      />

      <div className="card mb-6 grid gap-3 p-4 md:grid-cols-5">
        <input
          value={filters.q}
          onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
          placeholder="Search services"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          value={filters.minPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
          placeholder="Min AED"
          type="number"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <input
          value={filters.maxPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
          placeholder="Max AED"
          type="number"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">Newest</option>
          <option value="price_asc">Price low to high</option>
          <option value="price_desc">Price high to low</option>
          <option value="rating_desc">Top rated</option>
        </select>
      </div>

      {serviceQuery.isLoading ? <Loader text="Loading services..." /> : null}
      {serviceQuery.isError ? <EmptyState title="Failed to load services" description="Please refresh and try again." /> : null}
      {!serviceQuery.isLoading && !services.length ? (
        <EmptyState title="No services found" description="Try adjusting your filters and search keywords." />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </section>
  );
}
