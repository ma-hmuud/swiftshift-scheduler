/** FullCalendar event colors — hex for broad browser support inside FC. */

export function managerCapacityColors(booked: number, capacity: number) {
  if (booked >= capacity) {
    return { backgroundColor: "#dc2626", borderColor: "#b91c1c" };
  }
  if (booked === 0) {
    return { backgroundColor: "#16a34a", borderColor: "#15803d" };
  }
  return { backgroundColor: "#ca8a04", borderColor: "#a16207" };
}

export function employeeShiftColors(args: {
  booked: number;
  capacity: number;
  myRequestStatus: string | null;
}) {
  const { booked, capacity, myRequestStatus } = args;

  if (myRequestStatus === "approved") {
    return { backgroundColor: "#7c3aed", borderColor: "#6d28d9" };
  }
  if (myRequestStatus === "pending") {
    return { backgroundColor: "#2563eb", borderColor: "#1d4ed8" };
  }
  if (booked >= capacity) {
    return { backgroundColor: "#737373", borderColor: "#525252" };
  }
  return { backgroundColor: "#16a34a", borderColor: "#15803d" };
}
