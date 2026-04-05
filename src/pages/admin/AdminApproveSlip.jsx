import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar";
import { fetchBookingsByAdmin, updateStatusSlip } from "../../app/Api";
import { 
  RefreshCw, 
  User, 
  Calendar, 
  Image as ImageIcon, 
  CheckCircle, 
  XCircle, 
  CreditCard,
  Loader2,
  ExternalLink
} from "lucide-react";

export default function AdminApproveSlip() {
    const { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["pendingBookings"],
        queryFn: fetchBookingsByAdmin,
    });

    const handlestatus = async (BillID, status, AvailabilityID, bookingID) => {
        const confirmMessage = status === "paid" ? "ยืนยันการชำระเงิน?" : "ปฏิเสธหลักฐานการชำระเงิน?";
        if (!window.confirm(confirmMessage)) return;

        try {
            await updateStatusSlip({
                BillID,  
                status,
                AvailabilityID,
                bookingID
            });
            refetch(); 
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex">
            <Sidebar />

            <main className="flex-1 ml-72 p-10">
                {/* Header Section */}
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Payment Verification</h1>
                        <p className="text-slate-500 font-medium">ตรวจสอบสลิปการโอนเงินและยืนยันการจอง</p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={isLoading || isRefetching}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={isRefetching ? "animate-spin" : ""} />
                        Refresh List
                    </button>
                </header>

               

                {/* Grid Header */}
                <div className="hidden lg:grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-10 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <div>Customer</div>
                    <div>Service & Schedule</div>
                    <div>Transaction Date</div>
                    <div>Amount</div>
                    <div className="text-center">Evidence</div>
                    <div className="text-right">Decisions</div>
                </div>

                {/* List Body */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                             <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
                             <p className="text-slate-400 font-bold">กำลังโหลดรายการชำระเงิน...</p>
                        </div>
                    ) : data?.length > 0 ? (
                        data.map((item) => (
                            <div
                                key={item.BookID}
                                className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr_1.5fr] gap-4 items-center bg-white px-10 py-6 rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-md hover:border-indigo-100 transition-all group"
                            >
                                {/* User */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                        <User size={20} />
                                    </div>
                                    <span className="font-black text-slate-700">{item.UserName}</span>
                                </div>

                                {/* Service & Schedule */}
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-indigo-600 truncate">{item.ServiceName}</span>
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mt-1">
                                        <Calendar size={12} />
                                        {new Date(item.AvailableDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                                        <span className="text-slate-200">|</span>
                                        {item.StartTime.slice(0, 5)} - {item.EndTime.slice(0, 5)}
                                    </div>
                                </div>

                                {/* Transaction Date */}
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-600">
                                        {new Date(item.CreatedAt).toLocaleDateString('th-TH')}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        Time: {new Date(item.CreatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {/* Price */}
                                <div>
                                    <span className="text-lg font-black text-slate-800">฿{Number(item.Amount).toLocaleString()}</span>
                                </div>

                                {/* Slip Image */}
                                <div className="flex justify-center">
                                    <div className="relative group/slip">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-slate-50 flex items-center justify-center cursor-pointer transition-transform group-hover/slip:scale-110">
                                            {item.SlipURL ? (
                                                <img
                                                    src={item.SlipURL}
                                                    alt="Slip"
                                                    className="w-full h-full object-cover"
                                                    onClick={() => window.open(item.SlipURL, "_blank")}
                                                />
                                            ) : (
                                                <ImageIcon size={20} className="text-slate-300" />
                                            )}
                                        </div>
                                        {item.SlipURL && (
                                            <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-sm text-indigo-500 opacity-0 group-hover/slip:opacity-100 transition-opacity">
                                                <ExternalLink size={10} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 justify-end">
                                    <button
                                        className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm shadow-emerald-50"
                                        title="Approve"
                                        onClick={() => handlestatus(item.BillID, "paid", item.AvailabilityID, item.BookID)}
                                    >
                                        <CheckCircle size={20} />
                                    </button>
                                    <button
                                        className="p-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm shadow-red-50"
                                        title="Reject"
                                        onClick={() => handlestatus(item.BillID, "failed", item.AvailabilityID, item.BookID)}
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                            <CreditCard size={48} className="mx-auto mb-4 opacity-10" />
                            <p className="text-slate-400 font-bold text-lg">ไม่มีรายการที่รอการตรวจสอบ</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}