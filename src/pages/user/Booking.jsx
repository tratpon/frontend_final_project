import NavbarSwitcher from "../../app/NavbarSwitcht";
import Footer from "../../components/Footer";
import { fetchMyProfile, createBooking, fetchBookingDetail,createBill } from "../../app/Api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Booking() {
    const [searchParams] = useSearchParams();
    const availabilityId = searchParams.get("availabilityId");
    const [bill, setBill] = useState(null);
    const [form, setForm] = useState({
        Fname: "",
        Lname: "",
        Email: "",
        Phone: "",
        Note: ""
    });

    const [editMode, setEditMode] = useState(false);
    // 🔵 FETCH PROFILE
    const { data } = useQuery({
        queryKey: ['myProfile'],
        queryFn: fetchMyProfile
    });

    const { data: detail, isLoading } = useQuery({
        queryKey: ["bookingDetail", availabilityId],
        queryFn: () => fetchBookingDetail(availabilityId),
        enabled: !!availabilityId
    });
    // 🟢 SET DATA เข้า form
    useEffect(() => {
        if (data) {
            setForm({
                Fname: data.Fname || "",
                Lname: data.Lname || "",
                Email: data.Email || "",
                Phone: data.Phone || "",
                Note: ""
            });
        }
    }, [data]);

    // 🟡 HANDLE CHANGE
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
    try {

        // 1️⃣ สร้าง Booking ก่อน
        const booking = await createBooking({
            availabilityId: availabilityId
        });

        const bookId = booking.BookID;


        // 2️⃣ เอาราคา service มาสร้าง bill
        const newBill = await createBill({
            bookId: bookId,
            amount: detail.price
        });

        // 3️⃣ เก็บ QR ลง state
        setBill(newBill);

        alert("Booking Success");

    } catch (err) {

        alert("Booking Failed");

    }
};

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <NavbarSwitcher />

            <main className="flex-1 px-16 py-12">
                <div className="grid grid-cols-3 gap-16 max-w-6xl mx-auto">

                    {/* FORM */}
                    <div className="col-span-2 space-y-6">
                        <h2 className="text-lg font-semibold">
                            Booking Form
                        </h2>

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

                        <Field
                            label="Note"
                            name="Note"
                            value={form.Note}
                            onChange={handleChange}
                            disabled={!editMode}
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className="bg-yellow-500 text-white px-6 py-2 rounded"
                            >
                                {editMode ? "Lock" : "Edit"}
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white px-6 py-2 rounded"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>

                    {/* DETAIL */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold border-b pb-2">
                                Booking Detail
                            </h2>

                            <div className="text-sm mt-4 space-y-2">
                                <p>{detail?.ServiceName}</p>
                                <p>{detail?.AdvisorName}</p>
                                <p>{detail?.Duration} minutes</p>
                                <p>
                                    {detail?.AvailableDate}{" "}
                                    {detail?.StartTime?.slice(0, 5)}
                                     - 
                                    {detail?.EndTime?.slice(0, 5)}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold">Price</h3>
                            <div className="flex justify-between border-b py-2 text-sm">
                                <span>Total</span>
                                <span>{detail?.price} บาท</span>
                            </div>
                        </div>
                        {bill && (
    <img src={bill.QRCode} alt="PromptPay QR" />
)}
                    </div>

                </div>
            </main>

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