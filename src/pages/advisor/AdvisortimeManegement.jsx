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
  const scrollRef = useRef(null);

  /* ===============================
      สร้างข้อมูลวันที่และเวลา
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
        label: d.toLocaleDateString("th-TH", {
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

  const currentTimeSlot = useMemo(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = now.getMinutes() < 30 ? "00" : "30";
    return `${h}:${m}`;
  }, []);

  /* ===============================
      HELPERS
  =============================== */
  const isPast = (dateStr, timeStr) => {
    const now = new Date();
    const target = new Date(`${dateStr}T${timeStr}:00`);
    return target < now;
  };

  const formatDateLocal = (dateString) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const timeToIndex = (time) => times.indexOf(time);
  const diffInSlots = (start, end) => timeToIndex(end) - timeToIndex(start);

  const getDuration = (serviceID) => {
    const service = services.find((s) => Number(s.ServiceID) === Number(serviceID));
    if (!service) return 60;
    const match = String(service.Duration).match(/\d+/);
    return match ? Number(match[0]) : 60;
  };

  const calculateEndTime = (startTime, duration) => {
    const [h, m] = startTime.split(":");
    const date = new Date();
    date.setHours(+h);
    date.setMinutes(+m + duration);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  /* ===============================
      FETCH DATA & MUTATIONS
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

  const createMutation = useMutation({
    mutationFn: createAvailability,
    onSuccess: () => queryClient.invalidateQueries(["advisorAvailability"]),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAvailability,
    onSuccess: () => queryClient.invalidateQueries(["advisorAvailability"]),
  });

  /* ===============================
      HANDLERS
  =============================== */
  const toggleService = (serviceID) => {
    setSelectedServices((prev) =>
      prev.includes(serviceID) ? prev.filter((id) => id !== serviceID) : [...prev, serviceID]
    );
  };

  const handleToggleAll = () => {
    const allIds = services.map((s) => String(s.ServiceID));
    setSelectedServices(selectedServices.length === allIds.length ? [] : allIds);
  };

  const handleAdd = (date, time) => {
    if (selectedServices.length === 0) {
      alert("กรุณาเลือกบริการก่อน");
      return;
    }
    if (isPast(date, time)) return; // ป้องกันการกดในอดีต

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarSwitcher />

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
          <label className="block font-semibold mb-3 text-gray-700">เลือกบริการที่ต้องการเปิดจอง</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleToggleAll}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                ${selectedServices.length === services.length ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
            >
              ทั้งหมด
            </button>
            {services.map((s) => (
              <button
                key={s.ServiceID}
                onClick={() => toggleService(String(s.ServiceID))}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                  ${selectedServices.includes(String(s.ServiceID)) ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600"}`}
              >
                {s.ServiceName} ({s.Duration})
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden shadow-sm h-[700px] overflow-y-auto relative">
          <table className="w-full border-collapse text-xs table-fixed">
            <thead className="sticky top-0 z-20 bg-gray-50 shadow-sm">
              <tr>
                <th className="border p-3 w-20 bg-gray-100 font-bold text-gray-600 text-center">เวลา</th>
                {days.map((day) => (
                  <th key={day.value} className="border p-3 bg-gray-50 font-bold text-gray-700 text-center">{day.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const skipMap = {};
                return times.map((time, rowIndex) => {
                  const isCurrentRow = time === currentTimeSlot;
                  return (
                    <tr key={time} className={`h-14 ${isCurrentRow ? "bg-blue-50/50" : ""}`} ref={isCurrentRow ? scrollRef : null}>
                      <td className={`border p-2 text-right font-medium text-gray-500 bg-gray-50/50 ${isCurrentRow ? "text-blue-600 font-bold border-r-2 border-r-blue-400" : ""}`}>
                        {time}
                      </td>

                      {days.map((day) => {
                        const key = `${day.value}-${rowIndex}`;
                        if (skipMap[key]) return null;

                        const slots = availability.filter(
                          (a) => formatDateLocal(a.AvailableDate) === day.value && a.StartTime.slice(0, 5) === time
                        );
                        
                        const past = isPast(day.value, time);
                        const isBooked = slots.some((s) => s.Status?.toLowerCase() === "booked");

                        // --- LOGIC ปรับปรุงใหม่ ---
                        // 1. ถ้าผ่านไปแล้ว และไม่มีคนจอง -> ให้แสดงเป็นช่องว่างที่กดไม่ได้ (เหมือนไม่ได้ลงเวลาไว้)
                        if (past && !isBooked) {
                          return (
                            <td key={day.value} className="border bg-gray-100/30 cursor-not-allowed" />
                          );
                        }

                        // 2. ถ้ายังไม่มีการลงเวลา หรือเป็นเวลาในอนาคตที่ยังว่าง
                        if (slots.length === 0) {
                          return (
                            <td
                              key={day.value}
                              onClick={() => !past && handleAdd(day.value, time)}
                              className={`border transition-colors ${past ? "bg-gray-100/30 cursor-not-allowed" : "cursor-pointer hover:bg-blue-50"}`}
                            />
                          );
                        }

                        // 3. ถ้ามีการลงเวลาไว้ (Slots > 0)
                        const maxEnd = slots.reduce((latest, slot) => (slot.EndTime > latest ? slot.EndTime : latest), slots[0].EndTime);
                        const span = diffInSlots(time, maxEnd.slice(0, 5));
                        for (let i = 1; i < span; i++) { skipMap[`${day.value}-${rowIndex + i}`] = true; }

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
                            className={`border p-2 align-top text-white transition-all
                              ${isBooked ? "bg-red-500 shadow-inner" : "bg-emerald-500 hover:bg-emerald-600 cursor-pointer active:scale-95"}`}
                          >
                            <div className="font-bold truncate">{slots.map((s) => s.ServiceName).join(", ")}</div>
                            <div className="text-[10px] opacity-90 mt-1">{time} - {maxEnd.slice(0, 5)}</div>
                            {isBooked && <div className="mt-1 font-black uppercase text-[9px] bg-red-700/30 inline-block px-1 rounded">จองแล้ว</div>}
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