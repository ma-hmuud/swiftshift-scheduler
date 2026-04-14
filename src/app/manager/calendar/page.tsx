import { CalendarShell } from "~/components/calendar/calendar-shell";
import { ManagerCalendar } from "~/components/features/shifts/manager-calendar";

export default function ManagerCalendarPage() {
  return (
    <CalendarShell
      title="Shift calendar"
      description="Create shifts from empty slots or drag across time. Colors reflect how full each shift is based on approved coverage."
      legend={[
        { label: "Available (0 booked)", className: "bg-[#99ad7a]" },
        { label: "Partially filled", className: "bg-[#b89a5c]" },
        { label: "At capacity", className: "bg-[#b35252]" },
      ]}
    >
      <ManagerCalendar />
    </CalendarShell>
  );
}
