import Sidebar from "../../components/Sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApplyAdvisorByID, updateApplyAdvisor } from "../../app/Api";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ExternalLink, CheckCircle, XCircle } from "lucide-react";

export default function AdminApproveForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: applyrows = [], isLoading } = useQuery({
    queryKey: ["applicationsByID", id],
    queryFn: () => fetchApplyAdvisorByID(id),
  });

  console.log(applyrows)
  

  const updateMutation = useMutation({
    mutationFn: updateApplyAdvisor,
    onSuccess: () => {
      queryClient.invalidateQueries(["applications"]);
      alert("สถานะถูกอัปเดตเรียบร้อยแล้ว");
      navigate("/admin/Approve");
    },
  });

  const handleSubmit = (id, status) => {
    if (window.confirm(`คุณแน่ใจใช่ไหมที่จะ ${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'} คำขอนี้?`)) {
      updateMutation.mutate({ id, status });
    }
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 ml-64">
      <div className="animate-pulse font-medium text-gray-400">Loading details...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Sidebar />

      <main className="ml-64 pt-10 px-10 pb-20">
        <div className="max-w-4xl mx-auto">
          
          {/* BACK BUTTON */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium text-sm"
          >
            <ChevronLeft size={18} /> Back to List
          </button>

          {applyrows.map((app) => (
            <div key={app.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* HEADER SECTION */}
              <div className="bg-white border-b border-gray-50 p-8 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-800">
                    {app.Fname} {app.Lname}
                  </h1>
                  <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mt-1">
                    {app.TypesName || "General Advisor"}
                  </p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${
                  app.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  app.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                  {app.status}
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                  
                  <Field label="Email Address" value={app.email} />
                  <Field label="Years of Experience" value={`${app.experience_years} Years`} />
                  <Field label="License Number" value={app.license_number} />
                  <Field label="Specialization" value={app.TypesName} />

                  {/* DOCUMENT LINKS */}
                  <div className="space-y-4 col-span-2 mt-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Verification Documents</h3>
                    <div className="flex gap-6">
                      {
                        app.portfolio_url != "" &&(
                          <DocLink label="Portfolio" url={app.portfolio_url} />
                        )
                      }
                      {
                        app.certificate_url != "" &&(
                          <DocLink label="Certificate" url={app.certificate_url} />
                        )
                      } 
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="col-span-2 flex justify-end gap-4 mt-8 pt-8 border-t border-gray-50">
                    <button
                      onClick={() => handleSubmit(app.id, "rejected")}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-rose-600 border-2 border-rose-50 hover:bg-rose-50 transition-all active:scale-95"
                    >
                      <XCircle size={18} /> Reject
                    </button>

                    <button
                      onClick={() => handleSubmit(app.id, "approved")}
                      className="flex items-center gap-2 px-10 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                    >
                      <CheckCircle size={18} /> Approve Advisor
                    </button>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="text-gray-700 font-semibold text-lg">
        {value || <span className="text-gray-300 font-normal">Not provided</span>}
      </div>
    </div>
  );
}

function DocLink({ label, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
    >
      <span className="font-bold text-gray-600 group-hover:text-blue-600">{label}</span>
      <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500" />
    </a>
  );
}