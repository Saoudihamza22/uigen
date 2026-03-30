import * as React from "react"
import { cn } from "@/lib/utils"

interface CoffeeCardProps {
  name: string
  price: number
  imageSrc: string
  imageAlt?: string
  badge?: string
  onOrder?: () => void
  className?: string
}

function CoffeeCard({
  name,
  price,
  imageSrc,
  imageAlt,
  badge,
  onOrder,
  className,
}: CoffeeCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col w-72 rounded-3xl bg-white shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl",
        className
      )}
    >
      {/* Image area */}
      <div className="relative h-56 bg-amber-50 overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt ?? name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {badge && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {badge}
          </span>
        )}

        {/* Price pill */}
        <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-amber-800 text-sm font-bold px-3 py-1 rounded-full shadow">
          ${price.toFixed(2)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">{name}</h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={cn("w-3.5 h-3.5", i < 4 ? "text-amber-400" : "text-gray-200")}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-400 ml-1">4.0</span>
          </div>
        </div>

        <button
          onClick={onOrder}
          className="mt-1 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold text-sm py-3 px-4 rounded-2xl transition-colors duration-200 shadow-sm hover:shadow-amber-200 hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.962-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          Order Now
        </button>
      </div>
    </div>
  )
}

export { CoffeeCard }
export type { CoffeeCardProps }
