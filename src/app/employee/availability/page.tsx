import { EmployeeAvailabilityForm } from "~/components/features/availability/employee-availability-form";

export default function EmployeeAvailabilityPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Set which days of the week you can work. You can change this anytime.
        </p>
      </div>
      <EmployeeAvailabilityForm />
    </div>
  );
}
