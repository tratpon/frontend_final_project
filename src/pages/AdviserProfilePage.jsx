import { useNavigate, Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllServiceAdvisorByID, fetchDetailAdvisorByID } from "../app/Api";
import NavbarSwitcher from "../app/NavbarSwitcht";
import { User, Star, Award, BookOpen, Briefcase, GraduationCap, MapPin, Clock } from "lucide-react"; // ใช้ Icon เพื่อความโปร่ง

// ส่วนหัวข้อ Section ที่ดูสะอาดตาขึ้น
function Section({ title, icon: Icon, children }) {
    return (
        <div className="mt-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4 flex items-center gap-2">
                {Icon && <Icon size={14} />}
                {title}
                <span className="flex-1 h-px bg-gray-100" />
            </h4>
            {children}
        </div>
    );
}

export default function AdviserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: advisorData, isLoading } = useQuery({
        queryKey: ["advisorProfile", id],
        queryFn: () => fetchDetailAdvisorByID(id),
    });

    const { data: serviceData } = useQuery({
        queryKey: ["services", id],
        queryFn: () => fetchAllServiceAdvisorByID(id),
    });
    console.log(serviceData);
    
    const renderStars = (rating = 0) => {
        return (
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">
                        {i < Math.floor(rating) ? "★" : "☆"}
                    </span>
                ))}
            </div>
        );
    };

    const services = serviceData?.services ?? [];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-indigo-400">
                <div className="w-12 h-12 border-4 border-t-indigo-500 border-indigo-100 rounded-full animate-spin mb-4"></div>
                <p className="font-medium animate-pulse">กำลังโหลดข้อมูลผู้เชี่ยวชาญ...</p>
            </div>
        );
    }

    // ป้องกันกรณี data ผิดพลาด หรือไม่มีข้อมูล
    if (!advisorData || !advisorData.advisor?.[0]) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-500">ไม่พบข้อมูลผู้เชี่ยวชาญ</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">กลับไปก่อนหน้า</button>
            </div>
        );
    }

    const { advisor, skills = [], education = [], experience = [], rating = [] } = advisorData;
    const profile = advisor[0];
    const stats = rating[0] || { AverageRating: 0, ReviewCount: 0 };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <NavbarSwitcher />

            {/* Hero Banner Section */}
            <div className="w-full h-48 sm:h-64 md:h-80 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/60 z-10"></div>
                {services.length > 0 && services[0].ImageURL ? (
                    <img
                        src={services[0].ImageURL}
                        alt="banner"
                        className="w-full h-full object-cover blur-[2px] scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-indigo-600"></div>
                )}
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Sidebar Profile */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                            <div className="p-8 flex flex-col items-center text-center">
                                {/* Profile Image */}
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg ring-4 ring-indigo-50 overflow-hidden">
                                        {profile.imageAdvisorUrl ? (
                                            <img
                                                src={profile.imageAdvisorUrl}
                                                className="w-full h-full object-cover rounded-full"
                                                alt="profile"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <User size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                                </div>

                                {/* Name & Info */}
                                <h2 className="text-2xl font-extrabold text-gray-900">
                                    {profile.Fadvisor} {profile.Ladvisor}
                                </h2>
                                <p className="text-indigo-600 font-semibold text-sm mt-1 uppercase tracking-wide">
                                    {profile.TypesName}
                                </p>

                                {/* Rating Badge */}
                                <div className="mt-4 flex items-center gap-2 bg-yellow-50 px-4 py-1.5 rounded-full">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < Math.round(stats.AverageRating) ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <span className="text-yellow-700 font-bold text-sm">{stats.AverageRating || "0.0"}</span>
                                    <span className="text-gray-400 text-xs">({stats.ReviewCount} รีวิว)</span>
                                </div>

                                {/* Detailed Sections */}
                                <div className="w-full text-left">
                                    <Section title="เกี่ยวกับฉัน" icon={Award}>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {profile.Bio || "ยินดีให้คำปรึกษาและแลกเปลี่ยนประสบการณ์เพื่อช่วยให้คุณบรรลุเป้าหมายที่ตั้งไว้"}
                                        </p>
                                    </Section>

                                    <Section title="ทักษะที่เชี่ยวชาญ" icon={Briefcase}>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((s) => (
                                                <span key={s.SkillID} className="bg-indigo-50 text-indigo-700 text-[12px] px-3 py-1 rounded-md font-medium border border-indigo-100">
                                                    {s.Description}
                                                </span>
                                            ))}
                                        </div>
                                    </Section>

                                    <Section title="ประวัติการศึกษา" icon={GraduationCap}>
                                        <div className="space-y-4">
                                            {education.map((e) => (
                                                <div key={e.EducationID} className="relative pl-4 border-l-2 border-indigo-100">
                                                    <p className="text-sm font-bold text-gray-800">{e.Degree}</p>
                                                    <p className="text-xs text-gray-500">{e.University} • {e.GraduationYear}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Services Grid */}
                    <div className="lg:col-span-8 lg:mt-24">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">บริการทั้งหมด</h3>
                                <p className="text-gray-500 text-sm">เลือกบริการที่ตรงกับความต้องการของคุณเพื่อเริ่มปรึกษา</p>
                            </div>
                            <span className="bg-white px-4 py-1 rounded-full border text-sm font-medium text-gray-600 shadow-sm">
                                {services.length} รายการ
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <Link
                                    to={`/detail/${service.ServiceID}`}
                                    key={service.ServiceID}
                                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 flex flex-col"
                                >
                                    {/* Service Image */}
                                    <div className="relative h-44 overflow-hidden">
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold text-blue-600 shadow-sm">
                                                {service.TypesName}
                                            </span>
                                        </div>
                                        {service.ImageURL ? (
                                            <img
                                                src={service.ImageURL}
                                                alt={service.ServiceName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                                <BookOpen size={32} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Service Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                            {service.ServiceName}
                                        </h4>
                                         <div className="flex items-center gap-2 mb-3">
                                            {renderStars(service.AvgRating)}
                                            <span className="text-[10px] text-gray-400 font-medium">({service.ReviewCount} รีวิว)</span>
                                        </div>

                                        <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                                            {service.Front_Description}
                                        </p>

                                        {/* Price & Duration */}
                                        <div className="mt-auto pt-5 flex items-center justify-between border-t border-gray-50">
                                            <div className="flex items-center gap-1 text-gray-400">
                                                <Clock size={14} />
                                                <span className="text-xs font-medium">{service.Duration} นาที</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-black text-indigo-600">{Number(service.Price).toLocaleString()}</span>
                                                <span className="text-[10px] font-bold text-gray-400 ml-1">THB</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {services.length === 0 && (
                            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
                                <p className="text-gray-400">ขณะนี้ยังไม่มีรายการบริการเปิดให้จอง</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

// สร้างฟังก์ชัน Star เล็กๆ เพื่อใช้ในหน้า Card
function StarIcon({ rating }) {
    return (
        <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-xs font-bold text-gray-600">{rating}</span>
        </div>
    );
}