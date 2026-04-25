import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import NavbarSwitcher from "../app/NavbarSwitcht.jsx";
import Footer from "../components/Footer.jsx";
import { useQuery } from "@tanstack/react-query";
import { Star, StarHalf, User, MapPin, Calendar } from "lucide-react"; // แนะนำให้ใช้ lucide-react
import {
  fetchDetailService,
  fetchservicerating,
  fetchtopics
} from "../app/Api.js";
import BookingSidebar from "../components/BookingSidebar.jsx";

export default function DetailServicePage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);

  /* QUERY DATA */
  const { data } = useQuery({ queryKey: ["service", id], queryFn: () => fetchDetailService(id) });
  const { data: ratingData } = useQuery({ queryKey: ["serviceRating", id], queryFn: () => fetchservicerating(id) });
  
  const { data: topics } = useQuery({ queryKey: ["topics"], queryFn: fetchtopics });

  const service = data?.services?.[0];
  const images = data?.services || [];

 
  const rating = ratingData?.rating;
  const reviews = ratingData?.reviews || [];
  const topicRatings = ratingData?.topics || [];

  console.log(service);
  

  const topicList = topicRatings.length > 0 ? topicRatings : (topics || []).map(t => ({
    TopicName: t.TopicName,
    AvgScore: 0,
  }));

  /* STAR RENDERER */
  const renderStars = (score = 0) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => {
          const val = i + 1;
          if (score >= val) return <Star key={i} size={16} fill="currentColor" />;
          if (score >= val - 0.5) return <StarHalf key={i} size={16} fill="currentColor" />;
          return <Star key={i} size={16} className="text-gray-200" />;
        })}
      </div>
    );
  };

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400 font-medium">กำลังโหลดข้อมูลบริการ...</div>
    </div>
  );

  const mainImage = selectedImage || images?.[0]?.ImageURL;

  return (
    <div className="bg-[#fcfcfd]">
      <NavbarSwitcher />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* 1. GALLERY SECTION */}
            <section className="space-y-4">
              <div className="aspect-video w-full bg-gray-100 rounded-3xl overflow-hidden shadow-inner border border-gray-100">
                {mainImage ? (
                  <img src={mainImage} className="w-full h-full object-cover transition-all duration-500 hover:scale-105" alt="Service" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300 italic">No Image Available</div>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img) => (
                  <img
                    key={img.ImageID}
                    src={img.ImageURL}
                    onClick={() => setSelectedImage(img.ImageURL)}
                    className={`h-20 w-28 object-cover rounded-xl cursor-pointer transition-all ${
                      mainImage === img.ImageURL ? "ring-4 ring-blue-500 scale-95" : "opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
              
            </section>
            {/* 2. SERVICE DESCRIPTION */}
            <section className="space-y-4 px-2">
              <h3 className="text-lg font-black text-gray-800 uppercase tracking-wider border-l-4 border-blue-500 pl-4">รายละเอียดบริการ <p className="text-lg font-black text-blue-600">฿{service?.price || 0}</p></h3>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {service?.Full_Description}
                
              </div>
            </section>
            {/* 3. ADVISOR PROFILE CARD */}
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50">
                  {service?.imageAdvisorUrl ? (
                    <img src={service.imageAdvisorUrl} className="w-full h-full object-cover" alt="Advisor" />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-blue-50 text-blue-300"><User size={40} /></div>
                  )}
                </div>
                
              </div>

              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                    {service?.Fadvisor} {service?.Ladvisor}
                  </h2>
        
                </div>
                <p className="text-gray-500 leading-relaxed text-sm max-w-lg">
                  {service?.Bio || "ไม่มีข้อมูลประวัติส่วนตัว"}
                </p>
                <div className="pt-2">
                  <Link 
                    to={`/AdviserProfile/${service.advisorID}`}
                    className="inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    ดูโปรไฟล์ทั้งหมด <ChevronRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </section>

            

            {/* 4. RATING SUMMARY */}
            <section className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="text-center px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 min-w-[160px]">
                  <div className="text-4xl font-black text-gray-800">{rating?.AverageScore || "0.0"}</div>
                  <div className="my-2">{renderStars(rating?.AverageScore || 0)}</div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">จาก {rating?.ReviewCount || 0} รีวิว</div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-6 flex-1 w-full">
                  {topicList.map((topic) => (
                    <div key={topic.TopicName} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
                        <span>{topic.TopicName}</span>
                        <span className="text-gray-800">{topic?.AvgScore || 0}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-400 h-full transition-all duration-1000" 
                          style={{ width: `${(topic?.AvgScore / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </section>

            {/* 5. REVIEWS LIST */}
            <section className="space-y-6">
              <h3 className="text-lg font-black text-gray-800 uppercase tracking-wider border-l-4 border-blue-500 pl-4">รีวิวจากผู้ใช้จริง</h3>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="py-10 text-center text-gray-400 italic bg-gray-50 rounded-2xl border border-dashed border-gray-200 uppercase text-xs font-bold tracking-widest">
                    No reviews yet
                  </div>
                ) : (
                  reviews.map((review, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                            {review.Username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{review.Username}</p>
                            <p className="text-[10px] text-gray-400 font-medium">
                              {review?.Date ? new Date(review.Date).toLocaleDateString('th-TH', { dateStyle: 'long' }) : ""}
                            </p>
                          </div>
                        </div>
                        {renderStars(review?.AverageScore || 0)}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed italic">"{review.ReviewText}"</p>
                    </div>
                  ))
                )}
              </div>
              
            </section>

          </div>

          {/* RIGHT SIDEBAR (BOOKING) */}
          <aside className="hidden lg:block sticky top-24 h-fit">
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-50 overflow-hidden">
              <div className="bg-blue-600 p-6 text-white text-center font-black uppercase tracking-widest text-sm">
                Reservation
              </div>
              <div className="p-2">
                <BookingSidebar serviceID={id} />
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* MOBILE ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t p-4 md:hidden z-50 flex items-center justify-between">
        <div className="pl-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Starting Price</p>
          <p className="text-lg font-black text-blue-600">฿{service?.price || 0}</p>
        </div>
        <button
          onClick={() => setOpenBooking(true)}
          className="bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-blue-200 active:scale-95 transition-all"
        >
          จองบริการนี้
        </button>
      </div>

      {/* MOBILE MODAL */}
      {openBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end animate-in fade-in duration-300">
          <div className="bg-white w-full p-8 rounded-t-[40px] shadow-2xl relative animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" onClick={() => setOpenBooking(false)}></div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xl text-gray-800 uppercase tracking-tight">เลือกเวลาจอง</h2>
              <button className="text-gray-400 p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setOpenBooking(false)}>✕</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <BookingSidebar serviceID={id} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Helper icon
function ChevronRight({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
  );
}