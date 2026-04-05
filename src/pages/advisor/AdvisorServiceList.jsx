import NavbarAdvisor from "../../components/NavbarAdvisor";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchServiceByAdvisor, deleteService } from "../../app/Api";
import DetailAdvisor from "../../components/advisor/DetailAdvisor";
import {
    Plus,
    Edit3,
    Trash2,
    Clock,
    Tag,
    ExternalLink,
    AlertCircle
} from "lucide-react";

export default function AdvisorServiceList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["serviceslist"],
        queryFn: fetchServiceByAdvisor,
    });

    const services = data?.services ?? [];
    console.log(services);

    const deleteMutation = useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["serviceslist"] });
        }
    });

    const handleDelete = (id) => {
        // สามารถเปลี่ยนเป็น Custom Modal ได้ภายหลัง
        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบริการนี้? ข้อมูลจะไม่สามารถกู้คืนได้")) {
            deleteMutation.mutate(id);
        }
    };

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

    return (
        <div className="min-h-screen bg-gray-50/50">
            <NavbarAdvisor />

            {/* Banner Section */}
            <div className="w-full h-48 md:h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/70 z-10"></div>
                {services.length > 0 && services[0].ImageURL ? (
                    <img
                        src={services[0].ImageURL}
                        alt="banner"
                        className="w-full h-full object-cover blur-sm scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-indigo-600"></div>
                )}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <h1 className="text-white text-3xl font-bold tracking-tight">จัดการบริการของคุณ</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-30 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Sidebar (Profile Info) */}
                    <div className="lg:col-span-4">
                        <DetailAdvisor />
                    </div>

                    {/* Right Content (Service List) */}
                    <div className="lg:col-span-8 lg:mt-28">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">รายการบริการทั้งหมด</h2>
                                <p className="text-sm text-gray-500">คุณสามารถเพิ่ม แก้ไข หรือลบบริการที่คุณให้คำปรึกษาได้ที่นี่</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            
                            {/* Service Cards */}
                            {services.map((service) => (
                                <div key={service.ServiceID} className="group bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 overflow-hidden flex flex-col h-full">

                                    {/* Image Area */}
                                    <div className="relative h-40 overflow-hidden">
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
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 font-light italic">No Image</div>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-800 line-clamp-1 flex-1">{service.ServiceName}</h3>
                                            <Link to={`/detail/${service.ServiceID}`} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                                <ExternalLink size={16} />
                                            </Link>
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            {renderStars(service.AvgRating)}
                                            <span className="text-[10px] text-gray-400 font-medium">({service.ReviewCount} รีวิว)</span>
                                        </div>

                                        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                            {service.Front_Description}
                                        </p>

                                        <div className="mt-auto space-y-3 pt-3 border-t border-gray-50">
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <Clock size={14} />
                                                    <span className="text-xs">{service.Duration} นาที</span>
                                                </div>
                                                <span className="font-bold text-indigo-600">{Number(service.Price).toLocaleString()} บาท</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/Advisor/ManegeService/${service.ServiceID}`)}
                                                    className="flex-1 flex items-center justify-center gap-1 bg-indigo-50 text-indigo-600 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                                                >
                                                    <Edit3 size={14} /> แก้ไข
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service.ServiceID)}
                                                    className="w-10 flex items-center justify-center bg-red-50 text-red-500 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Add New Service Card */}
                            <Link
                                to="/Advisor/ManegeService"
                                className="group h-full min-h-[350px] border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-indigo-500 hover:bg-white transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
                                    <Plus className="text-gray-400 group-hover:text-indigo-600" size={32} />
                                </div>
                                <span className="font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">เพิ่มบริการใหม่</span>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}