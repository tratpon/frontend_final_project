import { useState, useEffect } from "react";
import NavbarAdvisor from "../../components/NavbarAdvisor";
import Footer from "../../components/Footer";
import { fetchMyAdvisorProfile, updateMyProfile, fetchadvisorrating } from "../../app/Api";
import { useQuery, useMutation } from "@tanstack/react-query";


const StatCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 border rounded-2xl p-6 w-full bg-white">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
        </div>
    </div>
);

const ServiceCard = () => (
    <div className="flex justify-between items-center border rounded-2xl p-6 bg-white w-full">
        <div>
            <p className="font-semibold">service name</p>
            <p className="text-sm text-gray-500">Invested Amount</p>
            <p className="font-semibold">$150,000</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-gray-500">user Number</p>
            <p className="font-semibold">1,250</p>
        </div>
    </div>
);


export default function AdvisorProfile() {

    const [form, setForm] = useState({
        Username: "",
        Fadvisor: "",
        Ladvisor: "",
        Gender: "",
        Age: "",
        Email: "",
        Phone: ""
    });

    const [editMode, setEditMode] = useState(false);

    // 🔵 FETCH
    const { data } = useQuery({
        queryKey: ["myProfile"],
        queryFn: fetchMyAdvisorProfile
    });
    
    const { data: rating } = useQuery({
        queryKey: ["advisorRating"],
        queryFn: () => fetchadvisorrating()
    });
    useEffect(() => {
        if (data) {
            setForm(data.data || data); // รองรับกรณี backend ส่ง {role, data}
        }
    }, [data]);

    // 🟡 MUTATION
    const updateMutation = useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            alert("Updated!");
            setEditMode(false);
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

        if (!editMode) {
            setEditMode(true);
            return;
        }

        updateMutation.mutate(form);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarAdvisor />

            <div className="flex grap max-w-4xl mx-auto pt-10">

                <div className="bg-white border rounded-2xl p-8">

                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl">
                            👤
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <Field label="Username" name="Username" value={form.Username} disabled />
                        <div></div>

                        <Field label="First Name" name="Fname" value={form.Fadvisor} onChange={handleChange} disabled={!editMode} />
                        <Field label="Last Name" name="Lname" value={form.Ladvisor} onChange={handleChange} disabled={!editMode} />

                        <Field label="Gender" name="Gender" value={form.Gender} onChange={handleChange} disabled={!editMode} />
                        <Field label="Age" name="Age" value={form.Age} onChange={handleChange} disabled={!editMode} />

                        <Field label="Phone" name="Phone" value={form.Phone} onChange={handleChange} disabled={!editMode} />
                        <Field label="Email" name="Email" value={form.Email} disabled />

                    </div>

                    <div className="flex justify-end mt-6 gap-4">
                        {editMode && (
                            <button
                                onClick={() => {
                                    setForm(data.data || data);
                                    setEditMode(false);
                                }}
                                className="bg-gray-400 text-white px-6 py-2 rounded-full"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            onClick={handleSubmit}
                            className={`px-8 py-2 rounded-full text-white
                                ${editMode ? "bg-blue-600" : "bg-green-600"}`}
                        >
                            {editMode ? "Submit" : "Edit"}
                        </button>
                    </div>


                </div>
                {/* Stats + Top Service */}
                <div className="space-y-6">
                    <StatCard
                        label="Total Invested Amount"
                        value="$150,000"
                        icon="💰"
                    />
                    <StatCard
                        label="user Number"
                        value="1,250"
                        icon="👥"
                    />

                    <div className="border rounded-2xl p-6 bg-white">
                        <h3 className="text-lg font-semibold mb-4">Top service</h3>
                        <div className="flex gap-4 overflow-x-auto">
                            <ServiceCard />
                            <ServiceCard />
                        </div>
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