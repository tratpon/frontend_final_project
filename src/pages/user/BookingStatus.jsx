import Footer from "../../components/Footer";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingsByUser } from "../../app/Api";
import { useState } from "react";

export default function BookingStatus() {
  const [statusFilter, setStatusFilter] = useState("pending");

  const {
    data: bookings = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchBookingsByUser,
  });

  // ✅ เอาทุก status ยกเว้น completed
  const activeBookings = bookings.filter(
    (b) => b.Status !== "completed"
  );

  // ✅ filter ตามปุ่ม
  const filtered = activeBookings.filter(
    (b) => b.Status === statusFilter
  );

  const getColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "confirmed":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarSwitcher />

      <h1 className="text-3xl font-bold text-center mt-10 mb-6">
        My Bookings
      </h1>

      {/* FILTER */}
      <div className="flex justify-center gap-3 mb-6">
        {["pending", "confirmed", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full ${
              statusFilter === s
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && <div className="text-center">Loading...</div>}

      {/* Error */}
      {error && <div className="text-center text-red-500">Error</div>}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center text-gray-500">
          No bookings found
        </div>
      )}

      {/* LIST */}
      <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full px-4 mb-10">
        {filtered.map((booking) => (
          <div
            key={booking.BookID}
            className="bg-gray-100 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{booking.AdvisorName}</p>
              <p className="text-gray-400 text-sm">
                {booking.ServiceName}
              </p>
              <p className="text-sm">
                {booking.StartTime} - {booking.EndTime}
              </p>
            </div>

            <div className={`font-semibold ${getColor(booking.Status)}`}>
              {booking.Status}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}