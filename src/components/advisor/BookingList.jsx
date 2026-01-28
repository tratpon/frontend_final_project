const bookings = [1, 2, 3];

export default function BookingList() {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-4 gap-3 text-sm">
        {["service", "day", "time", "period"].map((f) => (
          <div key={f} className="relative">
            <select className="w-full p-2 bg-gray-100 rounded">
              <option>{f}</option>
            </select>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {bookings.map((i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-2 p-4 bg-gray-100 rounded-lg text-sm"
          >
            <div className="font-medium">Service name</div>
            <div>xx/xx/xx</div>
            <div>xx:xx</div>
            <div>15 m</div>
          </div>
        ))}
      </div>
    </div>
  );
}
