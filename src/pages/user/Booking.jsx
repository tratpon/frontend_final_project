import NavbarSwitcher from "../../app/NavbarSwitcht";
import Footer from "../../components/Footer";
import { fetchMyProfile, createBooking, fetchBookingDetail, createBill, uploadSlip, uploadToCloudinary } from "../../app/Api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  User, 
  Calendar, 
  Clock, 
  CreditCard, 
  ChevronRight, 
  FileText,
  Upload,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function Booking() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const availabilityId = searchParams.get("availabilityId");
    const billID = searchParams.get("billID");
    const [slipFile, setSlipFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // สำหรับแสดงรูปก่อนอัปโหลด
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState("");

    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ["myProfile"],
        queryFn: fetchMyProfile
    });

    const { data: detail, isLoading: detailLoading } = useQuery({
        queryKey: ["bookingDetail", availabilityId],
        queryFn: () => fetchBookingDetail(availabilityId),
        enabled: !!availabilityId
    });

    const handleSubmit = async () => {
        if (loading) return;
        try {
            setLoading(true);
            const booking = await createBooking({ note, availabilityId });
            const bookId = booking.BookID;

            queryClient.invalidateQueries({ queryKey: ["incomingBookings", 1] });

            const newBill = await createBill({
                bookId,
                amount: detail?.price || 0
            });
            
            navigate(`/Booking?availabilityId=${availabilityId}&billID=${newBill.BillID}`);
            setBill(newBill);
            
            queryClient.invalidateQueries({ queryKey: ["pendingBookings"] });
            alert("จองสำเร็จ กรุณาชำระเงินภายในเวลาที่กำหนด");
        } catch (err) {
            console.error(err);
            alert("Booking Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSlipFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUploadSlip = async () => {
        if (!slipFile) return;
        try {
            setUploading(true);
            const upslipFile = await uploadToCloudinary(slipFile);
            await uploadSlip({
                billId: billID || bill?.BillID,
                SlipURL: upslipFile.url
            });
            alert("ส่งหลักฐานสำเร็จ ระบบกำลังตรวจสอบ");
            navigate("../BookingStatus");
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการอัปโหลด");
        } finally {
            setUploading(false);
        }
    };

    if (profileLoading || detailLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/50 font-sans">
            <NavbarSwitcher />

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    
                    {/* LEFT SIDE: DETAILS */}
                    <div className="lg:col-span-3 space-y-6">
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                    <FileText size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">รายละเอียดการจอง</h2>
                            </div>

                            {/* Service Header */}
                            <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100/50">
                                <h3 className="text-lg font-black text-slate-800 mb-1">{detail?.ServiceName}</h3>
                                <p className="text-indigo-600 font-bold text-sm">Advisor: {detail?.AdvisorName}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่รับบริการ</p>
                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                        <Calendar size={16} className="text-slate-400" />
                                        {detail?.AvailableDate}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เวลา</p>
                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                        <Clock size={16} className="text-slate-400" />
                                        {detail?.StartTime?.slice(0, 5)} - {detail?.EndTime?.slice(0, 5)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">หมายเหตุ (ถ้ามี)</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="ระบุสิ่งที่ต้องการปรึกษาเบื้องต้น..."
                                    disabled={!!bill}
                                    className="w-full bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none h-28"
                                />
                            </div>
                        </section>

                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                    <User size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">ข้อมูลผู้จอง</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div>
                                    <p className="text-slate-400 font-bold mb-0.5 text-xs">ชื่อ-นามสกุล</p>
                                    <p className="font-black text-slate-700">{profile?.Fname} {profile?.Lname}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold mb-0.5 text-xs">เบอร์โทรศัพท์</p>
                                    <p className="font-black text-slate-700">{profile?.Phone || "-"}</p>
                                </div>
                                <div className="col-span-2 pt-2">
                                    <p className="text-slate-400 font-bold mb-0.5 text-xs">อีเมล</p>
                                    <p className="font-black text-slate-700">{profile?.Email}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT SIDE: PAYMENT & BILL */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 sticky top-10">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-6">สรุปยอดชำระ</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-slate-500 font-bold">
                                    <span>Service Fee</span>
                                    <span>฿{detail?.price}</span>
                                </div>
                                <div className="h-px bg-slate-100 w-full" />
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-slate-800">ยอดรวมทั้งสิ้น</span>
                                    <span className="text-2xl font-black text-indigo-600">฿{detail?.price}</span>
                                </div>
                            </div>

                            {!bill ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full group bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:bg-slate-200"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "ยืนยันการจอง"}
                                    {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                </button>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 text-center">
                                        <p className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-4">สแกนเพื่อจ่าย (PromptPay)</p>
                                        <img src={bill.QRCode} alt="PromptPay QR" className="mx-auto w-48 h-48 rounded-2xl shadow-sm border-4 border-white" />
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">แนบหลักฐานการโอน</p>
                                        
                                        <label className="relative block w-full aspect-video rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer overflow-hidden group">
                                            {previewUrl ? (
                                                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                                                    <Upload size={32} className="group-hover:-translate-y-1 transition-transform" />
                                                    <span className="font-bold text-xs uppercase tracking-wider">Select Image</span>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </label>

                                        <button
                                            onClick={handleUploadSlip}
                                            disabled={!slipFile || uploading}
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            {uploading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                                            {uploading ? "กำลังอัปโหลด..." : "ยืนยันการชำระเงิน"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}