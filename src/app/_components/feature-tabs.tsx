"use client";

import { useMemo, useState } from "react";

type Tab = {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
};

const tabs: Tab[] = [
  {
    id: "planning",
    title: "Smart Shift Planning",
    summary:
      "Build weekly schedules in a few focused clicks with conflict-aware suggestions.",
    bullets: [
      "Quickly duplicate proven schedule templates",
      "Catch overlap and overtime risk before publishing",
      "Assign by role, location, and availability",
    ],
  },
  {
    id: "availability",
    title: "Availability and Requests",
    summary:
      "Let team members manage availability and request changes without message chaos.",
    bullets: [
      "Employees set weekly availability in one place",
      "Request shift swaps with full context",
      "Keep everyone synced with instant updates",
    ],
  },
  {
    id: "approvals",
    title: "Manager Approvals",
    summary:
      "Review requests in a clean approval flow that keeps service coverage stable.",
    bullets: [
      "Triage pending requests by urgency",
      "Approve or reject with clear audit trail",
      "See staffing impact before you confirm",
    ],
  },
];

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "planning");

  const active = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) ?? tabs[0],
    [activeTab],
  );

  if (!active) {
    return null;
  }

  return (
    <div className="feature-tabs">
      <div
        className="feature-tabs-list"
        role="tablist"
        aria-label="Swift Shift features"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`feature-tab ${isActive ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </button>
          );
        })}
      </div>

      <section
        key={active.id}
        id={`panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
        className="feature-tab-panel"
      >
        <h3>{active.title}</h3>
        <p>{active.summary}</p>
        <ul>
          {active.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
