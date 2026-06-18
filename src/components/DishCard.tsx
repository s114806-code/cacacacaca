import React from "react";
import { Dish } from "../types";
import { Utensils, Award } from "lucide-react";

interface DishCardProps {
  dish: Dish;
  onBookNow: (dishName: string) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onBookNow }) => {
  return (
    <div 
      className="bg-white rounded-lg border border-warm-300 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full"
      id={`dish-card-${dish.id}`}
    >
      {/* Dish Image Wrapper */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-warm-100">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-warm-100/90 text-warm-900 border border-warm-300 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs font-chinese-serif">
          {dish.category}
        </span>

        {/* Popular/Chef Recommended Badge */}
        {dish.isPopular && (
          <span className="absolute top-3 right-3 bg-brand-red text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md animate-pulse">
            <Award className="w-3.5 h-3.5" />
            人氣招牌
          </span>
        )}

        {/* Shadow decoration on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Dish Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-chinese-serif text-lg sm:text-xl font-bold text-warm-900 leading-tight group-hover:text-brand-red transition-colors">
              {dish.name}
            </h3>
            <span className="text-brand-red font-semibold font-chinese-serif text-lg">
              ${dish.price} <span className="text-[10px] text-warm-800/60 font-normal">/ 份</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-warm-800/80 leading-relaxed font-sans line-clamp-3">
            {dish.description}
          </p>
        </div>

        <div className="pt-5 border-t border-warm-200 mt-4 flex items-center justify-between gap-2">
          <span className="text-[11px] text-brand-gold font-semibold tracking-wider uppercase font-chinese-serif flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5" />
            傳統御廚手工製
          </span>
          <button
            onClick={() => onBookNow(dish.name)}
            className="px-3.5 py-1.5 bg-brand-gold hover:bg-brand-gold-light text-white rounded-md text-xs font-semibold shadow-xs transition-colors hover:shadow-md cursor-pointer"
            id={`btn-dish-book-${dish.id}`}
          >
            點此預留訂位
          </button>
        </div>
      </div>
    </div>
  );
};
