import React from "react";
import { X, UtensilsCrossed, CalendarDays, Home, BookOpen, Clock, LogIn, LogOut, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  setView: (view: string) => void;
  openAuthModal: (mode: "login" | "register") => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  setView,
  openAuthModal,
}) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const navigateTo = (view: string) => {
    setView(view);
    onClose();
  };

  const handleMobileAuth = (mode: "login" | "register") => {
    openAuthModal(mode);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" id="mobile-sidebar-container">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-warm-50 shadow-2xl flex flex-col justify-between border-l border-warm-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-warm-300 bg-warm-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4.5 h-4.5" />
              </div>
              <span className="font-chinese-serif text-lg font-bold text-brand-red">
                頤和園訂位
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-warm-200 text-warm-800 transition-colors"
              id="sidebar-close-btn"
            >
              <X className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* User Info when logged in */}
          {user && (
            <div className="px-6 py-4 bg-warm-200/50 border-b border-warm-300">
              <p className="text-xs text-warm-800/60 font-medium">歡迎光臨，尊貴會員</p>
              <p className="text-base font-semibold text-warm-900 mt-0.5">{user.displayName || "親愛的貴賓"}</p>
              <p className="text-xs text-warm-800/70 mt-1">{user.email}</p>
            </div>
          )}

          {/* Navigation Links */}
          <div className="px-4 py-6 flex flex-col gap-2 font-chinese-serif">
            <button
              onClick={() => navigateTo("home")}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-left transition-all ${
                currentView === "home"
                  ? "bg-brand-red text-white font-semibold shadow-sm"
                  : "hover:bg-warm-200 text-warm-800"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>關於我們</span>
            </button>
            <button
              onClick={() => navigateTo("menu")}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-left transition-all ${
                currentView === "menu"
                  ? "bg-brand-red text-white font-semibold shadow-sm"
                  : "hover:bg-warm-200 text-warm-800"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>美味佳餚</span>
            </button>
            <button
              onClick={() => navigateTo("booking")}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-left transition-all ${
                currentView === "booking"
                  ? "bg-brand-red text-white font-semibold shadow-sm"
                  : "hover:bg-warm-200 text-warm-800"
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>線上訂位</span>
            </button>
            {user && (
              <button
                onClick={() => navigateTo("my-reservations")}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-left transition-all ${
                  currentView === "my-reservations"
                    ? "bg-brand-red text-white font-semibold shadow-sm"
                    : "hover:bg-warm-200 text-warm-800"
                }`}
              >
                <CalendarDays className="w-5 h-5" />
                <span>我的預約</span>
              </button>
            )}
          </div>
        </div>

        {/* Auth Actions in Footer */}
        <div className="p-6 border-t border-warm-300 bg-warm-100 flex flex-col gap-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-warm-400 bg-white hover:bg-warm-200 text-sm font-semibold text-warm-800 transition-all shadow-sm"
              id="sidebar-btn-logout"
            >
              <LogOut className="w-4 h-4 text-brand-red" />
              登出帳號
            </button>
          ) : (
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => handleMobileAuth("login")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-warm-400 bg-white hover:bg-warm-200 text-sm font-semibold text-warm-800 transition-all shadow-sm"
                id="sidebar-btn-login"
              >
                <LogIn className="w-4 h-4 text-brand-gold" />
                會員登入
              </button>
              <button
                onClick={() => handleMobileAuth("register")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-brand-red hover:bg-brand-red-light text-sm font-semibold text-white transition-all shadow-sm"
                id="sidebar-btn-register"
              >
                <UserPlus className="w-4 h-4" />
                建立新帳號
              </button>
            </div>
          )}
          <p className="text-center text-[10px] text-warm-800/40 font-medium">
            頤和園中餐廳 © 所有權利保留
          </p>
        </div>
      </div>
    </div>
  );
};
