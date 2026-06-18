import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Mail, Lock, User, AlertCircle, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const { login, register, error, setError } = useAuth();

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen, setError]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "register" && !name)) {
      setError("請填寫所有必要欄位。");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onClose(); // Close modal upon successful authentication
      // Reset fields
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs" id="auth-modal-overlay">
      {/* Background click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-warm-50 rounded-lg w-full max-w-md border-2 border-brand-gold border-opacity-70 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-warm-200 text-warm-850 transition-colors cursor-pointer"
          id="btn-auth-close"
        >
          <X className="w-5.5 h-5.5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-semibold rounded-full font-chinese-serif tracking-widest mb-2.5">
            頤和尊貴會員
          </span>
          <h2 className="font-chinese-serif text-2xl font-bold text-warm-900 tracking-wide">
            {mode === "login" ? "歡迎回府預約" : "加入頤和尊饗"}
          </h2>
          <p className="text-xs text-warm-800/60 mt-1 font-chinese-serif">
            {mode === "login" ? "登入會員以管理您的預約及預留特色菜式" : "註冊會員享有餐飲預約與極致膳食尊榮"}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-md p-3.5 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-xs font-medium text-red-800 leading-normal">{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-warm-800 mb-1.5 font-chinese-serif uppercase tracking-wider">
                尊姓名諱 <span className="text-brand-red">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-800/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：張福臨"
                  required
                  className="w-full bg-white border border-warm-300 rounded-md pl-10 pr-4 py-2.5 text-sm text-warm-900 focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                  id="auth-input-name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-warm-800 mb-1.5 font-chinese-serif uppercase tracking-wider">
              電子信箱 <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-800/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vip@example.com"
                required
                className="w-full bg-white border border-warm-300 rounded-md pl-10 pr-4 py-2.5 text-sm text-warm-900 focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                id="auth-input-email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-warm-800 mb-1.5 font-chinese-serif uppercase tracking-wider">
              預約密碼 <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-800/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="六位字元以上之密碼"
                required
                className="w-full bg-white border border-warm-300 rounded-md pl-10 pr-4 py-2.5 text-sm text-warm-900 focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                id="auth-input-password"
              />
            </div>
          </div>

          {mode === "login" && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setEmail("vip@example.com");
                  setPassword("vip123456");
                  setError(null);
                }}
                className="text-xs font-semibold text-brand-gold hover:text-brand-gold-light hover:underline flex items-center gap-1 cursor-pointer"
                id="btn-auto-fill-demo"
              >
                ✦ 填入體驗測試帳號 (vip@example.com)
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-red hover:bg-brand-red-light disabled:bg-warm-400 text-white font-chinese-serif font-bold py-2.5 sm:py-3 px-4 rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer mt-2"
            id="auth-submit-btn"
          >
            <Sparkles className="w-4 h-4" />
            {submitting ? "正在儲存資訊..." : mode === "login" ? "尊榮登入" : "啟動尊榮會員"}
          </button>
        </form>

        {/* Mode Toggle Footer */}
        <div className="mt-6 pt-4 border-t border-warm-300 flex justify-center text-xs">
          {mode === "login" ? (
            <p className="text-warm-800/70">
              尚無會員帳號？{" "}
              <button
                onClick={() => setMode("register")}
                className="font-bold text-brand-red hover:underline ml-1 cursor-pointer"
                id="btn-switch-to-register"
              >
                立即註冊
              </button>
            </p>
          ) : (
            <p className="text-warm-800/70">
              已有會員身份？{" "}
              <button
                onClick={() => setMode("login")}
                className="font-bold text-brand-red hover:underline ml-1 cursor-pointer"
                id="btn-switch-to-login"
              >
                立即登入
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
