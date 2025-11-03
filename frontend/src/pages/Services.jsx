import React, { useMemo, useState } from 'react'
import servicesData from '../data/services.json'
import Filters from '../components/Filters'
import ServiceCard from '../ui/ServiceCard'

const PAGE_SIZE = 6

function getCategoryFromTitle(title) {
  if (/clean/i.test(title)) return 'Cleaning'
  if (/plumb/i.test(title)) return 'Plumbing'
  if (/electr/i.test(title)) return 'Electrical'
  if (/appliance/i.test(title)) return 'Appliance'
  if (/delivery/i.test(title)) return 'Delivery'
  if (/ac/i.test(title)) return 'AC'
  return 'Other'
}

export default function ServicesPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)

  // Attach derived category to each service
  const services = useMemo(() => {
    return servicesData.map(s => ({ ...s, category: getCategoryFromTitle(s.title) }))
  }, [])

  const filtered = useMemo(() => {
    let list = services

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(s =>
        (s.title + ' ' + s.description + ' ' + s.price).toLowerCase().includes(q)
      )
    }

    if (category !== 'All') {
      list = list.filter(s => s.category === category)
    }

    if (sort === 'price-asc') {
      list = list.slice().sort((a,b) => parsePrice(a.price) - parsePrice(b.price))
    } else if (sort === 'price-desc') {
      list = list.slice().sort((a,b) => parsePrice(b.price) - parsePrice(a.price))
    }

    return list
  }, [services, query, category, sort])

  // paging
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  function parsePrice(priceStr = '') {
    // try to extract number e.g. "From AED 99" -> 99
    const m = priceStr.match(/(\d+)/)
    return m ? Number(m[1]) : 0
  }

  // derive categories for filter
  const categories = useMemo(() => {
    const set = new Set(['All'])
    services.forEach(s => set.add(s.category))
    return Array.from(set)
  }, [services])

  return (
    <div className="max-w-7xl mx-auto pt-[100px] p-6">
     <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-blue-900 to-teal-900 bg-clip-text text-transparent">
            Our Home Services
          </span>
        </h2>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Reliable home services across the UAE —{" "}
          <span className="font-semibold">cleaning</span>,
          <span className="font-semibold"> repairs</span>, and
          <span className="font-semibold"> maintenance</span>. Transparent
          pricing, verified professionals, and hassle-free booking.
        </p>
        <div className="flex items-center justify-center mt-6">
          <span className="h-[2px] w-12 bg-gradient-to-r from-teal-400 to-blue-500"></span>
          <svg
            className="w-6 h-6 text-blue-500 mx-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm2 9H8a1 1 0 010-2h4a1 1 0 010 2z" />
          </svg>
          <span className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-teal-400"></span>
        </div>
      </div>

      <Filters
        query={query} setQuery={setQuery}
        category={category} setCategory={c => { setCategory(c); setPage(1) }}
        categories={categories}
        sort={sort} setSort={s => { setSort(s); setPage(1) }}
      />

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mt-8">
        {paged.map(s => (
          <ServiceCard key={s.id} {...s} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center space-x-4">
        <button
          onClick={() => setPage(p => Math.max(1, p-1))}
          className="px-3 py-2 rounded bg-emerald-50  border border-emerald-700 text-emerald-700 disabled:opacity-50"
          disabled={page === 1}
        >
          Prev
        </button>
        <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p+1))}
          className="px-3 py-2 rounded bg-emerald-50  border border-emerald-700 text-emerald-700 disabled:opacity-50"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}
