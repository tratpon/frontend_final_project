const days = ["Mon", "Mon", "Mon", "Mon", "Mon", "Mon", "Mon"];
const times = [
  "9:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export default function ScheduleGrid() {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-8 bg-gray-50 border-b text-sm font-medium">
        <div />
        {days.map((day, i) => (
          <div key={i} className="p-3 border-l text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Body */}
      {times.map((time) => (
        <div key={time} className="grid grid-cols-8 h-14 border-b text-sm">
          {/* Time */}
          <div className="flex items-center justify-end pr-3 bg-gray-50 border-r text-gray-500">
            {time}
          </div>

          {/* Cells */}
          {days.map((_, i) => (
            <div
              key={i}
              className="border-l border-dashed"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
