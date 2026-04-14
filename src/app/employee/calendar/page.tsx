import { CalendarShell } from "~/components/calendar/calendar-shell";
import { EmployeeCalendar } from "~/components/features/shifts/employee-calendar";

export default function EmployeeCalendarPage() {
  return (
    <CalendarShell
      title="Available shifts"
      description="Read-only schedule of published shifts you can request. Legend reflects your personal request state."
      legend={[
        { label: "Open shift", className: "bg-[#16a34a]" },
        { label: "Full", className: "bg-[#737373]" },
        { label: "Requested (pending)", className: "bg-[#2563eb]" },
        { label: "Approved", className: "bg-[#7c3aed]" },
      ]}
    >
      <EmployeeCalendar />
    </CalendarShell>
  );
}
