import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import {
  fetchBookingsByAdvisor,
  mangeBooking,
} from "../../app/Api";

export default function AdvisorManageBooking() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["incomingBookings"],
    queryFn: fetchBookingsByAdvisor,
  });
  console.log(bookings)

  const updateMutation = useMutation({
    mutationFn: mangeBooking,
    onSuccess: () => {
      console.log("onsuccess");
      queryClient.invalidateQueries({
        queryKey: ["incomingBookings"]
      });
    },
  });

  const handleUpdate = (bookingID, status) => {
    updateMutation.mutate({
      bookingID,
      status,
    });
  };

  return (
    <div>
      <NavbarSwitcher />
      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">
          งานที่เข้ามา
        </h1>

        {isLoading && (
          <div className="text-gray-500">โหลด...</div>
        )}

        {!isLoading && bookings.length === 0 && (
          <div className="text-gray-400 text-center py-10">
            No incoming jobs
          </div>
        )}

        <div className="space-y-4">
          {bookings.map((job) => (
            <div
              key={job.BookID}
              className="border rounded-lg p-5 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">

                {/* LEFT SIDE INFO */}
                <div>
                  <div className="text-lg font-semibold">
                    {job.UserName}
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    บริการ: {job.ServiceName}
                  </div>

                  <div className="text-sm text-gray-600">
                    วันที่: {new Date(job.AvailableDate).toLocaleDateString()}
                  </div>

                  <div className="text-sm text-gray-600">
                    เวลา: {job.StartTime.slice(0, 5)} - {job.EndTime.slice(0, 5)}
                  </div>

                  <div className="text-sm text-gray-600">
                    โน๊ต: {job.note}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleUpdate(job.BookID, "confirmed")
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleUpdate(job.BookID, "rejected")
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}