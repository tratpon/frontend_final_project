import { useState, useEffect } from "react";
import NavbarAdvisor from "../../components/NavbarAdvisor";
import Footer from "../../components/Footer";
import {
    fetchMyAdvisorProfile,
    updateProfileAdvisor,
    fetchAdvisorDashboard,
    uploadImageAdvisor,
    uploadToCloudinary
} from "../../app/Api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Star, DollarSign, Users, User, Award, TrendingUp } from "lucide-react";

// 🔹 Stat Card (Modernized)
const StatCard = ({ icon, label, value, colorClass }) => (
    <div className="flex items-center gap-4 border border-slate-100 rounded-3xl p-5 w-full bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${colorClass} text-xl`}>
            {icon}
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-extrabold text-slate-800">{value}</p>
        </div>
    </div>
);

// 🔹 Service Card (Horizontal Scroll Ready)
const ServiceCard = ({ name, users, revenue }) => (
    <div className="flex flex-col justify-between border border-slate-100 rounded-2xl p-5 bg-slate-50 min-w-[240px] hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="mb-4">
            <div className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md w-fit mb-2 uppercase">Popular</div>
            <p className="font-bold text-slate-800 text-base line-clamp-1">{name}</p>
        </div>
        <div className="flex justify-between items-end border-t border-slate-200 pt-3">
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">รายได้รวม</p>
                <p className="font-extrabold text-slate-900">฿{Number(revenue).toLocaleString()}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">ลูกค้า</p>
                <p className="font-bold text-blue-600">{users} คน</p>
            </div>
        </div>
    </div>
);

export default function AdvisorProfile() {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        Username: "",
        Fadvisor: "",
        Ladvisor: "",
        Gender: "",
        Age: "",
        Email: "",
        Phone: "",
        imageAdvisorUrl: "",
        Promptpay: ""
    });

    const [editMode, setEditMode] = useState(false);
    const [image, setImage] = useState(null);

    // 🔵 Profile Data
    const { data, isLoading } = useQuery({
        queryKey: ["myProfile"],
        queryFn: fetchMyAdvisorProfile
    });

    // 🔵 Dashboard Data
    const { data: dataD } = useQuery({
        queryKey: ["advisorDashboard"],
        queryFn: fetchAdvisorDashboard
    });

    const uploadImageMutation = useMutation({
        mutationFn: uploadImageAdvisor,
        onSuccess: () => {
            queryClient.invalidateQueries(["myProfile"]);
            setImage(null);
            alert("เปลี่ยนรูปโปรไฟล์สำเร็จ!");
        }
    });

    const handleUpload = async () => {
        if (!image) return alert("กรุณาเลือกรูปภาพ");
        try {
            const response = await uploadToCloudinary(image);
            if (response.secure_url) {
                uploadImageMutation.mutate({ imageAdvisorUrl: response.secure_url });
                setForm({ ...form, imageAdvisorUrl: response.secure_url });
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการอัปโหลด");
        }
    };

    useEffect(() => {
        if (data) setForm(data.data || data);
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: updateProfileAdvisor,
        onSuccess: () => {
            alert("บันทึกข้อมูลเรียบร้อย!");
            setEditMode(false);
            queryClient.invalidateQueries(["myProfile"]);
        },
        onError: (err) => alert(err.response?.data?.message || err.message)
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!editMode) return setEditMode(true);
        updateMutation.mutate(form);
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-medium">กำลังโหลดข้อมูล...</div>;

    const stats = dataD?.stats;
    const rating = dataD?.rating;
    const services = dataD?.topService;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <NavbarAdvisor />

            <main className="grow py-8 px-4">
                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    
                    {/* LEFT: Profile Form */}
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-10 w-full lg:w-2/3 shadow-sm">
                        <h2 className="text-2xl font-extrabold text-slate-800 mb-8 flex items-center gap-2">
                            <User className="text-blue-600" /> ข้อมูลที่ปรึกษา
                        </h2>

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative group">
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center transition-transform group-hover:scale-105">
                                    {form.imageAdvisorUrl ? (
                                        <img src={form.imageAdvisorUrl} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <span className="text-5xl">👤</span>
                                    )}
                                </div>
                                <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg cursor-pointer hover:bg-blue-700 transition-colors border-2 border-white">
                                    <Camera size={18} />
                                    <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                                </label>
                            </div>

                            {image && (
                                <button
                                    onClick={handleUpload}
                                    className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all animate-bounce"
                                >
                                    ยืนยันการเปลี่ยนรูป
                                </button>
                            )}
                        </div>

                        {/* Form Body */}
                        <div className="space-y-6">
                            <Field label="ชื่อผู้ใช้งาน (Username)" name="Username" value={form.Username} disabled />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field label="ชื่อ" name="Fadvisor" value={form.Fadvisor} onChange={handleChange} disabled={!editMode} />
                                <Field label="นามสกุล" name="Ladvisor" value={form.Ladvisor} onChange={handleChange} disabled={!editMode} />
                                
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">เพศ</label>
                                    <select 
                                        name="Gender" 
                                        value={form.Gender}
                                        onChange={handleChange} 
                                        disabled={!editMode} 
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none appearance-none ${
                                            !editMode ? "bg-slate-50 border-slate-100 text-slate-400" : "bg-white border-blue-200 focus:border-blue-500 text-slate-700 shadow-sm"
                                        }`}
                                    >
                                        <option value="ชาย">ชาย</option>
                                        <option value="หญิง">หญิง</option>
                                        <option value="ไม่ระบุ">ไม่ระบุ</option>
                                        <option value="อื่นๆ">อื่นๆ</option>
                                    </select>
                                </div>

                                <Field label="อายุ" name="Age" type="number" value={form.Age} onChange={handleChange} disabled={!editMode} />
                                <Field label="เบอร์โทรศัพท์" name="Phone" type="number" value={form.Phone} onChange={handleChange} disabled={!editMode} />
                                <Field label="พร้อมเพย์ (สำหรับรับเงิน)" name="Promptpay" type="number" value={form.Promptpay} onChange={handleChange} disabled={!editMode} />
                            </div>
                            
                            <div className="pt-2">
                                <Field label="อีเมลติดต่อ" name="Email" value={form.Email} disabled />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end mt-10 gap-3">
                            {editMode && (
                                <button
                                    onClick={() => { setForm(data.data || data); setEditMode(false); }}
                                    className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors text-sm"
                                >
                                    ยกเลิก
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                className={`px-10 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 ${
                                    editMode ? "bg-blue-600 shadow-blue-100 hover:bg-blue-700" : "bg-slate-900 shadow-slate-100 hover:bg-slate-800"
                                }`}
                            >
                                {editMode ? "ตกลงและบันทึก" : "แก้ไขโปรไฟล์"}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Stats & Top Services */}
                    <div className="space-y-6 w-full lg:w-1/3">
                        <h3 className="text-lg font-bold text-slate-800 px-2 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-600" /> ภาพรวมบัญชี
                        </h3>
                      
                        <div className="grid grid-cols-1 gap-4">
                            <StatCard label="คะแนนเฉลี่ย" value={rating?.AvgRating || "0.0"} icon={<Star fill="currentColor" />} colorClass="text-amber-500 bg-amber-500/10" />
                            <StatCard label="รายได้ทั้งหมด" value={`฿${Number(stats?.TotalRevenue || 0).toLocaleString()}`} icon={<DollarSign />} colorClass="text-emerald-500 bg-emerald-500/10" />
                            <StatCard label="ลูกค้าที่ดูแล" value={`${stats?.TotalUsers || 0} คน`} icon={<Users />} colorClass="text-blue-500 bg-blue-500/10" />
                        </div>

                        {/* Top Services Horizontal Scroll Area */}
                        <div className="border border-slate-200 rounded-[2rem] p-6 bg-white shadow-sm">
                            <h3 className="text-md font-bold text-slate-800 mb-5 flex items-center gap-2">
                                <Award className="text-blue-600" size={18} /> บริการยอดนิยม
                            </h3>
                            <div className="flex flex-col gap-4 overflow-hidden">
                                {services?.length ? (
                                    services.map((service) => (
                                        <ServiceCard
                                            key={service.ServiceID}
                                            name={service.ServiceName}
                                            users={service.TotalBooking}
                                            revenue={service.Revenue}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-slate-400 text-sm italic">ยังไม่มีข้อมูลบริการ</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

// 🔹 Reusable Field Component
function Field({ label, name, value, onChange, disabled, type = "text" }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">{label}</label>
            <input
                name={name}
                value={value || ""}
                onChange={onChange}
                type={type}
                disabled={disabled}
                className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
                    disabled 
                        ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed" 
                        : "bg-white border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-slate-700 shadow-sm"
                }`}
            />
        </div>
    );
}