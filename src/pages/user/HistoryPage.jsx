import Footer from "../../components/Footer";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingsByUser } from "../../app/Api";
import { useState } from "react";
import ReviewModal from "./ReviewPage";

export default function History() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: bookings = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchBookingsByUser,
    refetchOnWindowFocus: false
  });

  // 🎯 filter logic
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === "all") return true;
    console.log("Status:", booking.Status);
    return booking.Status === statusFilter;
    
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-gray-500";
      case "confirmed":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarSwitcher />

      <h1 className="text-2xl sm:text-4xl font-bold text-center mt-6 sm:mt-12 mb-6 sm:mb-4">
        History
      </h1>

      {/* ✅ FILTER BUTTONS */}
      <div className="flex justify-center gap-2 mb-6 flex-wrap px-4">
        {["all", "pending", "confirmed", "rejected", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm capitalize border transition
              ${
                statusFilter === status
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center mt-10">Loading...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-500 mt-10">
          Failed to load bookings
        </div>
      )}

      {/* Empty (no data at all) */}
      {!isLoading && bookings.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          No booking history found.
        </div>
      )}

      {/* Empty (after filter) */}
      {!isLoading && bookings.length > 0 && filteredBookings.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          No {statusFilter} bookings found.
        </div>
      )}

      {/* LIST */}
      <div className="flex flex-col grow gap-4 max-w-5xl mx-auto w-full px-4 mb-10">
        {filteredBookings.map((booking) => (
          <div
            key={booking.BookID}
            className="bg-gray-100 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center shadow-sm"
          >
            {/* IMAGE */}
            <div className="w-full sm:w-40 h-32 bg-gray-300 rounded-xl overflow-hidden flex items-center justify-center">
              {booking.ImageURL ? (
                <img
                  src={booking.ImageURL}
                  alt="Booking"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>📅</span>
              )}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {booking.imageAdvisorUrl ? (
                    <img
                      src={booking.imageAdvisorUrl}
                      alt="Advisor"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>

                <span className="font-semibold text-sm sm:text-base">
                  {booking.AdvisorName} 
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-1 sm:mb-2">
                {booking.ServiceName}
              </p>

              <p className="text-b-400 text-sm mb-1 sm:mb-2">
                ราคา {booking.Price} บาท
              </p>

              <p className="text-xs sm:text-sm text-gray-600">
                {new Date(booking.AvailableDate).toLocaleDateString()} |{" "}
                {booking.StartTime} - {booking.EndTime}
              </p>
            </div>

            {/* STATUS */}
            <div className="flex flex-col sm:items-end text-sm sm:text-base">
              <p
                className={`font-semibold capitalize ${getStatusColor(
                  booking.Status
                )}`}
              >
                {booking.Status}
              </p>

              <p className="font-bold mt-1 sm:mt-2">
                {new Date(booking.Created_at).toLocaleDateString("th-TH")}
              </p>

              {booking.Status === "completed" && !booking.IsReviewed && (
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="mt-2 sm:mt-3 px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition"
                >
                  ⭐ Rate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      <Footer />
    </div>
  );
}