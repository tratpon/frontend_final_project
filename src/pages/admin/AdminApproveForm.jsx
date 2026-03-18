import NavbarAdim from "../../components/NavbarAdmin";
import Sidebar from "../../components/Sidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchApplyAdvisorByID, updateApplyAdvisor } from "../../app/Api";
import { useNavigate, useParams } from "react-router-dom";


export default function AdminApproveForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: applyrows = [], isLoading } = useQuery({
    queryKey: ["applicationsByID", id],
    queryFn: () => fetchApplyAdvisorByID(id)
  });
  console.log(applyrows);

  const updateAmutation = useMutation({
    mutationFn: updateApplyAdvisor,
    onSuccess: () => {
      alert("Updated!");
    }
  });

  const handleSubmit = (id,status) => {
    updateAmutation.mutate({ id: id, status: status })
    navigate("../admin/Approve")
  }


  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">

      <NavbarAdim />
      <Sidebar />

      <main className="pl-70 pt-30 pr-10 space-y-10">

        {applyrows.map((app) => (
          <div
            key={app.id}
            className="bg-white p-8 rounded-xl shadow max-w-5xl mx-auto"
          >

            <div className="grid grid-cols-2 gap-x-20 gap-y-6">

              <Field label="Email" value={app.email} />
              <Field label="Field" value={app.TypesName} />

              <Field label="Experience (years)" value={app.experience_years} />
              <Field label="License Number" value={app.license_number} />
              <div>
                <label className="block text-sm mb-1">Portfolio</label>

                <a
                  href={app.portfolio_url}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View Portfolio
                </a>
              </div>

              <div>
                <label className="block text-sm mb-1">Certificate</label>

                <a
                  href={app.certificate_url}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View Certificate
                </a>
              </div>

              <Field label="Status" value={app.status} />

              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-4 mt-4">

                <button
                  onClick={() => handleSubmit(app.id,"approved") }
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() =>handleSubmit(app.id,"rejected")}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg"
                >
                  Reject
                </button>

              </div>

            </div>

          </div>
        ))}

      </main>

    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>

      <div className="w-full bg-gray-100 px-3 py-2 rounded border">
        {value || "-"}
      </div>
    </div>
  );
}