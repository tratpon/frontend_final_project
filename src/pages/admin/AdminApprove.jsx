import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { fetchApplyAdvisor } from "../../app/Api";
import { useState } from "react";

export default function AdminApprove() {

  const [statusFilter, setStatusFilter] = useState("pending");

  const gridTemplate = "grid grid-cols-[2fr_2fr_120px] items-center";

  const { data: applyrows = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplyAdvisor,
    refetchInterval: 5000
  });

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };

  if (isLoading) return <p className="p-10">Loading...</p>;

  // 🔥 filter
  const filteredData =
    statusFilter === "all"
      ? applyrows
      : applyrows.filter((item) => item.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-100">

    
      <Sidebar />

      <main className="ml-64 pt-10 px-10 pb-10 space-y-4">

        {/* 🔥 FILTER BUTTON */}
        <div className="flex gap-3 mb-4">
          {["pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
                statusFilter === status
                  ? "bg-blue-500 text-white"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* HEADER */}
        <div className="grid grid-cols-[2fr_2fr_100px] text-sm font-medium text-gray-500 px-6">
          <div>Name</div>
          <div>Categories</div>
          <div>Status</div>
        </div>

        {/* LIST */}
        <div className="space-y-3">

          {filteredData.map((item) => {
            
            const Wrapper = item.status === "pending" ? NavLink : "div";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition"
              >

                <Wrapper
                  to={
                    item.status === "pending"
                      ? `/admin/Approve/Form/${item.id}`
                      : undefined
                  }
                  className={`${gridTemplate} ${
                    item.status !== "pending"
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >

                  {/* USER */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg">
                      👤
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.Fname} {item.Lname}
                      </p>

                      <p className="text-xs text-gray-400">
                        {item.experience_years} years experience
                      </p>
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div className="flex items-center text-gray-600">
                    {item.TypesName}
                  </div>

                  {/* STATUS */}
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${statusColor[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </div>

                </Wrapper>
              </div>
            );
          })}

          {/* EMPTY */}
          {filteredData.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              ไม่มีข้อมูล
            </div>
          )}

        </div>

      </main>
    </div>
  );
}