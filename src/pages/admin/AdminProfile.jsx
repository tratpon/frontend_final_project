import { fetchAdminProfile } from "../../app/Api"; // สมมติว่ามี API แยกสำหรับ Admin
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar";

export default function AdminProfile() {
  // ดึงข้อมูล Admin
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: fetchAdminProfile
  });

  if (isLoading) return <div className="text-center py-10">กำลังโหลด...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">เกิดข้อผิดพลาดในการดึงข้อมูล</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Sidebar/>
      <div className="flex-1  pl-60  sm:py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-4 sm:p-8 shadow-sm">
          
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Admin Information</h2>

          {/* PROFILE IMAGE (Read Only) */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border-2 border-blue-200">
              {data?.imageAdminUrl ? (
                <img src={data.imageAdminUrl} className="w-full h-full object-cover" alt="Admin" />
              ) : (
                <span className="text-4xl text-blue-500">🛡️</span>
              )}
            </div>
            <div className="mt-3">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                {data?.AdminLevel || "Admin"}
              </span>
            </div>
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ReadOnlyField label="Admin ID" value={data?.AdminID} />
            <ReadOnlyField label="Username" value={data?.Username} />
            <ReadOnlyField label="Promptpay" value={data?.Promptpay} />
            <ReadOnlyField label="Firebase UID" value={data?.FirebaseUID} />
          </div>

        
        </div>
      </div>

    
    </div>
  );
}

// Component ย่อยสำหรับแสดงข้อมูลแบบดูได้อย่างเดียว
function ReadOnlyField({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-2">
      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">{label}</label>
      <p className="text-sm md:text-base text-gray-800 font-medium">
        {value || "-"}
      </p>
    </div>
  );
}