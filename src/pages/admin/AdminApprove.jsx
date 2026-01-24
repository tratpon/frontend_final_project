import { NavLink } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import Sidebar from "../../components/Sidebar";

export default function AdminApprove() {
  const items = [1, 2, 3, 4, 5];
  // กำหนดขนาดคอลัมน์เป็นตัวแปรเดียวเพื่อให้เรียกใช้ซ้ำได้แม่นยำ
  const gridTemplate = "grid grid-cols-[2fr_4fr_120px]"; 

  return (
    <div className="min-h-screen bg-gray-100"> {/* เปลี่ยนเป็น gray-100 จะดูสะอาดตาขึ้น */}
      <NavbarAdmin />
      <Sidebar />

      <main className="ml-64 pt-24 px-10 pb-10 space-y-4">
        {/* HEADER - ใช้ gridTemplate เดียวกัน */}
        <div className={`${gridTemplate} text-sm font-medium text-gray-500 px-6`}>
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800">
            Name <span className="text-[10px]">▼</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800">
            Categories <span className="text-[10px]">▼</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800">
            Status <span className="text-[10px]">▼</span>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {items.map((_, index) => (
            <ApproveCard key={index} gridTemplate={gridTemplate} />
          ))}
        </div>
      </main>
    </div>
  );
}

function ApproveCard({ gridTemplate }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={gridTemplate}>
        
        {/* USER COLUMN */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg">
            👤
          </div>
          <div>
            <p className="font-semibold text-gray-800">Jane Doe</p>
            <p className="text-xs text-gray-400">Senior Designer</p>
          </div>
        </div>

        {/* CATEGORIES COLUMN */}
        <div className="flex items-center text-gray-600">
          UI/UX Design, Web App
        </div>

        {/* STATUS COLUMN */}
        <div className="flex items-center justify-center">
          <NavLink  to ="/admin/Approve/Form" className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium uppercase">
            In Process
          </NavLink>
        </div>


        
      </div>
    </div>
  );
}