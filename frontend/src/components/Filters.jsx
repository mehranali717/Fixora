import React from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function Filters({ query, setQuery, category, setCategory, categories, sort, setSort }) {

  return (
    <div className="bg-emerald-50 p-4 rounded-lg flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search services, e.g. plumbing, cleaning..." className='px-4 w-100'/>
      </div>

      <div className="flex items-center gap-3">
      <div className="flex flex-wrap gap-4 items-center">
  {/* Category Filter */}
  <div>
    <select
      className="w-48 rounded-lg border-gray-300 shadow-sm text-gray-700 px-4 py-2 border-2"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      {categories.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  </div>

  {/* Sort Filter */}
  <div>
    <select
      className="w-56 rounded-lg border-gray-300 shadow-sm focus:border-2 text-gray-700 px-4 py-2 border-2"
      value={sort}
      onChange={(e) => setSort(e.target.value)}
    >
      <option value="relevance">Relevance</option>
      <option value="price-asc">Price: Low → High</option>
      <option value="price-desc">Price: High → Low</option>
    </select>
  </div>
</div>


        <Button variant="outline" onClick={() => { setQuery(''); setCategory('All'); setSort('relevance'); }}>
          Reset
        </Button>
      </div>
    </div>
  )
}
