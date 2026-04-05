import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { fetchBookingsByAdvisor, mangeBooking, cancelBooking } from "../../app/Api";
import { CheckCircle2, XCircle, Clock, Calendar, User, MessageSquare, AlertCircle } from "lucide-react";

export default function AdvisorManageBooking() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["incomingBookings"],
    queryFn: fetchBookingsByAdvisor,
  });

  const updateMutation = useMutation({
    mutationFn: mangeBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["incomingBookings"] }),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["incomingBookings"] }),
  });

  const handleUpdate = (bookingID, status) => {
    updateMutation.mutate({ bookingID, status });
  };

  const handleCancel = (bookingID) => {
    if (confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?")) {
      cancelMutation.mutate({ bookingID });
    }
  };

  const incomingBookings = bookings.filter((job) => job.Status === "pending");
  const confirmedBookings = bookings.filter((job) => job.Status === "confirmed");

  // Reusable Booking Card Component
  const BookingCard = ({ job, type }) => (
    <div className={`group relative border transition-all duration-300 rounded-[2rem] p-6 ${
      type === 'pending' 
      ? "bg-white border-slate-100 shadow-sm hover:shadow-md" 
      : "bg-indigo-50/50 border-indigo-100"
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-none">{job.UserName}</h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">{job.ServiceName}</p>
          </div>
        </div>
        {type === 'confirmed' && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full uppercase tracking-wider">
            <CheckCircle2 size={10} /> Confirmed
          </span>
        )}
      </div>

      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={14} className="text-slate-400" />
          <span>{new Date(job.AvailableDate).toLocaleDateString('th-TH', { dateStyle: 'long' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={14} className="text-slate-400" />
          <span>{job.StartTime.slice(0, 5)} - {job.EndTime.slice(0, 5)} น.</span>
        </div>
        {job.note && (
          <div className="flex items-start gap-2 text-sm text-slate-500 bg-white/50 p-3 rounded-xl border border-slate-100 mt-2">
            <MessageSquare size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <span className="italic">"{job.note}"</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {type === 'pending' ? (
          <>
            <button
              onClick={() => handleUpdate(job.BookID, "confirmed")}
              disabled={updateMutation.isPending}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> ยืนยัน
            </button>
            <button
              onClick={() => handleUpdate(job.BookID, "rejected")}
              disabled={updateMutation.isPending}
              className="px-4 py-2.5 border border-slate-200 text-slate-400 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
            >
              <XCircle size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleCancel(job.BookID)}
            disabled={cancelMutation.isPending}
            className="w-full py-2.5 border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            {cancelMutation.isPending ? "กำลังดำเนินการ..." : "ยกเลิกนัดหมาย"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <NavbarSwitcher />

      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Management</h1>
            <p className="text-slate-500 font-medium">จัดการตารางนัดหมายและการตอบรับลูกค้าของคุณ</p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">กำลังโหลดข้อมูลการจอง...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* ================= LEFT: INCOMING ================= */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider">
                    งานที่รอการยืนยัน 
                    <span className="ml-2 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg text-sm">{incomingBookings.length}</span>
                </h2>
              </div>

              {incomingBookings.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-slate-400">
                  <AlertCircle size={48} className="mb-4 opacity-20" />
                  <p className="font-bold">ไม่มีรายการจองใหม่ในขณะนี้</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {incomingBookings.map((job) => (
                    <BookingCard key={job.BookID} job={job} type="pending" />
                  ))}
                </div>
              )}
            </div>

            {/* ================= RIGHT: CONFIRMED ================= */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-green-500 rounded-full" />
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider">ยืนยันแล้ว</h2>
              </div>

              {confirmedBookings.length === 0 ? (
                <div className="bg-slate-100/50 border border-slate-200 rounded-[2rem] py-10 flex flex-col items-center justify-center text-slate-400">
                  <p className="text-sm font-medium italic">ยังไม่มีงานที่ยืนยัน</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {confirmedBookings.map((job) => (
                    <BookingCard key={job.BookID} job={job} type="confirmed" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}