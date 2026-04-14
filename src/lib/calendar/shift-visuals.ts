/** FullCalendar event colors — aligned with brand olive / sage / sand palette. */

export function managerCapacityColors(booked: number, capacity: number) {
  if (booked >= capacity) {
    return { backgroundColor: "#b35252", borderColor: "#8f3d3d" };
  }
  if (booked === 0) {
    return { backgroundColor: "#99ad7a", borderColor: "#546b41" };
  }
  return { backgroundColor: "#b89a5c", borderColor: "#8a7344" };
}

export function employeeShiftColors(args: {
  booked: number;
  capacity: number;
  myRequestStatus: string | null;
}) {
  const { booked, capacity, myRequestStatus } = args;

  if (myRequestStatus === "approved") {
    return { backgroundColor: "#8b7eae", borderColor: "#6b5d85" };
  }
  if (myRequestStatus === "pending") {
    return { backgroundColor: "#6b8cae", borderColor: "#4f6d86" };
  }
  if (booked >= capacity) {
    return { backgroundColor: "#5a5d56", borderColor: "#3d4038" };
  }
  return { backgroundColor: "#99ad7a", borderColor: "#546b41" };
}
