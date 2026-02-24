import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSlots } from "../app/Api";
import { useNavigate } from "react-router-dom";
export default function BookingSidebar({ serviceID }) {
const navigate = useNavigate();
  const today = new Date();

  const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  // 📌 default today selected
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(formatDate(today));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const daysArray = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // 📌 fetch slots when date + service ready
  const { data: slots = [] } = useQuery({
    queryKey: ["slots", serviceID, selectedDate],
    queryFn: () => fetchSlots(serviceID, selectedDate),
    enabled: !!serviceID && !!selectedDate,
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (day) => {
    if (!day) return;
    const newDate = new Date(year, month, day);
    setSelectedDate(formatDate(newDate));
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
          if (!day) return <div key={index}></div>;

          const dateObj = new Date(year, month, day);
          const formattedDate = formatDate(dateObj);
          const isPast = dateObj < new Date(today.setHours(0,0,0,0));
          const isToday = formattedDate === formatDate(new Date());
          const isSelected = selectedDate === formattedDate;

          return (
            <div
              key={index}
              onClick={() => !isPast && handleSelectDate(day)}
              className={`py-2 rounded
                ${isPast ? "text-gray-300 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}
                ${isToday ? "border border-blue-400" : ""}
                ${isSelected ? "bg-blue-600 text-white" : "text-gray-700"}
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
                  onClick={() =>
    navigate(`/Booking?availabilityId=${slot.AvailabilityID}`)
  }
                  className="border rounded-lg p-3 text-sm hover:bg-gray-100"
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