import { useState, useEffect } from "react";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import Footer from "../../components/Footer";
import { fetchMyProfile, updateMyProfile, uploadImageMyProfile } from "../../app/Api";
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

  // FETCH PROFILE
  const { data } = useQuery({
    queryKey: ["myProfile"],
    queryFn: fetchMyProfile
  });

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  // UPDATE PROFILE
  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      alert("Profile updated!");
      queryClient.invalidateQueries(["myProfile"]);
    },
    onError: (err) => {
      alert(err.response?.data?.message || err.message);
    }
  });

  // UPDATE IMAGE
  const uploadImageMutation = useMutation({
    mutationFn: uploadImageMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["myProfile"]);
      alert("Image updated!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || err.message);
    }
  });

  const handleUpload = async () => {

    if (!image) {
      alert("Please select an image");
      return;
    }

    const imageUserUrl = await uploadImage(image);

    if (!imageUserUrl) return;

    // update backend
    uploadImageMutation.mutate({imageUserUrl});

    // update frontend
    setForm({
      ...form,
      imageUserUrl: imageUserUrl
    });

    setImage(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {

    if (!editMode) {
      setEditMode(true);
      return;
    }

    updateMutation.mutate(form, {
      onSuccess: () => {
        setEditMode(false);
      }
    });

  };

  return (
    <div className="flex flex-col min-h-screen">

      <NavbarSwitcher />

      <div className="grow py-10">

        <div className="max-w-3xl mx-auto border rounded-2xl p-10">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center mb-6">

            <label className="cursor-pointer">

              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">

                {form.imageUserUrl ? (
                  <img
                    src={form.imageUserUrl}
                    className="w-full h-full object-cover"
                    alt="profile"
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
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Upload Image
              </button>
            )}

          </div>

          {/* USERNAME */}
          <div className="mb-6">
            <Field
              label="Username"
              name="Username"
              value={form.Username}
              onChange={handleChange}
              disabled
            />
          </div>

          {/* PROFILE FIELDS */}
          <div className="grid grid-cols-2 gap-6 mb-6">

            <Field
              label="First Name"
              name="Fname"
              value={form.Fname}
              onChange={handleChange}
              disabled={!editMode}
            />

            <Field
              label="Last Name"
              name="Lname"
              value={form.Lname}
              onChange={handleChange}
              disabled={!editMode}
            />

            <Field
              label="Gender"
              name="Gender"
              value={form.Gender}
              onChange={handleChange}
              disabled={!editMode}
            />

            <Field
              label="Age"
              name="Age"
              value={form.Age}
              onChange={handleChange}
              disabled={!editMode}
            />

            <Field
              label="Email"
              name="Email"
              value={form.Email}
              disabled
            />

            <Field
              label="Phone"
              name="Phone"
              value={form.Phone}
              onChange={handleChange}
              disabled={!editMode}
            />

          </div>

          {/* BUTTONS */}
          <div className="flex items-end">

            <button
              onClick={handleSubmit}
              className={`ml-auto px-12 py-3 rounded-full text-lg font-semibold
              ${editMode ? "bg-blue-600" : "bg-green-600"} text-white`}
            >
              {editMode ? "Submit" : "Edit"}
            </button>

            {editMode && (
              <button
                onClick={() => {
                  setForm(data);
                  setEditMode(false);
                }}
                className="mr-4 bg-gray-400 text-white px-6 py-3 rounded-full"
              >
                Cancel
              </button>
            )}

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}

function Field({ label, name, value, onChange, disabled }) {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1">{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-gray-100 px-4 py-2 rounded border"
      />
    </div>
  );
}