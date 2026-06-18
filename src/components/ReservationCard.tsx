import React, { useState } from "react";
import { Reservation } from "../types";
import { Calendar, Users, Phone, Mail, CreditCard, ChevronRight, AlertCircle, RefreshCw, Trash2, ShieldCheck } from "lucide-react";

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: string) => Promise<void>;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onCancel }) => {
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancelClick = async () => {
    if (!reservation.id) return;
    setCancelling(true);
    try {
      await onCancel(reservation.id);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            已確認訂位
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 border border-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5" />
            已取消
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            受理中
          </span>
        );
    }
  };

  const formatDateTime = (dtStr: string) => {
    try {
      const dt = new Date(dtStr);
      if (isNaN(dt.getTime())) return dtStr;
      return dt.toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return dtStr;
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg border-2 shadow-sm p-5 sm:p-6 transition-all duration-200 ${
        reservation.status === "cancelled" 
          ? "border-warm-200 opacity-75" 
          : "border-warm-300 hover:border-brand-gold/60 hover:shadow-md"
      }`}
      id={`reservation-card-${reservation.id}`}
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-warm-200 pb-4 mb-4">
        <div>
          <span className="text-[11px] font-semibold text-warm-800/50 block tracking-wider uppercase font-chinese-serif">
            訂位編號 #{reservation.id?.substring(0, 8)}
          </span>
          <h4 className="text-base sm:text-lg font-chinese-serif font-bold text-warm-900 mt-0.5 flex items-center gap-2">
            {reservation.name} <span className="text-xs font-normal text-warm-800/60">大德</span>
          </h4>
        </div>
        <div>
          {getStatusBadge(reservation.status)}
        </div>
      </div>

      {/* Main Details */}
      <div className="space-y-3.5 text-xs sm:text-sm text-warm-800">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-brand-gold shrink-0" />
          <div>
            <p className="text-warm-800/50 text-[10px] uppercase font-bold leading-none mb-0.5">預約時間</p>
            <span className="font-semibold text-warm-900">{formatDateTime(reservation.dateTime)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-brand-gold shrink-0" />
            <div>
              <p className="text-warm-800/50 text-[10px] uppercase font-bold leading-none mb-0.5">預約人數</p>
              <span className="font-semibold text-warm-900">{reservation.guests} 人</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-brand-gold shrink-0" />
            <div>
              <p className="text-warm-800/50 text-[10px] uppercase font-bold leading-none mb-0.5">付款類別</p>
              <span className="font-semibold text-warm-900">{reservation.paymentType}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-warm-100">
          <div className="flex items-center gap-2.5">
            <Phone className="w-3.5 h-3.5 text-warm-800/40 shrink-0" />
            <span className="text-xs text-warm-800/80">{reservation.phone}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-3.5 h-3.5 text-warm-800/40 shrink-0 select-all" />
            <span className="text-xs text-warm-800/80 truncate">{reservation.email}</span>
          </div>
        </div>

        {reservation.notes && (
          <div className="mt-3.5 bg-warm-100/55 p-3 rounded border border-warm-200">
            <p className="text-[10px] font-bold text-warm-800/50 uppercase mb-1">特別需求備註</p>
            <p className="text-xs text-warm-800/90 leading-normal italic">
              「 {reservation.notes} 」
            </p>
          </div>
        )}
      </div>

      {/* Footer / Cancel Logic */}
      {reservation.status !== "cancelled" && (
        <div className="mt-5 pt-4 border-t border-warm-200 flex justify-end">
          {showConfirm ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-brand-red flex items-center gap-1 mr-auto sm:mr-2">
                <AlertCircle className="w-4 h-4" /> 確定取消訂位嗎？
              </span>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 border border-warm-450 bg-white hover:bg-warm-100 text-xs font-semibold rounded text-warm-800 transition-colors cursor-pointer"
                disabled={cancelling}
              >
                返回
              </button>
              <button
                onClick={handleCancelClick}
                className="px-3.5 py-1.5 bg-brand-red hover:bg-brand-red-light text-white text-xs font-semibold rounded flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                disabled={cancelling}
              >
                {cancelling ? "正在取消..." : "確認取消"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-3.5 py-1.5 border border-brand-red/30 text-brand-red hover:bg-brand-red hover:text-white rounded text-xs font-semibold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
              id={`btn-cancel-reservation-${reservation.id}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              取消此筆預約
            </button>
          )}
        </div>
      )}
    </div>
  );
};
