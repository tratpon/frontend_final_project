import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import QRCode from "react-qr-code";
import { Upload, CheckCircle, Clock, Eye } from "lucide-react";
import {
    fetchPayout,
    updatePayoutWithSlip,
    uploadToCloudinary,
} from "../../app/Api";

export default function AdminPayout() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["Payout"],
        queryFn: fetchPayout,
        refetchInterval: 5000 // ช่วยให้ข้อมูลสดใหม่เสมอ
    });

    const payoutRows = data?.row || [];
    const [selectedFile, setSelectedFile] = useState({});
    const [activeTab, setActiveTab] = useState("pending");

    // Grid Template: สัดส่วนคอลัมน์ (Advisor | Amount | QR | Action)
    const gridTemplate = "grid grid-cols-[1.5fr_1fr_100px_1.5fr] items-center gap-6";

    const handleSubmit = async (payoutID) => {
        try {
            const file = selectedFile[payoutID];
            if (!file) return alert("กรุณาเลือกสลิปก่อนยืนยัน");

            const upslipFile = await uploadToCloudinary(file);
            await updatePayoutWithSlip({
                payoutID,
                upslipFile: upslipFile.url,
            });

            alert("บันทึกการโอนเงินสำเร็จ");
            setSelectedFile(prev => ({ ...prev, [payoutID]: null }));
            refetch();
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการอัปโหลด");
        }
    };

    if (isLoading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 ml-64">
            <div className="animate-pulse text-gray-400 font-bold">Loading Payouts...</div>
        </div>
    );

    const filteredPayouts = payoutRows.filter(item => item.PayoutStatus === activeTab);

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Sidebar />

            <main className="ml-64 pt-10 px-10 pb-20">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Payout Management</h1>
                    <p className="text-gray-500 text-sm">ตรวจสอบรายการถอนเงินและอัปโหลดสลิปเพื่อยืนยัน</p>
                </header>

                {/* 🔥 TABS FILTER */}
                <div className="flex bg-white p-1.5 rounded-xl border border-gray-200 w-fit mb-8 shadow-sm">
                    {["pending", "paid"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                                activeTab === tab
                                    ? tab === "pending" ? "bg-amber-500 text-white shadow-md" : "bg-emerald-500 text-white shadow-md"
                                    : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            {tab === "pending" ? "⏳ Pending" : "✅ Paid"}
                        </button>
                    ))}
                </div>

                {/* TABLE HEADER */}
                <div className={`${gridTemplate} px-8 mb-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]`}>
                    <div>Advisor Details</div>
                    <div>Net Amount</div>
                    <div className="text-center">QR Payout</div>
                    <div className="text-right pr-4">Action / Evidence</div>
                </div>

                {/* LIST */}
                <div className="space-y-4">
                    {filteredPayouts.map((item) => (
                        <div
                            key={item.PayoutID}
                            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className={gridTemplate}>
                                
                                {/* ADVISOR */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                        ID
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Advisor #{item.AdvisorID}</p>
                                        <p className="text-[11px] text-gray-400 font-medium">TXID: {item.PayoutID}</p>
                                    </div>
                                </div>

                                {/* AMOUNT */}
                                <div>
                                    <p className="text-xl font-black text-emerald-600">฿{item.NetAmount}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                        Fee: ฿{item.PlatformFee} | Total: ฿{item.Amount}
                                    </p>
                                </div>

                                {/* QR PREVIEW */}
                                <div className="flex justify-center group relative">
                                    <div className="p-1 bg-gray-50 border border-gray-200 rounded-lg cursor-zoom-in">
                                        <QRCode value={item.QRPayout || ""} size={45} />
                                    </div>
                                    {/* Tooltip Hover เพื่อดู QR ใหญ่ */}
                                    <div className="absolute bottom-full mb-3 hidden group-hover:block bg-white p-4 shadow-2xl border border-gray-100 rounded-2xl z-20 animate-in fade-in zoom-in-95">
                                        <QRCode value={item.QRPayout || ""} size={160} />
                                        <p className="text-[10px] text-center mt-2 font-bold text-gray-400">PromtPay QR</p>
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex justify-end gap-3">
                                    {activeTab === "pending" ? (
                                        <>
                                            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl border border-dashed border-gray-300 text-xs font-bold text-gray-500 transition-all">
                                                <Upload size={14} />
                                                {selectedFile[item.PayoutID] ? "Slip Selected" : "Attach Slip"}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        setSelectedFile({
                                                            ...selectedFile,
                                                            [item.PayoutID]: e.target.files[0],
                                                        })
                                                    }
                                                />
                                            </label>
                                            <button
                                                onClick={() => handleSubmit(item.PayoutID)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-100 transition-all active:scale-95"
                                            >
                                                Confirm Pay
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase">
                                                <CheckCircle size={12} /> Paid
                                            </span>
                                            <button 
                                                onClick={() => window.open(item.SlipURL, "_blank")}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                                title="View Evidence"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* EMPTY STATE */}
                    {filteredPayouts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="text-4xl mb-4 opacity-20">💸</div>
                            <h3 className="text-gray-400 font-bold tracking-tight">No {activeTab} payouts found</h3>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}