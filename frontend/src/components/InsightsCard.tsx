import React from "react";
import type { InsightReport } from "../types";

interface Props {
  insights: InsightReport | null;
}

export default function InsightsCard({ insights }: Props) {
  if (!insights) return null;

  return (
    <div className="p-4 border rounded-lg bg-white shadow mt-4">
      <h2 className="text-xl font-bold mb-2">AI Insights</h2>
      <p className="mb-4">{insights.summary}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Risks</h3>
          <ul className="list-disc list-inside text-red-600">
            {insights.risks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Opportunities</h3>
          <ul className="list-disc list-inside text-green-600">
            {insights.opportunities.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="font-semibold mt-4">Suggested Actions</h3>
      <ul className="list-disc list-inside">
        {insights.suggested_actions.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>

      <h3 className="font-semibold mt-4">Evidence Considered</h3>
      <ul className="list-disc list-inside text-sm text-gray-500">
        {insights.evidence.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}
