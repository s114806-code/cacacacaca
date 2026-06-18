import React from "react";
import heroImg from "../assets/images/restaurant_hero_1781797669316.jpg";
import { Clock, MapPin, Phone, ShieldCheck, Heart, Coffee } from "lucide-react";

interface HeroSectionProps {
  onReserveClick: () => void;
  onMenuClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onReserveClick, onMenuClick }) => {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Banner / Hero Card */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-brand-gold/40 shadow-2xl bg-warm-900 min-h-[360px] sm:min-h-[460px] flex items-center">
        {/* Aspect ratio / Image cover */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="頤和園中餐廳"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          {/* Accent Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-warm-900 via-warm-900/80 to-transparent" />
        </div>

        {/* Content Section */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-12 text-white space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/20 border border-brand-gold/60 rounded-full text-brand-gold-light text-xs sm:text-sm font-semibold tracking-widest font-chinese-serif uppercase">
            ✦ 頤指神饗 ✦ 和悅呈祥 ✦
          </span>
          <h1 className="font-chinese-serif text-3xl sm:text-5xl font-extrabold tracking-wide text-warm-50 leading-tight">
            頤和園中餐廳 <br/>
            <span className="text-brand-gold text-2xl sm:text-3.5xl font-semibold italic mt-1 block">
              溫馨雅緻 · 家庭聚餐主場
            </span>
          </h1>
          <p className="text-sm sm:text-base text-warm-200 leading-relaxed max-w-lg font-sans">
            嚴選當季在地好食材，由三十年老廚師傳承古法，慢熬精燒。
            在暖白色調、原木輕刻的典雅客堂中，陪伴您與親人共度暖心的團聚食光。
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 font-chinese-serif">
            <button
              onClick={onReserveClick}
              className="bg-brand-red hover:bg-brand-red-light text-white font-bold px-6 py-3 rounded-md shadow-lg hover:shadow-xl hover:scale-102 transition-all text-sm sm:text-base cursor-pointer"
              id="hero-btn-reserve"
            >
              線上即時訂位
            </button>
            <button
              onClick={onMenuClick}
              className="bg-white/10 hover:bg-white/20 border border-warm-300 text-warm-50 font-medium px-6 py-3 rounded-md transition-all text-sm sm:text-base backdrop-blur-xs cursor-pointer"
              id="hero-btn-menu"
            >
              菜單佳餚瀏覽
            </button>
          </div>
        </div>
      </div>

      {/* Info Block Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-white rounded-xl p-6 border border-warm-300 shadow-xs hover:shadow-md transition-all flex gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
            <MapPin className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="font-chinese-serif font-bold text-warm-900 text-base">尋味閣樓</h3>
            <p className="text-xs text-warm-800/80 mt-1 sm:mt-1.5 leading-relaxed">
              台北市大安區和諧路168號 (捷運敦化站3號出口，步行3分鐘)
            </p>
            <span className="text-[10px] text-brand-gold font-bold mt-2 block font-chinese-serif">
              附特約停車場，用餐可享3小時免費停車
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-warm-300 shadow-xs hover:shadow-md transition-all flex gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
            <Clock className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="font-chinese-serif font-bold text-warm-900 text-base">賞味期時</h3>
            <p className="text-xs text-warm-800/80 mt-1 sm:mt-1.5 leading-relaxed">
              午餐時段：11:30 - 14:30 <br/>
              晚餐時段：17:30 - 21:30
            </p>
            <span className="text-[10px] text-brand-gold font-bold mt-2 block font-chinese-serif flex items-center gap-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              週末與例假日建議提早一週預約
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-warm-300 shadow-xs hover:shadow-md transition-all flex gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
            <Phone className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="font-chinese-serif font-bold text-warm-900 text-base">奉茶叩問</h3>
            <p className="text-xs text-warm-800/80 mt-1 sm:mt-1.5 leading-relaxed">
              專線：(02) 2345-6789 <br/>
              信箱：service@yiheyuan.com
            </p>
            <span className="text-[10px] text-brand-red font-bold mt-2 block font-chinese-serif">
              大宗家族包場 / 公司聚餐另有精緻廂房優惠
            </span>
          </div>
        </div>
      </div>

      {/* Brand Concept Story */}
      <div className="bg-warm-100 rounded-2xl p-8 sm:p-12 border border-warm-300/80 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-brand-gold font-semibold uppercase tracking-wider text-xs sm:text-sm font-chinese-serif">
            — 傳奇食錄 · 家宴溫馨 —
          </span>
          <h2 className="font-chinese-serif text-2xl sm:text-3xl font-bold text-warm-900 tracking-wide">
            三十載手藝精燒，唯願您家人團圓
          </h2>
          <p className="text-xs sm:text-sm text-warm-800/90 leading-relaxed font-sans">
            「頤和園」自創立伊始，便將「家」與「味」視為靈魂。我們明白，家庭聚會不光是吃飽，
            更是長輩的慈祥、孩子的歡笑，與平靜相處時那份被暖白燭光映照出的溫存。
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-warm-900 font-chinese-serif">
              <Heart className="w-4.5 h-4.5 text-brand-red" />
              <span>嚴選天然無防腐劑</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-warm-900 font-chinese-serif">
              <Coffee className="w-4.5 h-4.5 text-brand-gold" />
              <span>暖胃手奉功夫茶</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-warm-300 shadow-lg aspect-video h-56 sm:h-auto">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop"
            alt="優雅座位區"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-brand-red/10 blend-overlay" />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded">
            頤雅幽靜包廂 A區
          </div>
        </div>
      </div>
    </div>
  );
};
