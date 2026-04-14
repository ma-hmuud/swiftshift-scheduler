import { CalendarShell } from "~/components/calendar/calendar-shell";
import { EmployeeCalendar } from "~/components/features/shifts/employee-calendar";

export default function EmployeeCalendarPage() {
  return (
    <CalendarShell
      title="Available shifts"
      description="Read-only schedule of published shifts you can request. Legend reflects your personal request state."
      legend={[
        { label: "Open shift", className: "bg-[#99ad7a]" },
        { label: "Full", className: "bg-[#5a5d56]" },
        { label: "Requested (pending)", className: "bg-[#6b8cae]" },
        { label: "Approved", className: "bg-[#8b7eae]" },
      ]}
    >
      <EmployeeCalendar />
    </CalendarShell>
  );
}
