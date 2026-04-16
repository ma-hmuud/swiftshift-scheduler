import type { ReactNode } from "react";

import { cn } from "~/lib/utils";
import type {
  EmployeeDashboardData,
  ManagerDashboardData,
} from "~/server/api/repositories/dashboard";

type ManagerDashboardPageProps = ManagerDashboardData & {
  userName?: string | null;
};

type EmployeeDashboardPageProps = EmployeeDashboardData & {
  userName?: string | null;
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const compactDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
});

function formatDateTime(value: Date | string) {
  return dateTimeFormatter.format(new Date(value));
}

function formatDateRange(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  return `${compactDateFormatter.format(start)} ${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "approved":
    case "published":
      return "bg-[color-mix(in_srgb,var(--olive-600)_28%,transparent)] text-[color-mix(in_srgb,var(--olive-800)_90%,white)]";
    case "pending":
    case "draft":
      return "bg-[color-mix(in_srgb,var(--walnut-700)_22%,transparent)] text-[var(--walnut-900)]";
    case "rejected":
    case "cancelled":
      return "bg-[color-mix(in_srgb,var(--destructive)_22%,transparent)] text-[color-mix(in_srgb,var(--destructive)_85%,white)]";
    case "filled":
      return "bg-[color-mix(in_srgb,var(--toffee-600)_22%,transparent)] text-[var(--toffee-800)]";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function DashboardLayout(props: {
  title: string;
  subtitle: string;
  metrics: {
    label: string;
    value: number;
    helper: string;
  }[];
  children: ReactNode;
}) {
  return (
    <main className="relative mx-auto w-full max-w-[1120px] px-4 py-8 sm:py-12">
      <section className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Dashboard
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {props.title}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{props.subtitle}</p>
      </section>

      <section
        className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Dashboard metrics"
      >
        {props.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-(--landing-border) bg-card/90 p-5 shadow-sm ring-1 ring-white/3"
          >
            <p className="font-display text-3xl font-semibold tabular-nums text-foreground">
              {metric.value}
            </p>
            <p className="mt-1 text-sm font-medium capitalize text-muted-foreground">{metric.label}</p>
            <span className="mt-2 block text-xs uppercase tracking-[0.16em] text-(--ink-soft)">
              {metric.helper}
            </span>
          </div>
        ))}
      </section>

      <section className="grid w-full gap-4 lg:grid-cols-2">{props.children}</section>
    </main>
  );
}

function SectionCard(props: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="landing-glass h-full rounded-3xl border border-(--landing-border) p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] sm:p-8">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{props.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-(--ink-soft)">{props.description}</p>
      </div>
      {props.children}
    </article>
  );
}

function EmptyState(props: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-(--line) px-4 py-10 text-center text-sm text-(--ink-soft)">
      {props.message}
    </div>
  );
}

function StatusBadge(props: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        getStatusBadgeClass(props.status),
      )}
    >
      {props.status}
    </span>
  );
}

export function ManagerDashboardPage({
  userName,
  recentRequests,
  recentShifts,
  requestsCount,
  shiftsCount,
  employeesCount,
}: ManagerDashboardPageProps) {
  return (
    <DashboardLayout
      title={`Manager Dashboard${userName ? `, ${userName}` : ""}`}
      subtitle="Track incoming staffing activity, keep an eye on recently created shifts, and monitor the current team footprint from one view."
      metrics={[
        {
          label: "requests",
          value: requestsCount,
          helper: "Across your shifts",
        },
        {
          label: "shifts",
          value: shiftsCount,
          helper: "Created by you",
        },
        {
          label: "employees",
          value: employeesCount,
          helper: "Current employee accounts",
        },
      ]}
    >
      <SectionCard
        title="Recent requests"
        description="The newest employee requests submitted for shifts you manage."
      >
        {recentRequests.length ? (
          <ul className="grid gap-3">
            {recentRequests.map((request) => (
              <li
                key={request.id}
                className="rounded-2xl border border-(--line) px-4 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="m-0 text-base font-semibold">{request.shiftTitle}</p>
                    <p className="mt-1 text-sm text-(--ink-soft)">
                      {request.employeeName} requested this shift
                    </p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-(--ink-soft)">
                  Submitted {formatDateTime(request.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="No shift requests have been submitted for your team yet." />
        )}
      </SectionCard>

      <SectionCard
        title="Recent shifts"
        description="The latest shifts you created, including their current publication state."
      >
        {recentShifts.length ? (
          <ul className="grid gap-3">
            {recentShifts.map((shift) => (
              <li
                key={shift.id}
                className="rounded-2xl border border-(--line) px-4 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="m-0 text-base font-semibold">{shift.title}</p>
                    <p className="mt-1 text-sm text-(--ink-soft)">
                      {formatDateRange(shift.startTime, shift.endTime)}
                    </p>
                  </div>
                  <StatusBadge status={shift.status} />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-(--ink-soft)">
                  Capacity {shift.maxEmployees} employees
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="You have not created any shifts yet." />
        )}
      </SectionCard>
    </DashboardLayout>
  );
}

export function EmployeeDashboardPage({
  userName,
  recentRequests,
  requestsCount,
  shiftsCount,
}: EmployeeDashboardPageProps) {
  return (
    <DashboardLayout
      title={`Employee Dashboard${userName ? `, ${userName}` : ""}`}
      subtitle="Review your latest shift requests and see how many published shifts currently match your availability."
      metrics={[
        {
          label: "requests",
          value: requestsCount,
          helper: "Submitted by you",
        },
        {
          label: "matching shifts",
          value: shiftsCount,
          helper: "Published and availability aligned",
        },
      ]}
    >
      <SectionCard
        title="Recent requests"
        description="Your most recent shift requests and their latest statuses."
      >
        {recentRequests.length ? (
          <ul className="grid gap-3">
            {recentRequests.map((request) => (
              <li
                key={request.id}
                className="rounded-2xl border border-(--line) px-4 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="m-0 text-base font-semibold">{request.shiftTitle}</p>
                    <p className="mt-1 text-sm text-(--ink-soft)">
                      {formatDateRange(request.shiftStartTime, request.shiftEndTime)}
                    </p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-(--ink-soft)">
                  Requested {formatDateTime(request.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="You have not submitted any shift requests yet." />
        )}
      </SectionCard>

      <SectionCard
        title="Shift availability"
        description="This summary is based on your saved availability and the shifts that are currently published."
      >
        <div className="rounded-2xl border border-(--line) px-5 py-8">
          <p className="m-0 text-4xl font-semibold">{shiftsCount}</p>
          <p className="mt-2 text-sm leading-6 text-(--ink-soft)">
            published shifts currently match your availability settings.
          </p>
        </div>
      </SectionCard>
    </DashboardLayout>
  );
}
