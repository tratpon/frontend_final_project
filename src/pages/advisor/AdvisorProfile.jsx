import { useState, useEffect } from "react";
import NavbarAdvisor from "../../components/NavbarAdvisor";
import Footer from "../../components/Footer";
import {
    fetchMyAdvisorProfile,
    updateProfileAdvisor,
    fetchAdvisorDashboard
} from "../../app/Api";
import { useQuery, useMutation } from "@tanstack/react-query";

// 🔹 Stat Card
const StatCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 border rounded-2xl p-4 md:p-6 w-full bg-white">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gray-100">
            {icon}
        </div>
        <div>
            <p className="text-xs md:text-sm text-gray-500">{label}</p>
            <p className="text-lg md:text-xl font-semibold">{value}</p>
        </div>
    </div>
);

// 🔹 Service Card (FIXED + Responsive)
const ServiceCard = ({ name, users, revenue }) => (
    <div className="flex justify-between items-center border rounded-2xl p-4 bg-white min-w-[220px] md:min-w-[260px]">
        <div>
            <p className="font-semibold text-sm md:text-base">{name}</p>
            <p className="text-xs md:text-sm text-gray-500">Revenue</p>
            <p className="font-semibold">${revenue}</p>
        </div>
        <div className="text-right">
            <p className="text-xs md:text-sm text-gray-500">Users</p>
            <p className="font-semibold">{users}</p>
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
        Phone: "",
        imageAdvisorUrl: "",
        Promptpay: ""
    });

    const [editMode, setEditMode] = useState(false);

    // 🔵 Profile
    const { data, isLoading } = useQuery({
        queryKey: ["myProfile"],
        queryFn: fetchMyAdvisorProfile
    });

    // 🔵 Dashboard (FIXED)
    const { data: dataD } = useQuery({
        queryKey: ["advisorDashboard"],
        queryFn: fetchAdvisorDashboard
    });

    const stats = dataD?.stats;
    const rating = dataD?.rating;
    const services = dataD?.topService;
    console.log(stats, rating, services);


    useEffect(() => {
        if (data) {
            setForm(data.data || data);
        }
    }, [data]);

    // 🟡 Update
    const updateMutation = useMutation({
        mutationFn: updateProfileAdvisor,
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

    if (isLoading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavbarAdvisor />

            <main className="grow">
                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto pt-6 px-4">
                    {/* Profile */}
                    <div className="bg-white border rounded-2xl p-6 md:p-8 w-full lg:w-2/3">
                        {/* Avatar */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                {form.imageAdvisorUrl ? (
                                    <img
                                        src={form.imageAdvisorUrl}
                                        className="w-full h-full object-cover"
                                        alt="profile"
                                    />
                                ) : "👤"}
                            </div>
                        </div>
                        {/* Form */}
                        <div className=" mb-5">
                            <Field label="Username" name="Username" value={form.Username} disabled />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <Field label="First Name" name="Fadvisor" value={form.Fadvisor} onChange={handleChange} disabled={!editMode} />
                            <Field label="Last Name" name="Ladvisor" value={form.Ladvisor} onChange={handleChange} disabled={!editMode} />
                            <div>
                                <label label="Gender" className="block text-sm mb-1">Gender</label>
                                <select label="Gender" name="Gender" onChange={handleChange} disabled={!editMode} className="w-full bg-gray-100 px-4 py-2 rounded border text-sm md:text-base">
                                    <option value="ชาย">ชาย</option>
                                    <option value="หญิง">หญิง</option>
                                    <option value="ไม่ระบุ">ไม่ระบุ</option>
                                    <option value="อื่นๆ">อื่นๆ</option>
                                </select>
                            </div>
                            <Field label="Age" name="Age" type='number' value={form.Age} onChange={handleChange} disabled={!editMode} />
                            <Field label="Phone" name="Phone" type='number' value={form.Phone} onChange={handleChange} disabled={!editMode} />
                            <Field label="Promptpay" name="Promptpay" type='number' value={form.Promptpay} onChange={handleChange} disabled={!editMode} />
                            <Field label="Email" name="Email" value={form.Email} disabled />
                        </div>
                        {/* Buttons */}
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
                    {/* Stats + Services */}
                    <div className="space-y-6 w-full lg:w-1/3">
                        <StatCard label="Rating" value={rating?.AvgRating || 0} icon="⭐" />
                        <StatCard label="Total Revenue" value={`$${stats?.TotalRevenue || 0}`} icon="💰" />
                        <StatCard label="Total Users" value={stats?.TotalUsers || 0} icon="👥" />
                        {/* Services */}
                        <div className="border rounded-2xl p-4 md:p-6 bg-white">
                            <h3 className="text-lg font-semibold mb-4">Top Service</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {services?.length ? (
                                    services.map((service) => (
                                        <ServiceCard
                                            key={service.ServiceID}
                                            name={service.ServiceName}
                                            users={service.TotalBooking}
                                            revenue={service.Revenue}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-400">No service data</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// 🔹 Field
function Field({ label, name, value, onChange, disabled, type }) {
    return (
        <div>
            <label className="block text-sm mb-1">{label}</label>
            <input
                name={name}
                value={value || ""}
                onChange={onChange}
                type={type}
                disabled={disabled}
                className="w-full bg-gray-100 px-4 py-2 rounded border text-sm md:text-base"
            />
        </div>
    );
}