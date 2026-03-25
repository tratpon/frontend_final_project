import Footer from "../../components/Footer";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { useQuery } from "@tanstack/react-query";
import { fetchHistoryUser } from "../../app/Api";
import { useState } from "react";
import ReviewModal from "./ReviewPage";

export default function History() {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const {
    data: history = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["Myhistory"],
    queryFn: fetchHistoryUser,
    refetchOnWindowFocus: false
  });
  console.log(history);
  

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarSwitcher />

      <h1 className="text-2xl sm:text-4xl font-bold text-center mt-10 mb-6">
        Completed History
      </h1>

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

      {/* Empty */}
      {!isLoading && history.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          No completed bookings yet.
        </div>
      )}

      {/* LIST */}
      <div className="flex flex-col grow gap-4 max-w-5xl mx-auto w-full px-4 mb-10">
        {history.map((booking) => (
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
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {booking.imageAdvisorUrl && (
                    <img
                      src={booking.imageAdvisorUrl}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <span className="font-semibold">
                  {booking.AdvisorName}
                </span>
              </div>

              <p className="text-gray-400">{booking.ServiceName}</p>
              <p>ราคา {booking.Price} บาท</p>

              <p className="text-sm text-gray-600">
                {new Date(booking.AvailableDate).toLocaleDateString()} |{" "}
                {booking.StartTime} - {booking.EndTime}
              </p>
            </div>

            {/* STATUS + RATE */}
            <div className="flex flex-col items-end">
              <p className="text-green-500 font-semibold">
                completed
              </p>

              <p className="font-bold mt-2">
                {new Date(booking.Created_at).toLocaleDateString("th-TH")}
              </p>

              {!booking.IsReviewed && (
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
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