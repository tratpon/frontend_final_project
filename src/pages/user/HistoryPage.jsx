import Footer from "../../components/Footer";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingsByUser } from "../../app/Api";

export default function History() {

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchBookingsByUser,
    refetchOnWindowFocus: false
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <NavbarSwitcher />

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center mt-12 mb-8">
        History
      </h1>

      {/* SEARCH */}
      <div className="flex justify-center mb-5">
        <div className="flex w-3/4 lg:w-5xl bg-white border rounded shadow-sm">
          <div className="flex items-center px-3 text-gray-400">
            🔍
          </div>
          <input
            className="flex-1 py-3 px-2 outline-none"
            placeholder="Search for..."
          />
          <button className="px-6 bg-blue-600 text-white hover:bg-blue-700">
            Search
          </button>
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="text-center mt-10">Loading...</div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-center text-red-500 mt-10">
          Failed to load bookings
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && bookings.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          No booking history found.
        </div>
      )}

      {/* HISTORY LIST */}
      <div className="flex flex-col grow gap-3 max-w-5xl mx-auto w-full px-4 mb-10">

        {bookings.map((booking) => (

          <div
            key={booking.BookingID}
            className="bg-gray-100 rounded-xl flex items-center p-6"
          >

            {/* IMAGE */}
            <div className="w-40 h-32 bg-gray-300 rounded-xl flex items-center justify-center mr-6">
              📅
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                👤
                <span className="font-semibold">
                  {booking.AdvisorName}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-2">
                {booking.ServiceName}
              </p>

              <p className="text-sm text-gray-600">
                {booking.AvailableDate} | {booking.StartTime} - {booking.EndTime}
              </p>
            </div>

            {/* STATUS */}
            <div className="text-right min-w-[120px]">
              <p className="font-semibold text-lg capitalize">
                {booking.Status}
              </p>

              <p className="font-bold mt-2">
                {new Date(booking.CreatedAt).toLocaleDateString()}
              </p>
            </div>

          </div>
        ))}

      </div>

      <Footer />

    </div>
  );
}