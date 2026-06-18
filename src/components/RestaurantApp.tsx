import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { Dish, Reservation } from "../types";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { HeroSection } from "./HeroSection";
import { DishCard } from "./DishCard";
import { BookingForm } from "./BookingForm";
import { ReservationCard } from "./ReservationCard";
import { AuthModal } from "./AuthModal";
import { 
  CalendarDays, 
  Sparkles, 
  Info, 
  Coffee, 
  UtensilsCrossed, 
  Award, 
  Clock, 
  MapPin, 
  Phone 
} from "lucide-react";

const RestaurantApp: React.FC = () => {
  const { user, logout } = useAuth();
  
  const [currentView, setView] = useState("home");
  const [menuItems, setMenuItems] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: "login" | "register" }>({
    isOpen: false,
    mode: "login"
  });
  
  const [prefilledDish, setPrefilledDish] = useState("");
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Load Menu from Node Express Backend
  useEffect(() => {
    const fetchMenu = async () => {
      setLoadingMenu(true);
      try {
        const response = await fetch("/api/menu");
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        } else {
          console.error("Backend menu load failed, status:", response.status);
        }
      } catch (err) {
        console.error("API error fetching menu from server.ts:", err);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, []);

  // Set up connection test
  useEffect(() => {
    // Only fetch reservations when user changes
    if (user) {
      fetchUserReservations();
    } else {
      setReservations([]);
    }
  }, [user]);

  // Load User Reservations from Firestore with local storage fallback
  const fetchUserReservations = async () => {
    if (!user) return;
    setLoadingReservations(true);
    const reservationsCol = "reservations";
    try {
      // Fetching live data for current authenticated user
      const q = query(
        collection(db, reservationsCol),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const list: Reservation[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...docSnap.data()
        } as Reservation);
      });
      setReservations(list);
      // Synchronize to localStorage backup
      localStorage.setItem(`yiheyuan_res_${user.uid}`, JSON.stringify(list));
    } catch (err) {
      console.warn("Firestore fetchUserReservations failed, falling back to local storage:", err);
      const localResStr = localStorage.getItem(`yiheyuan_res_${user.uid}`);
      if (localResStr) {
        try {
          setReservations(JSON.parse(localResStr));
        } catch {
          setReservations([]);
        }
      } else {
        setReservations([]);
      }
    } finally {
      setLoadingReservations(false);
    }
  };

  // Submit Reservation (Firestore creation with local fallback)
  const handleCreateReservation = async (
    bookingData: Omit<Reservation, "userId" | "createdAt" | "status">
  ) => {
    if (!user) {
      setAuthModalState({ isOpen: true, mode: "login" });
      return;
    }

    const reservationsCol = "reservations";
    const payload: Reservation = {
      userId: user.uid,
      ...bookingData,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    try {
      // Create in Firestore
      await addDoc(collection(db, reservationsCol), payload);
      
      // Refresh user reservation listings
      await fetchUserReservations();
    } catch (err) {
      console.warn("Firestore handleCreateReservation failed, falling back to local storage:", err);
      const key = `yiheyuan_res_${user.uid}`;
      const localRes = JSON.parse(localStorage.getItem(key) || "[]");
      const newItem = {
        id: "loc-" + Math.random().toString(36).substring(2, 9),
        ...payload
      };
      localRes.unshift(newItem);
      localStorage.setItem(key, JSON.stringify(localRes));
      
      // Update state directly
      setReservations(localRes);
    }
  };

  // Cancel Reservation (Firestore with local fallback)
  const handleCancelReservation = async (id: string) => {
    const reservationsCol = "reservations";
    
    // If it's a mock local item
    if (id.startsWith("loc-")) {
      const key = `yiheyuan_res_${user?.uid}`;
      const localRes = JSON.parse(localStorage.getItem(key) || "[]");
      const updated = localRes.map((r: any) => r.id === id ? { ...r, status: "cancelled" } : r);
      localStorage.setItem(key, JSON.stringify(updated));
      setReservations(updated);
      return;
    }

    try {
      const docRef = doc(db, reservationsCol, id);
      await updateDoc(docRef, {
        status: "cancelled"
      });
      // Update state directly
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
      );
    } catch (err) {
      console.warn("Firestore handleCancelReservation failed, updating locally:", err);
      // Fallback update
      const key = `yiheyuan_res_${user?.uid}`;
      const localRes = JSON.parse(localStorage.getItem(key) || "[]");
      const updated = localRes.map((r: any) => r.id === id ? { ...r, status: "cancelled" } : r);
      localStorage.setItem(key, JSON.stringify(updated));
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
      );
    }
  };

  const handleDishBookNow = (dishName: string) => {
    setPrefilledDish(dishName);
    setView("booking");
  };

  // Unique categories for filtering
  const categories = ["全部", ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredMenu = selectedCategory === "全部" 
    ? menuItems 
    : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col justify-between">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setView={setView}
        openAuthModal={(mode) => setAuthModalState({ isOpen: true, mode })}
        onMobileMenuToggle={() => setMobileMenuOpen(true)}
      />

      {/* Slide-out Sidebar on Mobile */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentView={currentView}
        setView={setView}
        openAuthModal={(mode) => setAuthModalState({ isOpen: true, mode })}
      />

      {/* Main Core Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentView === "home" && (
          <HeroSection
            onReserveClick={() => setView("booking")}
            onMenuClick={() => setView("menu")}
          />
        )}

        {currentView === "menu" && (
          <div className="space-y-8 animate-in fade-in duration-200" id="menu-view">
            {/* Menu Header */}
            <div className="text-center space-y-2 border-b border-warm-300 pb-6">
              <span className="text-brand-gold font-semibold text-xs tracking-widest font-chinese-serif uppercase">
                ✦ 經典御膳 · 品味傳奇 ✦
              </span>
              <h2 className="font-chinese-serif text-3xl font-bold text-warm-900 tracking-wide">
                美味佳餚菜單
              </h2>
              <p className="text-xs sm:text-sm text-warm-800/60 max-w-lg mx-auto leading-relaxed">
                融匯大江南北中式傳統，由主廚手作呈現。每一道佳餚背後都是爐火純青的大火香氣與慢火溫柔。
              </p>
            </div>

            {/* Category selection bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" id="categories-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border font-chinese-serif cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-brand-red border-brand-red text-white shadow-sm"
                      : "bg-white border-warm-300 text-warm-850 hover:bg-warm-120"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Loading / Empty / Responsive Grid */}
            {loadingMenu ? (
              <div className="flex items-center justify-center p-16">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-brand-red" />
              </div>
            ) : filteredMenu.length === 0 ? (
              <div className="text-center py-12 text-warm-900 font-medium">
                目前尚無該分類項目，敬請期待。
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredMenu.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onBookNow={handleDishBookNow}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === "booking" && (
          <div className="space-y-4 animate-in fade-in duration-200" id="booking-view">
            <BookingForm
              onSubmit={handleCreateReservation}
              prefilledDishName={prefilledDish}
              clearPrefilledDish={() => setPrefilledDish("")}
              onLoginClick={() => setAuthModalState({ isOpen: true, mode: "login" })}
            />
          </div>
        )}

        {currentView === "my-reservations" && (
          <div className="space-y-8 animate-in fade-in duration-200" id="reservations-view">
            {/* Header info */}
            <div className="border-b border-warm-300 pb-5 flex flex-wrap justify-between items-end gap-3">
              <div>
                <h2 className="font-chinese-serif text-2xl font-bold text-warm-900">
                  我的預約管理
                </h2>
                <p className="text-xs text-warm-800/60 mt-0.5">
                  在此查看您所有向頤和園遞出的訂位記錄與座席狀態。
                </p>
              </div>
              <button
                onClick={() => setView("booking")}
                className="px-4 py-2 bg-brand-gold hover:bg-brand-gold-light rounded text-white text-xs font-bold font-chinese-serif transition-colors"
              >
                + 預定新席位
              </button>
            </div>

            {/* Loading / Content */}
            {!user ? (
              <div className="text-center py-12">
                <p className="text-warm-800">請先登入以檢視您的預約紀錄。</p>
              </div>
            ) : loadingReservations ? (
              <div className="flex items-center justify-center p-16">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-brand-red" />
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-warm-300 space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-warm-200 flex items-center justify-center text-warm-800/50 mx-auto">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-chinese-serif text-base font-bold text-warm-950">
                    尚無任何預約紀錄
                  </h4>
                  <p className="text-xs text-warm-800/60 mt-1 max-w-xs mx-auto">
                    您目前沒有在頤和園成立過任何訂位申請唷。歡迎現在線上立即預約座席！
                  </p>
                </div>
                <button
                  onClick={() => setView("booking")}
                  className="px-5 py-2 bg-brand-red hover:bg-brand-red-light rounded text-xs font-bold text-white shadow-xs font-chinese-serif transition-all"
                >
                  開始訂位
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {reservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onCancel={handleCancelReservation}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Block */}
      <footer className="bg-warm-900 border-t-4 border-brand-gold py-10 sm:py-14 text-warm-100 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-chinese-serif text-xl font-bold tracking-wider text-warm-50 uppercase">
                頤和園
              </span>
            </div>
            <p className="text-xs text-warm-300 leading-relaxed max-w-sm">
              承載東方料理底蘊，在融合暖白美學的優雅客堂中，呈獻三十年老掌勺的主廚經典。
              致力為本地家庭提供一個尊榮、溫情、美味滿溢的聚餐雅座。
            </p>
          </div>

          <div className="md:col-span-3 space-y-3 font-chinese-serif">
            <h4 className="text-sm font-semibold text-brand-gold tracking-widest">餐飲客堂</h4>
            <ul className="text-xs text-warm-300 space-y-2">
              <li className="cursor-pointer hover:text-brand-gold" onClick={() => setView("home")}>關於我們</li>
              <li className="cursor-pointer hover:text-brand-gold" onClick={() => setView("menu")}>美味菜單</li>
              <li className="cursor-pointer hover:text-brand-gold" onClick={() => setView("booking")}>線上預約</li>
              {user && (
                <li className="cursor-pointer hover:text-brand-gold" onClick={() => setView("my-reservations")}>我的預約</li>
              )}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3 font-chinese-serif">
            <h4 className="text-sm font-semibold text-brand-gold tracking-widest">奉茶敬告</h4>
            <p className="text-xs text-warm-300">
              台北市大安區和諧路168號 <br/>
              預約服務專線：(02) 2345-6789 <br/>
              營業時間：每日 11:30 - 14:30 / 17:30 - 21:30
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-warm-800 text-center text-[10px] text-warm-400 font-medium">
          <p>頤和園中餐廳 © 2026 Yi He Yuan Chinese Family Restaurant. All Rights Reserved. </p>
          <p className="mt-1 font-chinese-serif">溫馨雅緻 · 世代流香</p>
        </div>
      </footer>

      {/* Auth Modal Modal Controller */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: "login" })}
      />
    </div>
  );
};

export default RestaurantApp;
