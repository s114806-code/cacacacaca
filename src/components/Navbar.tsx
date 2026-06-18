import React from "react";
import { UtensilsCrossed, CalendarDays, User, LogIn, LogOut, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  openAuthModal: (mode: "login" | "register") => void;
  onMobileMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setView,
  openAuthModal,
  onMobileMenuToggle,
}) => {
  const { user, logout } = useAuth();

  const handleLinkClick = (view: string) => {
    setView(view);
  };

  return (
    <nav className="sticky top-0 z-40 bg-warm-100/95 backdrop-blur-md border-b border-warm-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div 
            onClick={() => handleLinkClick("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
            id="nav-logo"
          >
            <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105">
              <UtensilsCrossed className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="font-chinese-serif text-xl sm:text-2xl font-bold tracking-wide text-brand-red uppercase">
                頤和園
              </span>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-widest text-brand-gold -mt-1 font-chinese-serif">
                溫馨家庭中餐廳
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 font-chinese-serif font-medium">
            <button
              onClick={() => handleLinkClick("home")}
              className={`pb-1 border-b-2 hover:text-brand-red decoration-brand-red transition-all ${
                currentView === "home" ? "border-brand-red text-brand-red font-semibold" : "border-transparent text-warm-800"
              }`}
              id="btn-nav-home"
            >
              關於我們
            </button>
            <button
              onClick={() => handleLinkClick("menu")}
              className={`pb-1 border-b-2 hover:text-brand-red decoration-brand-red transition-all ${
                currentView === "menu" ? "border-brand-red text-brand-red font-semibold" : "border-transparent text-warm-800"
              }`}
              id="btn-nav-menu"
            >
              美味佳餚
            </button>
            <button
              onClick={() => handleLinkClick("booking")}
              className={`pb-1 border-b-2 hover:text-brand-red decoration-brand-red transition-all ${
                currentView === "booking" ? "border-brand-red text-brand-red font-semibold" : "border-transparent text-warm-800"
              }`}
              id="btn-nav-booking"
            >
              線上訂位
            </button>
            {user && (
              <button
                onClick={() => handleLinkClick("my-reservations")}
                className={`pb-1 border-b-2 hover:text-brand-red decoration-brand-red transition-all flex items-center gap-1.5 ${
                  currentView === "my-reservations" ? "border-brand-red text-brand-red font-semibold" : "border-transparent text-warm-800"
                }`}
                id="btn-nav-reservations"
              >
                <CalendarDays className="w-4 h-4 text-brand-gold" />
                我的預約
              </button>
            )}
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 bg-warm-200/60 py-1.5 px-4 rounded-full border border-warm-300">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-warm-800">
                    {user.displayName || "貴賓"}
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-xs font-semibold text-warm-800/70 hover:text-brand-red transition-colors flex items-center gap-1 hover:underline decoration-brand-red"
                  id="btn-logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  登出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuthModal("login")}
                  className="px-4 py-2 text-sm font-semibold border border-warm-400 bg-white hover:bg-warm-100 rounded-md transition-all text-warm-800 flex items-center gap-1.5"
                  id="btn-login-trigger"
                >
                  <LogIn className="w-4 h-4 text-brand-gold" />
                  會員登入
                </button>
                <button
                  onClick={() => openAuthModal("register")}
                  className="px-4 py-2 text-sm font-semibold bg-brand-red hover:bg-brand-red-light rounded-md text-white shadow-sm transition-all"
                  id="btn-register-trigger"
                >
                  註冊會員
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu Trigger */}
          <div className="flex lg:hidden items-center gap-3">
            {user && (
              <div className="text-xs bg-warm-200 px-3 py-1.5 rounded-full border border-warm-300 text-warm-800 max-w-[120px] truncate">
                {user.displayName || "貴賓"}
              </div>
            )}
            <button
              onClick={onMobileMenuToggle}
              className="p-2 rounded-md hover:bg-warm-200 text-warm-800 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              id="btn-mobile-hamburger"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
