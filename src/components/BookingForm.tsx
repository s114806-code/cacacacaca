import React, { useState, useEffect } from "react";
import { PaymentType, Reservation } from "../types";
import { useAuth } from "../context/AuthContext";
import { Calendar, Users, Phone, Mail, User, Info, DollarSign, CreditCard, Landmark, Check } from "lucide-react";

interface BookingFormProps {
  onSubmit: (data: Omit<Reservation, "userId" | "createdAt" | "status">) => Promise<void>;
  prefilledDishName: string;
  clearPrefilledDish: () => void;
  onLoginClick: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  prefilledDishName,
  clearPrefilledDish,
  onLoginClick,
}) => {
  const { user } = useAuth();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(2);
  const [dateTime, setDateTime] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("現金");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync with user details when logged in
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Setup prefilled special requests if a dish was clicked
  useEffect(() => {
    if (prefilledDishName) {
      setNotes((prev) => {
        const preMsg = `我想預留特色菜式：【${prefilledDishName}】。`;
        if (prev.includes(preMsg)) return prev;
        return prev ? `${preMsg}\n${prev}` : preMsg;
      });
      clearPrefilledDish();
    }
  }, [prefilledDishName, clearPrefilledDish]);

  // Get minimum date-time (must be future time, at least current hour)
  const getMinDateTimeString = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const handleGuestsChange = (val: number) => {
    if (val < 1) return;
    if (val > 30) return; // reasonable cap
    setGuests(val);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name || !phone || !email || !dateTime || !paymentType) {
      alert("請完整填寫必填欄位。");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name,
        phone,
        email,
        guests,
        dateTime,
        paymentType,
        notes: notes.trim() || undefined,
      });
      setSuccess(true);
      // Reset non-user fields
      setPhone("");
      setDateTime("");
      setNotes("");
      setGuests(2);
    } catch (err) {
      console.error(err);
      alert("預約失敗，請重試或聯絡客服。");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-warm-300 shadow-md p-8 text-center max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center justify-center mx-auto shadow-sm">
          <Check className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-chinese-serif text-2xl font-bold text-warm-900">預約申請已送出！</h2>
          <p className="text-sm text-warm-850">
            感謝您的預訂，我們已收到您的訂位申請。您隨時可以在 <span className="font-semibold text-brand-red">「我的預約」</span> 中查看即時審核狀態。
          </p>
        </div>
        <div className="bg-warm-100 p-4 rounded-lg text-left text-xs text-warm-800 space-y-1">
          <p><strong>溫馨提示：</strong></p>
          <p>1. 餐廳將在30分鐘內發送簡訊/Email通知為您確認座席。</p>
          <p>2. 若需更改時間或人數，請先登入會員，並於預約時間前 2 小時線上退訂或致電客服變更。</p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="w-full sm:w-auto px-6 py-2.5 bg-brand-red hover:bg-brand-red-light text-white rounded font-chinese-serif font-bold text-sm shadow-md transition-colors cursor-pointer"
        >
          再訂一席
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto" id="booking-section-container">
      {/* Introduction column */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-brand-red/5 border border-brand-red/10 rounded-xl p-6 space-y-4">
          <h3 className="font-chinese-serif text-lg font-bold text-brand-red">
            閣下之席 · 靜候光臨
          </h3>
          <p className="text-xs sm:text-sm text-warm-800/95 leading-relaxed">
            頤和園秉持溫馨典雅的環境美學。為營造最安適的用餐氛圍，座位皆經過精心安排，保障隱私與寬敞動線。
          </p>
          <div className="space-y-3 pt-2 text-xs text-warm-850">
            <div className="flex gap-2">
              <span className="text-brand-gold font-bold">✦</span>
              <span><strong>包廂預約：</strong>10名以上可申請主題獨立包廂，無額外包廂費，僅需符合低消規章。</span>
            </div>
            <div className="flex gap-2">
              <span className="text-brand-gold font-bold">✦</span>
              <span><strong>食材備妥：</strong>若有特殊過敏、素食（蛋奶素/全素）需求，請於備註欄中告知。</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-warm-300 shadow-xs space-y-3">
          <h4 className="font-chinese-serif text-sm font-bold text-warm-950 flex items-center gap-1.5">
            <Info className="w-4.5 h-4.5 text-brand-gold" />
            訂位制度說明
          </h4>
          <ul className="text-xs text-warm-800/80 space-y-2 list-disc pl-4 font-sans leading-relaxed">
            <li>座席保留 15 分鐘，逾時將自動釋出座位給現場候補貴賓。</li>
            <li>基本消費：每人最低消費 $150 元（同行兒童不計）。</li>
            <li>付款支持現金、主流信用卡及多元行動支付。</li>
          </ul>
        </div>
      </div>

      {/* Booking Form Card Column */}
      <div className="lg:col-span-8">
        {!user ? (
          <div className="bg-white rounded-xl border border-warm-300 shadow-md p-8 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-chinese-serif text-xl font-bold text-warm-900">
                請先登入會員以進行訂位
              </h3>
              <p className="text-xs sm:text-sm text-warm-800/70 leading-relaxed">
                由於我們需要將訂位與您的專屬身份綁定，方便您進行「取消訂位」、「預留招牌菜」與管理多筆席位，請您先花費10秒鐘登入或註冊。
              </p>
            </div>
            <button
              onClick={onLoginClick}
              className="px-6 py-2.5 bg-brand-red hover:bg-brand-red-light text-white rounded font-chinese-serif font-bold text-sm shadow-md transition-all cursor-pointer"
              id="booking-unauth-login-btn"
            >
              登入 / 註冊會員
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-warm-300 shadow-lg p-6 sm:p-8">
            <div className="border-b border-warm-200 pb-4 mb-6">
              <h3 className="font-chinese-serif text-xl font-bold text-warm-900">
                預約雅座
              </h3>
              <p className="text-xs text-warm-805/60 mt-0.5">
                請填入確實的預約資訊，我們將在最短時間與您確認座席。
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-warm-900 mb-1.5 font-chinese-serif tracking-wider">
                    貴賓姓名 <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-850/40">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="張先生/林小姐"
                      className="w-full bg-warm-50 border border-warm-300 rounded-md pl-10 pr-4 py-2 text-sm text-warm-900 focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                      id="booking-input-name"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-warm-900 mb-1.5 font-chinese-serif tracking-wider">
                    連絡電話 <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-850/40">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912-345678"
                      className="w-full bg-warm-50 border border-warm-300 rounded-md pl-10 pr-4 py-2 text-sm text-warm-900 focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                      id="booking-input-phone"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-warm-900 mb-1.5 font-chinese-serif tracking-wider">
                    電子信箱 <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-850/40">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. customer@example.com"
                      className="w-full bg-warm-50 border border-warm-300 rounded-md pl-10 pr-4 py-2 text-sm text-warm-900 focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                      id="booking-input-email"
                    />
                  </div>
                </div>

                {/* DateTime */}
                <div>
                  <label className="block text-xs font-semibold text-warm-900 mb-1.5 font-chinese-serif tracking-wider">
                    預約日期及時間 <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      required
                      min={getMinDateTimeString()}
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full bg-warm-50 border border-warm-300 rounded-md px-3 py-2 text-sm text-warm-900 focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                      id="booking-input-datetime"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Guests counter */}
                <div>
                  <label className="block text-xs font-semibold text-warm-900 mb-1.5 font-chinese-serif tracking-wider">
                    預約人數 <span className="text-brand-red">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleGuestsChange(guests - 1)}
                      className="w-9 h-9 rounded-md border border-warm-300 bg-warm-100 hover:bg-warm-200 text-warm-850 font-bold flex items-center justify-center transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <div className="flex-1 bg-warm-50 border border-warm-300 rounded-md py-1.5 px-3 flex items-center justify-center gap-2">
                      <Users className="w-4 h-4 text-brand-gold" />
                      <span className="font-bold text-warm-900 text-sm">{guests} 人</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGuestsChange(guests + 1)}
                      className="w-9 h-9 rounded-md border border-warm-300 bg-warm-100 hover:bg-warm-200 text-warm-850 font-bold flex items-center justify-center transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Payment Class (RadioButton list or Selector) */}
                <div>
                  <label className="block text-xs font-semibold text-warm-900 mb-1.5 font-chinese-serif tracking-wider">
                    付款類別 <span className="text-brand-red">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(["現金", "信用卡", "行動支付"] as PaymentType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPaymentType(type)}
                        className={`py-2 px-1 text-xs font-semibold border rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          paymentType === type
                            ? "bg-brand-gold/15 border-brand-gold text-brand-gold"
                            : "bg-warm-50 border-warm-300 text-warm-800 hover:bg-warm-200"
                        }`}
                        id={`payment-type-btn-${type}`}
                      >
                        {type === "現金" && <DollarSign className="w-3.5 h-3.5" />}
                        {type === "信用卡" && <CreditCard className="w-3.5 h-3.5" />}
                        {type === "行動支付" && <Landmark className="w-3.5 h-3.5" />}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-semibold text-warm-900 mb-1.5 font-chinese-serif tracking-wider">
                  特別需求與菜式預留備註 (選填)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="例：需要兒童椅一座、壽星慶生、不吃牛、不加香菜、預留 signature 菜餚等..."
                  className="w-full bg-warm-50 border border-warm-300 rounded-md px-3.5 py-2.5 text-sm text-warm-900 focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                  id="booking-input-notes"
                />
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-red hover:bg-brand-red-light disabled:bg-warm-400 text-white font-chinese-serif font-bold py-3.5 px-4 rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer mt-4"
                id="booking-submit-btn"
              >
                {submitting ? "正在為您保留座席中..." : "確認送出雅座預約"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
