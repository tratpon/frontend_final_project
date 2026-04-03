import Footer from "../../components/Footer";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { useQuery } from "@tanstack/react-query";
import { fetchHistoryUser } from "../../app/Api";
import { useState } from "react";
import ReviewModal from "./ReviewPage";
import { Calendar, Clock, Tag, CheckCircle2, Star, User } from "lucide-react";

export default function History() {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const {
    data: history = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["Myhistory"],
    queryFn: fetchHistoryUser,
    refetchOnWindowFocus: false
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavbarSwitcher />

      <main className="flex-1 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <header className="text-center mt-12 mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
              ประวัติการจอง
            </h1>
            <p className="text-slate-500 mt-2">รายการนัดหมายที่คุณใช้บริการเสร็จสิ้นแล้ว</p>
          </header>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <p>กำลังโหลดประวัติ...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-20 text-rose-500 bg-white rounded-3xl border border-rose-100 shadow-sm">
              <p className="font-bold">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
              <p className="text-sm opacity-70">โปรดลองใหม่อีกครั้งในภายหลัง</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && history.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2rem border border-dashed border-slate-300">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Calendar size={40} />
              </div>
              <p className="text-slate-400 font-medium text-lg">ยังไม่มีประวัติการจอง</p>
            </div>
          )}

          {/* LIST */}
          <div className="flex flex-col gap-6 w-full">
            {history.map((booking) => (
              <div
                key={booking.BookID}
                className="bg-white rounded-2rem p-5 sm:p-7 flex flex-col lg:flex-row gap-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group"
              >
                {/* IMAGE SECTION */}
                <div className="relative w-full lg:w-48 h-40 shrink-0 rounded-2xl overflow-hidden bg-slate-200">
                  {booking.ImageURL ? (
                    <img
                      src={booking.ImageURL}
                      alt="Service"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                      <Tag size={32} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-700 uppercase">Success</span>
                  </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center">
                        {booking.imageAdvisorUrl ? (
                          <img src={booking.imageAdvisorUrl} className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} className="text-blue-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{booking.AdvisorName}</h3>
                        <p className="text-blue-600 text-sm font-medium">{booking.ServiceName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={16} className="text-slate-400" />
                        <span>{new Date(booking.AvailableDate).toLocaleDateString("th-TH", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Clock size={16} className="text-slate-400" />
                        <span>{booking.StartTime} - {booking.EndTime}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-slate-800 font-bold">
                        <span className="text-sm font-normal text-slate-400">ราคาบริการ:</span>
                        <span className="text-lg">฿{Number(booking.Price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION SECTION */}
                <div className="flex lg:flex-col justify-between items-end lg:justify-end lg:min-w-[140px] border-t lg:border-t-0 lg:border-l border-slate-50 pt-4 lg:pt-0 lg:pl-6">
                  <div className="text-right hidden lg:block mb-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">จองเมื่อ</p>
                    <p className="text-xs font-bold text-slate-600 italic">
                      {new Date(booking.Created_at).toLocaleDateString("th-TH")}
                    </p>
                  </div>

                  {!booking.IsReviewed ? (
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-900 rounded-xl font-bold text-sm shadow-lg shadow-amber-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Star size={16} fill="currentColor" />
                      ให้คะแนนรีวิว
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                      <Star size={14} fill="currentColor" />
                      รีวิวแล้ว
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL */}
      {selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      <Footer />
    </div>
  );
}