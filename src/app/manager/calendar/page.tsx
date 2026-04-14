import { CalendarShell } from "~/components/calendar/calendar-shell";
import { ManagerCalendar } from "~/components/features/shifts/manager-calendar";

export default function ManagerCalendarPage() {
  return (
    <CalendarShell
      title="Shift calendar"
      description="Create shifts from empty slots or drag across time. Colors reflect how full each shift is based on approved coverage."
      legend={[
        { label: "Available (0 booked)", className: "bg-[#16a34a]" },
        { label: "Partially filled", className: "bg-[#ca8a04]" },
        { label: "At capacity", className: "bg-[#dc2626]" },
      ]}
    >
      <ManagerCalendar />
    </CalendarShell>
  );
}
