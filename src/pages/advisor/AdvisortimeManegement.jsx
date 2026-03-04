import { useMemo, useState } from "react";
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

  /* ===============================
     DAYS (7 วันล่วงหน้า)
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

  /* ===============================
     TIME SLOTS (30 นาที)
  =============================== */
  const times = useMemo(() => {
    const arr = [];
    for (let h = 0; h < 24; h++) {
      arr.push(`${String(h).padStart(2, "0")}:00`);
      arr.push(`${String(h).padStart(2, "0")}:30`);
    }
    return arr;
  }, []);

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

  const diffInSlots = (start, end) =>
    timeToIndex(end) - timeToIndex(start);

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

  /* ===============================
     TOGGLE SERVICE
  =============================== */

  const toggleService = (serviceID) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceID)) {
        return prev.filter((id) => id !== serviceID);
      }
      return [...prev, serviceID];
    });
  };

  const handleToggleAll = () => {
    const allIds = services.map((s) => String(s.ServiceID));

    if (selectedServices.length === allIds.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(allIds);
    }
  };

  /* ===============================
     ADD SLOT (Multi Select)
  =============================== */

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
      const endTime = calculateEndTime(
        time,
        duration + BREAK_TIME
      );

      createMutation.mutate({
        serviceID,
        availableDate: date,
        startTime: time + ":00",
        endTime: endTime + ":00",
      });
    });
  };

  /* ===============================
     TABLE
  =============================== */

  return (
    <div>
      <NavbarSwitcher />

      <div className="max-w-7xl mx-auto p-6">

        {/* SERVICE SELECT */}
        <div className="space-y-2 mb-6">
          <label className="block font-medium">
            Select Service to Open
          </label>

          <div className="flex flex-wrap gap-2">
            {/* ALL BUTTON */}
            <button
              type="button"
              onClick={handleToggleAll}
              className={`px-4 py-2 rounded border transition
                ${
                  selectedServices.length === services.length
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white hover:bg-gray-100"
                }`}
            >
              All Services
            </button>

            {/* SERVICE BUTTONS */}
            {services.map((s) => {
              const isSelected = selectedServices.includes(
                String(s.ServiceID)
              );

              return (
                <button
                  key={s.ServiceID}
                  type="button"
                  onClick={() =>
                    toggleService(String(s.ServiceID))
                  }
                  className={`px-4 py-2 rounded border transition
                    ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white hover:bg-gray-100"
                    }`}
                >
                  {s.ServiceName} ({s.Duration})
                </button>
              );
            })}
          </div>
        </div>

        <div className="border rounded-lg overflow-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50"></th>
                {days.map((day) => (
                  <th
                    key={day.value}
                    className="border p-2 bg-gray-50"
                  >
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {(() => {
                const skipMap = {};

                return times.map((time, rowIndex) => (
                  <tr key={time} className="h-12">
                    <td className="border p-2 bg-gray-50 text-right">
                      {time}
                    </td>

                    {days.map((day) => {
                      const key = `${day.value}-${rowIndex}`;
                      if (skipMap[key]) return null;

                      const slots = getSlotsForCell(
                        day.value,
                        time
                      );

                      if (slots.length === 0) {
                        return (
                          <td
                            key={day.value}
                            onClick={() =>
                              handleAdd(day.value, time)
                            }
                            className="border cursor-pointer hover:bg-gray-100"
                          />
                        );
                      }

                      const maxEnd = slots.reduce(
                        (latest, slot) =>
                          slot.EndTime > latest
                            ? slot.EndTime
                            : latest,
                        slots[0].EndTime
                      );

                      const span = diffInSlots(
                        time,
                        maxEnd.slice(0, 5)
                      );

                      for (let i = 1; i < span; i++) {
                        skipMap[
                          `${day.value}-${rowIndex + i}`
                        ] = true;
                      }

                      const isBooked = slots.some(
                        (s) =>
                          s.Status?.toLowerCase() ===
                          "booked"
                      );

                      return (
                        <td
                          key={day.value}
                          rowSpan={span}
                          onClick={() => {
                            if (isBooked) return;

                            // ลบเฉพาะ service ที่เลือก
                            slots.forEach((slot) => {
                              if (
                                selectedServices.includes(
                                  String(slot.ServiceID)
                                )
                              ) {
                                deleteMutation.mutate(
                                  slot.AvailabilityID
                                );
                              }
                            });
                          }}
                          className={`border p-2 align-top text-white cursor-pointer
                          ${
                            isBooked
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        >
                          <div className="font-semibold">
                            {slots
                              .map((s) => s.ServiceName)
                              .join(", ")}
                          </div>
                          <div className="text-[10px]">
                            {time} -{" "}
                            {maxEnd.slice(0, 5)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}