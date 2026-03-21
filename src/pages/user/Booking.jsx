import NavbarSwitcher from "../../app/NavbarSwitcht";
import Footer from "../../components/Footer";
import { fetchMyProfile, createBooking, fetchBookingDetail, createBill } from "../../app/Api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NotFound from "../NotFound";
export default function Booking() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const availabilityId = searchParams.get("availabilityId");

    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(false);
    const [note, setNote] =useState("")
  
    // 🔵 FETCH PROFILE
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ["myProfile"],
        queryFn: fetchMyProfile
    });
    console.log(profile);
    

    // 🔵 FETCH DETAIL
    const { data: detail, isLoading: detailLoading } = useQuery({
        queryKey: ["bookingDetail", availabilityId],
        queryFn: () => fetchBookingDetail(availabilityId),
        enabled: !!availabilityId
    });

    console.log(detail);
    
    // 🔴 SUBMIT
    const handleSubmit = async () => {
        if (loading) return;

        try {
            setLoading(true);

            // 1️⃣ create booking
            const booking = await createBooking({
                note,
                availabilityId
            });

            const bookId = booking.BookID;

            // refresh list
            queryClient.invalidateQueries({
                queryKey: ["incomingBookings", 1]
            });

            // 2️⃣ create bill
            const newBill = await createBill({
                bookId,
                amount: detail?.price || 0
            });

            // 3️⃣ set QR
            setBill(newBill);

            alert("Booking Success");
        } catch (err) {
            console.error(err);
            alert("Booking Failed");
        } finally {
            setLoading(false);
        }
    };

    // ⏳ LOADING
    if (profileLoading || detailLoading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if(detail?.Status == "booked"){
        return(<NotFound />)
    }
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <NavbarSwitcher />

            <main className="flex-1 px-16 py-12">
                <div className="max-w-xl mx-auto space-y-6">

                    {/* TITLE */}
                    <h2 className="text-lg font-semibold border-b pb-2">
                        Booking Detail
                    </h2>

                    {/* USER INFO */}
                    <div className="border-b py-2 text-sm space-y-2">
                        <p>ชื่อ: {profile?.Fname}</p>
                        <p>นามสกุล: {profile?.Lname}</p>
                        <p>อีเมล: {profile?.Email}</p>
                        <p>Phone: {profile?.Phone}</p>
                    </div>

                    {/* SERVICE DETAIL */}
                    <div className="text-sm space-y-2">
                        <p>{detail?.ServiceName}</p>
                        <p>{detail?.AdvisorName}</p>
                        <p>{detail?.Duration} minutes</p>
                        <p>
                            {detail?.AvailableDate}{" "}
                            {detail?.StartTime?.slice(0, 5)} -{" "}
                            {detail?.EndTime?.slice(0, 5)}
                        </p>
                    </div>

                    {/* NOTE */}
                    <div>
                        <label className="block text-sm mb-1">Note</label>
                        <input
                            name="Note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-gray-100 px-4 py-2 rounded border"
                        />
                    </div>

                    {/* PRICE */}
                    <div>
                        <h3 className="font-semibold">Price</h3>
                        <div className="flex justify-between border-b py-2 text-sm">
                            <span>Total</span>
                            <span>{detail?.price} บาท</span>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-6 py-2 rounded text-white ${
                            loading ? "bg-gray-400" : "bg-blue-600"
                        }`}
                    >
                        {loading ? "Processing..." : "Confirm Booking"}
                    </button>

                    {/* QR */}
                    {bill && (
                        <div className="mt-4 flex justify-center">
                            <img src={bill.QRCode} alt="PromptPay QR" />
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}