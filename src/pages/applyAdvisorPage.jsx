import { useState } from "react";
import { useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";
import { applyAdvisor, fetchTypes } from "../app/Api";
import { useNavigate } from "react-router-dom";


export default function AdvisorApply() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    Fname: "",
    Lname: "",
    email: "",
    TypesID: "",
    experience_years: "",
    portfolio_url: "",
    certificate_url: "",
    license_number: ""
  });

  const { data: types = [] } = useQuery({
    queryKey: ["types"],
    queryFn: fetchTypes,

  })

  const mutation = useMutation({
    mutationFn: applyAdvisor,
    onSuccess: () => {
      queryClient.invalidateQueries(["applications"]);
      alert("Application submitted");
      navigate("../");
    }
  });

  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "final_project");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dncviozee/raw/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();
      console.log(data);

      setForm({
        ...form,
        [e.target.name]: data.secure_url
      });

    } catch (err) {
      console.log(err);
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "TypesID" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mutation.isPending) return;

    mutation.mutate(form);
  };

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white p-8 rounded-xl shadow w-full max-w-lg">

        <h2 className="text-xl font-bold mb-6">
          Apply to become an Advisor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <Field
            label="Fname"
            name="Fname"
            required
            value={form.Fname}
            onChange={handleChange}
          />
          <Field
            label="Lname"
            name="Lname"
            required
            value={form.Lname}
            onChange={handleChange}
          />

          <Field
            label="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />

          {/* Field */}
          <label className="block text-sm mb-1">
            Field
          </label>
          <select
            value={form.TypesID}
            name="TypesID"
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Field</option>

            {types.map((type) => (
              <option key={type.TypesID} value={type.TypesID}>
                {type.TypesName}
              </option>
            ))}
          </select>


          {/* Experience */}
          <Field
            label="Experience Years"
            name="experience_years"
            type="number"
            required
            value={form.experience_years}
            onChange={handleChange}
          />

          {/* Portfolio */}
          <div className="block text-sm mb-1">
            portfolio_url
          </div>
          <label className="h-24 border flex items-center justify-center cursor-pointer rounded bg-gay-100">
            {form.portfolio_url ? "Uploadted" : "+ Upload"}

            <input
              type="file"
              name="portfolio_url"
              hidden
              onChange={handleUpload}
            />

            {form.certificate_url && (
              <a
                href={form.certificate_url}
                target="_blank"
                className="text-blue-600 underline"
              >
                View Certificate
              </a>
            )}

          </label>

          {/* Certificate */}
          <div className="block text-sm mb-1">
            certificate_url
          </div>
          <label className="h-24 border flex items-center justify-center cursor-pointer rounded bg-gay-100">
            {form.certificate_url ? "Uploadted" : "+ Upload"}

            <input
              type="file"
              name="certificate_url"
              hidden
              onChange={handleUpload}
            />

            {form.certificate_url && (
              <a
                href={form.certificate_url}
                target="_blank"
                className="text-blue-600 underline"
              >
                View Certificate
              </a>
            )}

          </label>

          {/* License */}
          <Field
            label="License Number"
            name="license_number"
            value={form.license_number}
            onChange={handleChange}
          />
          {mutation.isPending ?(
            <button
              type="submit"
              className="w-full bg-gray-600 text-white py-2 rounded-lg"
            >
              Submiting......
            </button>
          ):( <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Application
            </button>)}


        </form>

      </div>

    </div>

  );
}

function Field({ label, name, value, onChange, required, type = "text" }) {

  return (
    <div>

      <label className="block text-sm mb-1">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded px-3 py-2"
      />

    </div>
  )

}