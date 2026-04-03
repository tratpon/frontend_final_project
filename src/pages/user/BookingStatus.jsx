import Footer from "../../components/Footer";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBookingsByUser, cancelBooking } from "../../app/Api";
import { useState } from "react";
import { Calendar, Clock, User, AlertCircle, XCircle } from "lucide-react";

export default function BookingStatus() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const queryClient = useQueryClient();

  const {
    data: bookings = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchBookingsByUser,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(["myBookings"]);
      alert("ยกเลิกการจองเรียบร้อยแล้ว");
    },
  });

  const filtered = bookings.filter((b) => {
    if (statusFilter === "refunded") return b.BillStatus === "refunded";
    if (b.BillStatus === "refunded") return false;
    return b.Status === statusFilter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
      case "confirmed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "rejected": return "bg-rose-50 text-rose-600 border-rose-100";
      case "refunded": return "bg-purple-50 text-purple-600 border-purple-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const handleCancel = (bookId) => {
    if (window.confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่? ระบบจะทำการคืนเงินตามนโยบายของแพลตฟอร์ม")) {
      cancelMutation.mutate({ bookingID: bookId });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavbarSwitcher />

      <main className="flex-1 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <header className="text-center mt-12 mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800">สถานะการจองของฉัน</h1>
            <p className="text-slate-500 mt-2">ตรวจสอบและจัดการนัดหมายทั้งหมดของคุณได้ที่นี่</p>
          </header>

          {/* FILTER TABS */}
          <div className="flex justify-center gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit mx-auto overflow-x-auto max-w-full">
            {[
              { id: "pending", label: "รอดำเนินการ" },
              { id: "confirmed", label: "ยืนยันแล้ว" },
              { id: "rejected", label: "ถูกปฏิเสธ" },
              { id: "refunded", label: "ขอคืนเงิน" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${statusFilter === s.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-500 hover:bg-slate-50"
                  }`}
              >
                <span className="capitalize">{s.label}</span>
                <span className="ml-2 text-[10px] opacity-60">
                  ({bookings.filter(b => s.id === 'refunded' ? b.BillStatus === 'refunded' : (b.Status === s.id && b.BillStatus !== 'refunded')).length})
                </span>
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-20 text-slate-400">กำลังโหลดข้อมูล...</div>
            ) : error ? (
              <div className="text-center py-20 text-rose-500 flex flex-col items-center gap-2">
                <AlertCircle size={40} />
                <p>เกิดข้อผิดพลาดในการดึงข้อมูล</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-400 font-medium">ไม่พบรายการจองในหมวดหมู่นี้</p>
              </div>
            ) : (
              filtered.map((booking) => {
                const displayStatus = booking.BillStatus === "refunded" ? "refunded" : booking.Status;

                return (
                  <div
                    key={booking.BookID}
                    className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="hidden sm:flex w-12 h-12 bg-blue-50 rounded-xl items-center justify-center text-blue-600 shrink-0">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{booking.AdvisorName}</h3>
                        <p className="text-blue-600 text-sm font-medium mb-2">{booking.ServiceName}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-xs sm:text-sm">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} /> {booking.Date || "ไม่ระบุวันที่"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} /> {booking.StartTime} - {booking.EndTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-0 border-slate-50">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold border capitalize ${getStatusStyle(displayStatus)}`}>
                        {displayStatus}
                      </div>

                      {displayStatus === "confirmed" && (
                        <button
                          onClick={() => handleCancel(booking.BookID)}
                          disabled={cancelMutation.isLoading}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-xs font-bold"
                        >
                          <XCircle size={14} />
                          {cancelMutation.isLoading ? "กำลังยกเลิก..." : "ยกเลิกการจอง"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}