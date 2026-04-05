import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { fetchApplyAdvisor } from "../../app/Api";
import { useState } from "react";
import { UserCheck, Clock, XCircle, ChevronRight } from "lucide-react"; // แนะนำให้ลง lucide-react ครับ

export default function AdminApprove() {
  const [statusFilter, setStatusFilter] = useState("pending");

  // ปรับ Grid ให้ดูโปร่งขึ้น
  const gridTemplate = "grid grid-cols-[1fr_2fr_1.5fr_120px_40px] items-center";

  const { data: applyrows = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplyAdvisor,
    refetchInterval: 5000,
  });

  const statusStyle = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const statusIcon = {
    pending: <Clock size={14} />,
    approved: <UserCheck size={14} />,
    rejected: <XCircle size={14} />,
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 ml-64">
      <div className="animate-pulse font-medium text-gray-400">Loading Applications...</div>
    </div>
  );

  const filteredData = statusFilter === "all"
    ? applyrows
    : applyrows.filter((item) => item.status === statusFilter);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      <Sidebar />

      <main className="flex-1 ml-64 pt-10 px-10 pb-20">
        <div className="mx-auto ps-7">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Advisor Approval</h1>
            <p className="text-gray-500 text-sm">จัดการคำขอและตรวจสอบคุณสมบัติของผู้สมัคร</p>
          </header>

          {/* 🔥 FILTER TABS */}
          <div className="flex bg-white p-1.5 rounded-xl border border-gray-200 w-fit mb-8 shadow-sm">
            {["pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* HEADER TABLE */}
          <div className={`${gridTemplate} text-[13px] font-bold text-gray-400 px-8 mb-4 uppercase tracking-wider`}>
            <div>Applicant</div>
            <div>Specialization</div>
            <div>Experience</div>
            <div>Status</div>
            <div></div>
          </div>

          {/* LIST */}
          <div className="space-y-4">
            {filteredData.map((item) => {
              const isPending = item.status === "pending";
              const Wrapper = isPending ? NavLink : "div";

              return (
                <Wrapper
                  key={item.id}
                  to={isPending ? `/admin/Approve/Form/${item.id}` : undefined}
                  className={`group bg-white rounded-2xl border border-gray-200 p-5 shadow-sm transition-all duration-300 ${
                    isPending 
                    ? "hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 cursor-pointer" 
                    : "opacity-80 grayscale-[0.5]"
                  } ${gridTemplate}`}
                >
                  {/* USER INFO */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {item.Fname?.[0]}{item.Lname?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {item.Fname} {item.Lname}
                      </p>
                      <p className="text-[12px] text-gray-400 font-medium">ID: #{item.id}</p>
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div className="text-gray-600 font-medium text-sm">
                    {item.TypesName || "General Advisor"}
                  </div>

                  {/* EXPERIENCE */}
                  <div className="text-gray-500 text-sm flex items-center gap-2">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-bold">
                      {item.experience_years}
                    </span>
                    years in field
                  </div>

                  {/* STATUS BADGE */}
                  <div className="flex items-center">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${statusStyle[item.status]}`}>
                      {statusIcon[item.status]}
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  {/* ARROW ICON */}
                  <div className="flex justify-end text-gray-300 group-hover:text-blue-400 transition-colors">
                    {isPending && <ChevronRight size={20} />}
                  </div>
                </Wrapper>
              );
            })}

            {/* EMPTY STATE */}
            {filteredData.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-inner">
                <div className="text-4xl mb-4">📂</div>
                <h3 className="text-gray-800 font-bold">No applications found</h3>
                <p className="text-gray-400 text-sm">ไม่พบข้อมูลผู้สมัครในหมวดหมู่นี้</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}