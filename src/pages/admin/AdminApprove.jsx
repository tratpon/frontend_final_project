import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import Sidebar from "../../components/Sidebar";
import { fetchApplyAdvisor } from "../../app/Api";



export default function AdminApprove() {
 

  const gridTemplate = "grid grid-cols-[2fr_2fr_120px]";

  const { data: applyrows = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplyAdvisor
  });
  console.log(applyrows);

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };

  if (isLoading) return <p>Loading...</p>;

  return (

    <div className="min-h-screen bg-gray-100">

      <NavbarAdmin />
      <Sidebar />

      <main className="ml-64 pt-24 px-10 pb-10 space-y-4">

        {/* HEADER */}
        <div className="grid grid-cols-[2fr_2fr_100px] text-sm font-medium text-gray-500 px-6">
          <div>Name</div>
          <div>Categories</div>
          <div>Status</div>
        </div>

        {/* LIST */}
        <div className="space-y-3">

          {applyrows.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >

              <NavLink
                to={`/admin/Approve/Form/${item.id}`}
                className={gridTemplate}
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
                  {item.field}
                </div>

                {/* STATUS */}
                <div className="flex items-center">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${statusColor[item.status]}`}
                  >
                    {item.status}
                  </span>

                </div>

              </NavLink>

            </div>

          ))}

        </div>

      </main>

    </div>

  );
}