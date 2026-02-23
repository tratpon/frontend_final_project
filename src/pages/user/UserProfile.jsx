import { useState, useEffect } from "react";
import NavbarSwitcher from "../../app/NavbarSwitcht"
import Footer from "../../components/Footer";
import { fetchMyProfile, updateMyProfile } from "../../app/Api";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function UserProfile() {

    const [form, setForm] = useState({
        Username: "",
        Fname: "",
        Lname: "",
        Gender: "",
        Age: "",
        Email: "",
        Phone: ""
    });
    const [editMode, setEditMode] = useState(false);

    // 🔵 FETCH
    const { data } = useQuery({
        queryKey: ['myProfile'],
        queryFn: fetchMyProfile
    });


    useEffect(() => {
        if (data) {
            setForm(data);
        }
    }, [data]);

    // 🟡 MUTATION
    const updateMutation = useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            alert("Updated!");
        },
        onError: (err) => {
            alert(err.response?.data?.message || err.message);
        }
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {

        // 🟢 ถ้ายังไม่ได้ edit → เข้า edit mode ก่อน
        if (!editMode) {
            setEditMode(true);
            return;
        }

        // 🟡 ถ้าอยู่ edit mode → ยิง update
        updateMutation.mutate(form, {
            onSuccess: () => {
                alert("Updated!");
                setEditMode(false); // 🔒 lock กลับ
            }
        });
    };
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarSwitcher />
            <div className="grow py-10">
                <div className="min-h-sceen max-w-3xl mx-auto border rounded-2xl p-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            👤
                        </div>
                    </div>

                    <div className="mb-6">
                        <Field label="Username" name="Username" value={form.Username} onChange={handleChange} disabled/>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <Field label="First Name" name="Fname" value={form.Fname} onChange={handleChange} disabled={!editMode}/>
                        <Field label="Last Name" name="Lname" value={form.Lname} onChange={handleChange} disabled={!editMode}/>
                        <Field label="Gender" name="Gender" value={form.Gender} onChange={handleChange} disabled={!editMode}/>
                        <Field label="Age" name="Age" value={form.Age} onChange={handleChange} disabled={!editMode}/>
                        <Field label="Email" name="Email" value={form.Email} disabled />
                        <Field label="Phone" name="Phone" value={form.Phone} onChange={handleChange} disabled={!editMode} />


                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleSubmit}
                            className={`ml-auto px-12 py-3 rounded-full text-lg font-semibold
    ${editMode ? 'bg-blue-600' : 'bg-green-600'} text-white`}
                        >
                            {editMode ? "Submit" : "Edit"}
                        </button>
                        {editMode && (
                            <button
                                onClick={() => {
                                    setForm(data); // reset ค่าเดิม
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
    )
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