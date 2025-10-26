import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import BookingModal from '../components/booking'

export default function ServiceCard({ id, title, description, price, icon, image }) {
  const [showBook, setShowBook] = useState(false)

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer transform hover:-translate-y-1 transition">
        {image ? (
          <img src={image} alt={title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-teal-100 to-blue-50 flex items-center justify-center text-4xl">
            {icon || '🏠'}
          </div>
        )}

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">{title}</div>
              <div className="text-xs text-gray-200 mt-1">{description}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-emerald-500 font-semibold">{price}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <Link to={`/services/${id}`}>
              <Button variant="secondary" className="bg-white/20 text-white border border-white/30">View</Button>
            </Link>
            <Button onClick={() => setShowBook(true)} className="bg-emerald-500">Book</Button>
          </div>
        </div>
      </div>

      {showBook && (
        <BookingModal
          service={{ id, title, price }}
          onClose={() => setShowBook(false)}
        />
      )}
    </>
  )
}
