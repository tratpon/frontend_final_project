import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSlots } from "../app/Api";

export default function BookingSidebar({ advisorId }) {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const daysArray = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const { data: slots = [], refetch } = useQuery({
    queryKey: ["slots", advisorId, selectedDate],
    queryFn: () => fetchSlots(advisorId, selectedDate),
    enabled: !!selectedDate,
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (day) => {
    if (!day) return;
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(formattedDate);
  };

  const handleBooking = (availabilityId) => {
    console.log("Booking AvailabilityID:", availabilityId);
    // ยิง booking API ตรงนี้
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div className="border rounded-xl p-6 shadow-sm w-full max-w-sm">

      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth}>&lt;</button>
        <div className="font-medium">
          {monthName} {year}
        </div>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-center text-sm mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="text-gray-500 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 text-center text-sm gap-1">
        {daysArray.map((day, index) => {
          const formattedDate = day
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : null;

          return (
            <div
              key={index}
              onClick={() => handleSelectDate(day)}
              className={`py-2 rounded cursor-pointer
              ${selectedDate === formattedDate
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <>
          <div className="mt-6 font-medium">
            Available Time
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {slots.length > 0 ? (
              slots.map((slot) => (
                <button
                  key={slot.AvailabilityID}
                  onClick={() => handleBooking(slot.AvailabilityID)}
                  className="border rounded-lg py-2 text-sm hover:bg-gray-100"
                >
                  {slot.StartTime.slice(0, 5)} - {slot.EndTime.slice(0, 5)}
                </button>
              ))
            ) : (
              <div className="col-span-2 text-gray-400 text-center">
                No slots available
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}