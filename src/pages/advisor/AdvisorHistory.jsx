import Footer from "../../components/Footer";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { useQuery } from "@tanstack/react-query";
import { fetchPayoutByAdvisor } from "../../app/Api";
import { useState } from "react";
import { Wallet, Clock, CheckCircle2, Search, FileText, Landmark } from "lucide-react";

export default function AdvisorPayoutHistory() {
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: payouts = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["advisorPayout"],
    queryFn: fetchPayoutByAdvisor,
    refetchOnWindowFocus: false
  });

  const filtered = payouts.filter((item) => {
    if (statusFilter === "all") return true;
    return item.Status === statusFilter;
  });



  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <NavbarSwitcher />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

        {/* HEADER SECTION */}
        <header className="mb-10 flex  md:flex-row md:items-end justify-center  gap-6">
          <div>
            <h1 className="text-3xl text-center font-black text-slate-800 tracking-tight">Payout History</h1>
            <p className="text-slate-500 font-medium">ติดตามรายได้และประวัติการโอนเงินทั้งหมดของคุณ</p>
          </div>
        </header>

        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-full sm:w-auto">
            {["all", "pending", "paid"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === status
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-slate-500 hover:bg-slate-50"
                  }`}
              >
                {status === 'all' ? 'ทั้งหมด' : status === 'pending' ? 'รอดำเนินการ' : 'จ่ายแล้ว'}
              </button>
            ))}
          </div>

        </div>


        {/* CONTENT AREA */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-medium animate-pulse">กำลังตรวจสอบประวัติการเงิน...</p>
          </div>
        ) : error ? (
          <div className="text-center p-10 bg-red-50 rounded-3xl border border-red-100 text-red-500">
            Error loading data. Please try again later.
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <FileText size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-slate-400 font-bold text-lg">ไม่พบข้อมูลในหมวดหมู่นี้</p>
          </div>
        ) : (
          <div className="space-y-4 mb-20">
            <div className="text-sm text-end text-slate-400 font-medium italic">
              พบรายการทั้งหมด {filtered.length} รายการ
            </div>
            {filtered.map((item) => (
              <div
                key={item.PayoutID}
                className="group bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6"
              >
                {/* 1. Date & Icon */}
                <div className="flex flex-row md:flex-col items-center justify-center bg-slate-50 rounded-2xl p-4 min-w-[100px]">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {new Date(item.AvailableDate).toLocaleDateString('th-TH', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-black text-slate-700 leading-none">
                    {new Date(item.AvailableDate).getDate()}
                  </span>
                </div>

                {/* 2. Details */}
                <div className="flex-1 text-center md:text-left">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Booking #{item.BookID}</p>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{item.ServiceName}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-xs">
                    <Clock size={12} />
                    <span>ข้อมูลนัดหมายสำเร็จ</span>
                  </div>
                </div>

                {/* 3. Financials */}
                <div className="flex gap-8 px-8 border-x border-slate-50 hidden lg:flex">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">ยอดจอง</p>
                    <p className="font-bold text-slate-600">{item.Amount} ฿</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">ค่าธรรมเนียม</p>
                    <p className="font-bold text-red-400">-{item.PlatformFee} ฿</p>
                  </div>
                </div>

                <div className="text-center md:text-right min-w-[120px]">
                  <p className="text-[10px] font-bold text-slate-400 mb-1 leading-none uppercase">รายได้สุทธิ</p>
                  <p className="text-2xl font-black text-green-600 tracking-tight leading-none">
                    {item.NetAmount} ฿
                  </p>
                </div>

                {/* 4. Status & Slip */}
                <div className="flex flex-col items-center md:items-end gap-3 min-w-[150px]">
                  {item.Status === "paid" ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
                      <CheckCircle2 size={12} />
                      Paid Success
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100">
                      <Clock size={12} />
                      Processing
                    </div>
                  )}

                  {item.PaidAt && (
                    <p className="text-[10px] text-slate-400 font-medium">โอนเมื่อ: {new Date(item.PaidAt).toLocaleDateString("th-TH")}</p>
                  )}
                </div>

                {/* 5. Slip Preview */}
                <div className="shrink-0">
                  {item.SlipURL ? (
                    <button
                      onClick={() => window.open(item.SlipURL)}
                      className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-sm hover:ring-4 hover:ring-indigo-50 transition-all group/slip"
                    >
                      <img src={item.SlipURL} alt="slip" className="w-full h-full object-cover transition-transform group-hover/slip:scale-110" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/slip:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Search size={16} />
                      </div>
                    </button>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 border border-dashed border-slate-200">
                      <Landmark size={20} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}