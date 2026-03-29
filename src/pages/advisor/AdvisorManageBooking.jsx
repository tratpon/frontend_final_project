import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { fetchBookingsByAdvisor, mangeBooking, cancelBooking } from "../../app/Api";

export default function AdvisorManageBooking() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["incomingBookings"],
    queryFn: fetchBookingsByAdvisor,
  });

  // mutation สำหรับ Accept / Reject
  const updateMutation = useMutation({
    mutationFn: mangeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomingBookings"] });
    },
  });

  // mutation สำหรับ Cancel
  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomingBookings"] });
    },
  });

  const handleUpdate = (bookingID, status) => {
    updateMutation.mutate({ bookingID, status });
  };

  const handleCancel = (bookingID) => {
    if (confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?")) {
      cancelMutation.mutate({ bookingID });
    }
    
  };

  const incomingBookings = bookings.filter((job) => job.Status === "pending");
  const confirmedBookings = bookings.filter((job) => job.Status === "confirmed");

  return (
    <div>
      <NavbarSwitcher />

      <div className="max-w-7xl mx-auto p-6">
        {isLoading && <div className="text-gray-500 text-center">โหลด...</div>}

        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ================= LEFT: INCOMING ================= */}
            <div className="col-span-2">
              <h1 className="text-xl font-bold mb-4">🟡 งานที่เข้ามา</h1>
              {incomingBookings.length === 0 ? (
                <div className="text-gray-400 text-center py-10">No incoming jobs</div>
              ) : (
                <div className="space-y-4">
                  {incomingBookings.map((job) => (
                    <div key={job.BookID} className="border rounded-xl p-5 shadow-sm bg-white">
                      <div className="text-lg font-semibold">{job.UserName}</div>
                      <div className="text-sm text-gray-600 mt-1">บริการ: {job.ServiceName}</div>
                      <div className="text-sm text-gray-600">
                        วันที่: {new Date(job.AvailableDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        เวลา: {job.StartTime.slice(0,5)} - {job.EndTime.slice(0,5)}
                      </div>
                      <div className="text-sm text-gray-600">โน๊ต: {job.note}</div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleUpdate(job.BookID, "confirmed")}
                          className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => handleUpdate(job.BookID, "rejected")}
                          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= RIGHT: CONFIRMED ================= */}
            <div>
              <h1 className="text-xl font-bold mb-4">🟢 งานที่ยืนยันแล้ว</h1>
              {confirmedBookings.length === 0 ? (
                <div className="text-gray-400 text-center py-10">No confirmed jobs</div>
              ) : (
                <div className="space-y-4">
                  {confirmedBookings.map((job) => (
                    <div key={job.BookID} className="border rounded-xl p-5 shadow-sm bg-green-50">
                      <div className="text-lg font-semibold">{job.UserName}</div>
                      <div className="text-sm text-gray-600 mt-1">บริการ: {job.ServiceName}</div>
                      <div className="text-sm text-gray-600">
                        วันที่: {new Date(job.AvailableDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        เวลา: {job.StartTime.slice(0,5)} - {job.EndTime.slice(0,5)}
                      </div>
                      <div className="text-sm text-gray-600">โน๊ต: {job.note}</div>

                      <div className="flex gap-2 mt-3">
                        <div className="text-green-600 font-medium">✔ Confirmed</div>
                        {/* ปุ่มยกเลิก */}
                        <button
                          onClick={() => handleCancel(job.BookID)}
                          className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
                          disabled={cancelMutation.isLoading}
                        >
                          {cancelMutation.isLoading ? "กำลังยกเลิก..." : "ยกเลิก"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}