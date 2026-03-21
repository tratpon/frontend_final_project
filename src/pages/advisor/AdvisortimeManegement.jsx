import { useMemo, useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import {
  fetchAvailability,
  createAvailability,
  deleteAvailability,
  fetchServiceByAdvisor,
} from "../../app/Api";

const BREAK_TIME = 30;

export default function AdvisorTimeManagement() {
  const queryClient = useQueryClient();
  const [selectedServices, setSelectedServices] = useState([]);
  const scrollRef = useRef(null); // สำหรับเลื่อนแถวปัจจุบัน

  /* ===============================
      DATE & TIME GENERATORS
  =============================== */
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");

      arr.push({
        label: d.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        value: `${yyyy}-${mm}-${dd}`,
      });
    }
    return arr;
  }, []);

  const times = useMemo(() => {
    const arr = [];
    for (let h = 0; h < 24; h++) {
      arr.push(`${String(h).padStart(2, "0")}:00`);
      arr.push(`${String(h).padStart(2, "0")}:30`);
    }
    return arr;
  }, []);

  // ฟังก์ชันหา Time Slot ปัจจุบัน (เช่น 10:15 -> 10:00, 10:45 -> 10:30)
  const currentTimeSlot = useMemo(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = now.getMinutes() < 30 ? "00" : "30";
    return `${h}:${m}`;
  }, []);

  /* ===============================
      EFFECTS (Auto Scroll)
  =============================== */
  useEffect(() => {
    // เลื่อนไปยังเวลาปัจจุบันเมื่อ Component mount หรือข้อมูลโหลดเสร็จ
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [scrollRef.current]);

  /* ===============================
      FETCH DATA
  =============================== */
  const { data: availability = [] } = useQuery({
    queryKey: ["advisorAvailability"],
    queryFn: fetchAvailability,
  });

  const { data } = useQuery({
    queryKey: ["advisorServices"],
    queryFn: fetchServiceByAdvisor,
  });

  const services = data?.services || [];

  /* ===============================
      MUTATIONS
  =============================== */
  const createMutation = useMutation({
    mutationFn: createAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries(["advisorAvailability"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries(["advisorAvailability"]);
    },
  });

  /* ===============================
      HELPERS
  =============================== */
  const formatDateLocal = (dateString) => {
    const d = new Date(dateString);
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  };

  const timeToIndex = (time) => times.indexOf(time);

  const diffInSlots = (start, end) => timeToIndex(end) - timeToIndex(start);

  const getDuration = (serviceID) => {
    const service = services.find(
      (s) => Number(s.ServiceID) === Number(serviceID)
    );
    if (!service) return 60;
    const match = String(service.Duration).match(/\d+/);
    return match ? Number(match[0]) : 60;
  };

  const calculateEndTime = (startTime, duration) => {
    const [h, m] = startTime.split(":");
    const date = new Date();
    date.setHours(+h);
    date.setMinutes(+m + duration);

    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  const getSlotsForCell = (date, time) => {
    return availability.filter(
      (a) =>
        formatDateLocal(a.AvailableDate) === date &&
        a.StartTime.slice(0, 5) === time
    );
  };

  const toggleService = (serviceID) => {
    setSelectedServices((prev) =>
      prev.includes(serviceID)
        ? prev.filter((id) => id !== serviceID)
        : [...prev, serviceID]
    );
  };

  const handleToggleAll = () => {
    const allIds = services.map((s) => String(s.ServiceID));
    setSelectedServices(selectedServices.length === allIds.length ? [] : allIds);
  };

  const handleAdd = (date, time) => {
    if (selectedServices.length === 0) return;
    selectedServices.forEach((serviceID) => {
      const exists = availability.find(
        (a) =>
          Number(a.ServiceID) === Number(serviceID) &&
          formatDateLocal(a.AvailableDate) === date &&
          a.StartTime.slice(0, 5) === time
      );
      if (exists) return;

      const duration = getDuration(serviceID);
      const endTime = calculateEndTime(time, duration + BREAK_TIME);

      createMutation.mutate({
        serviceID,
        availableDate: date,
        startTime: time + ":00",
        endTime: endTime + ":00",
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarSwitcher />

      <div className="max-w-7xl mx-auto p-6">
        {/* SERVICE SELECT */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
          <label className="block font-semibold mb-3 text-gray-700">
            Select Service to Open (Multi-select)
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleToggleAll}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                ${selectedServices.length === services.length
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
                }`}
            >
              All Services
            </button>

            {services.map((s) => {
              const isSelected = selectedServices.includes(String(s.ServiceID));
              return (
                <button
                  key={s.ServiceID}
                  type="button"
                  onClick={() => toggleService(String(s.ServiceID))}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                    ${isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
                    }`}
                >
                  {s.ServiceName} ({s.Duration})
                </button>
              );
            })}
          </div>
        </div>

        {/* TIME MANAGEMENT TABLE */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm h-[700px] overflow-y-auto relative">
          <table className="w-full border-collapse text-xs table-fixed">
            <thead className="sticky top-0 z-20 bg-gray-50 shadow-sm">
              <tr>
                <th className="border p-3 w-20 bg-gray-100 font-bold text-gray-600">Time</th>
                {days.map((day) => (
                  <th key={day.value} className="border p-3 bg-gray-50 font-bold text-gray-700">
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {(() => {
                const skipMap = {};
                return times.map((time, rowIndex) => {
                  const isCurrent = time === currentTimeSlot;
                  return (
                    <tr 
                      key={time} 
                      className={`h-14 ${isCurrent ? "bg-blue-50/50" : ""}`}
                      ref={isCurrent ? scrollRef : null}
                    >
                      <td className={`border p-2 text-right font-medium text-gray-500 bg-gray-50/50
                        ${isCurrent ? "text-blue-600 font-bold border-r-2 border-r-blue-400" : ""}`}>
                        {time}
                      </td>

                      {days.map((day) => {
                        const key = `${day.value}-${rowIndex}`;
                        if (skipMap[key]) return null;

                        const slots = getSlotsForCell(day.value, time);

                        if (slots.length === 0) {
                          return (
                            <td
                              key={day.value}
                              onClick={() => handleAdd(day.value, time)}
                              className="border cursor-pointer hover:bg-blue-50 transition-colors"
                            />
                          );
                        }

                        const maxEnd = slots.reduce(
                          (latest, slot) => (slot.EndTime > latest ? slot.EndTime : latest),
                          slots[0].EndTime
                        );

                        const span = diffInSlots(time, maxEnd.slice(0, 5));
                        for (let i = 1; i < span; i++) {
                          skipMap[`${day.value}-${rowIndex + i}`] = true;
                        }

                        const isBooked = slots.some(
                          (s) => s.Status?.toLowerCase() === "booked"
                        );

                        return (
                          <td
                            key={day.value}
                            rowSpan={span}
                            onClick={() => {
                              if (isBooked) return;
                              slots.forEach((slot) => {
                                if (selectedServices.includes(String(slot.ServiceID))) {
                                  deleteMutation.mutate(slot.AvailabilityID);
                                }
                              });
                            }}
                            className={`border p-2 align-top text-white cursor-pointer transition-transform active:scale-95
                              ${isBooked ? "bg-red-500 shadow-inner" : "bg-emerald-500 hover:bg-emerald-600"}`}
                          >
                            <div className="font-bold truncate">
                              {slots.map((s) => s.ServiceName).join(", ")}
                            </div>
                            <div className="text-[10px] opacity-90 mt-1">
                              {time} - {maxEnd.slice(0, 5)}
                            </div>
                            {isBooked && <div className="mt-1 font-black uppercase text-[9px]">Reserved</div>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}