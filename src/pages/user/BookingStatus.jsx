import Footer from "../../components/Footer";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBookingsByUser, cancelBooking } from "../../app/Api";
import { useState } from "react";

export default function BookingStatus() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const queryClient = useQueryClient();

  const {
    data: bookings = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchBookingsByUser,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(["myBookings"]); // refresh list
    },
  });

  const activeBookings = bookings;

  const filtered = activeBookings.filter((b) => {
    if (statusFilter === "refunded") return b.BillStatus === "refunded";
    if (b.BillStatus === "refunded") return false;
    return b.Status === statusFilter;
  });

  const getColor = (status) => {
    switch (status) {
      case "pending": return "text-yellow-500";
      case "confirmed": return "text-green-500";
      case "rejected": return "text-red-500";
      case "refunded": return "text-purple-500";
      default: return "text-gray-500";
    }
  };

  const handleCancel = (bookId) => {
    if (confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?")) {
      cancelMutation.mutate({bookingID:bookId});
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarSwitcher />

      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mt-10 mb-6">สถานะการจอง</h1>

        {/* FILTER */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {["pending", "confirmed", "rejected", "refunded"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full capitalize ${
                statusFilter === s ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && <div className="text-center">โหลด...</div>}

        {/* Error */}
        {error && <div className="text-center text-red-500">Error</div>}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center text-gray-500">ไม่พบการจอง</div>
        )}

        {/* LIST */}
        <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full px-4 mb-10">
          {filtered.map((booking) => {
            const displayStatus =
              booking.BillStatus === "refunded" ? "refunded" : booking.Status;

            return (
              <div
                key={booking.BookID}
                className="bg-gray-100 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{booking.AdvisorName}</p>
                  <p className="text-gray-400 text-sm">{booking.ServiceName}</p>
                  <p className="text-sm">{booking.StartTime} - {booking.EndTime}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`font-semibold ${getColor(displayStatus)}`}>
                    {displayStatus}
                  </div>

                  {/* ปุ่มยกเลิกเฉพาะ confirmed */}
                  {displayStatus === "confirmed" && (
                    <button
                      onClick={() => handleCancel(booking.BookID)}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
                      disabled={cancelMutation.isLoading}
                    >
                      {cancelMutation.isLoading ? "กำลังยกเลิก..." : "ยกเลิก"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}