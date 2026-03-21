import { useState, useEffect } from "react";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import Footer from "../../components/Footer";
import {
  fetchMyProfile,
  updateMyProfile,
  uploadImageMyProfile
} from "../../app/Api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "../../app/uploadImage";

export default function UserProfile() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    Username: "",
    Fname: "",
    Lname: "",
    Gender: "",
    Age: "",
    Email: "",
    Phone: "",
    imageUserUrl: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);

  const { data } = useQuery({
    queryKey: ["myProfile"],
    queryFn: fetchMyProfile
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      alert("Profile updated!");
      queryClient.invalidateQueries(["myProfile"]);
      setEditMode(false);
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImageMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["myProfile"]);
      alert("Image updated!");
    }
  });

  const handleUpload = async () => {
    if (!image) return alert("Please select image");

    const imageUserUrl = await uploadImage(image);
    if (!imageUserUrl) return;

    uploadImageMutation.mutate({ imageUserUrl });

    setForm({ ...form, imageUserUrl });
    setImage(null);
  };

  const handleSubmit = () => {
    if (!editMode) return setEditMode(true);
    updateMutation.mutate(form);
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarSwitcher />

      <div className="flex-1 py-6 sm:py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-4 sm:p-8 shadow-sm">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center mb-6">
            <label className="cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {form.imageUserUrl ? (
                  <img
                    src={form.imageUserUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "👤"
                )}
              </div>

              <input
                type="file"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>

            {image && (
              <button
                onClick={handleUpload}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm"
              >
                Upload Image
              </button>
            )}
          </div>

          {/* USERNAME */}
          <div className="mb-5"><Field label="Username" value={form.Username} disabled /></div>


          {/* FORM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Field label="First Name" name="Fname" value={form.Fname} onChange={handleChange} disabled={!editMode} />
            <Field label="Last Name" name="Lname" value={form.Lname} onChange={handleChange} disabled={!editMode} />
            <Field label="Gender" name="Gender" value={form.Gender} onChange={handleChange} disabled={!editMode} />
            <Field label="Age" name="Age" value={form.Age} onChange={handleChange} disabled={!editMode} />
            <Field label="Email" value={form.Email} disabled />
            <Field label="Phone" name="Phone" value={form.Phone} onChange={handleChange} disabled={!editMode} />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end mt-6 gap-4">

            {editMode && (
              <button
                onClick={() => {
                  setForm(data);
                  setEditMode(false);
                }}
                className="bg-gray-400 text-white px-6 py-2 rounded-full"
              >
                Cancel
              </button>
            )}

            <button
              onClick={handleSubmit}
              className={`px-8 py-2 rounded-full text-white ${editMode ? "bg-blue-600" : "bg-green-600"}`}
            >
              {editMode ? "Submit" : "Edit"}
            </button>

          </div>


        </div>
      </div>

      <Footer />
    </div>
  );
}

function Field({ label, name, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm mb-1">{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-gray-100 px-3 py-2 text-sm rounded border outline-none"
      />
    </div>
  );
}