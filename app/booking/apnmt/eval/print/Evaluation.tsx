"use client";

import { Button } from "@/components/ui/button";
import { ExpandableTextArea } from "@/lib/ExpandableTextArea";
import { runQuery } from "@/lib/utils";
import { useLayoutEffect, useState } from "react";

type Evaluation = {
  type_of_house: string | null;
  other_source_of_income: string | null;
  occupation: string | null;
  monthly_income: string | null;
  number_of_meals: string | null;
  source_of_water_per_month: string | null;
  source_of_fuel_per_month: string | null;
  source_of_light_per_month: string | null;
  house_and_lot: string | null;
  appliances: string | null;
  economic_condition: string | null;
  expenditures_vs_income_analysis: string | null;
  evaluation_recommendation: string | null;
  problem_presented: string | null;
  economic_and_family_background: string | null;
  assessment: string | null;
  recommendation: string | null;
};

// ✅ define prop type
type EvaluationComponentProps = {
  evaluationId: string | number; // depending on your DB ID type
};

export default function Evaluation({ evaluationId }: EvaluationComponentProps) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const getEval = async () => {
    const value = await runQuery("getEval", [evaluationId]);
    console.log({ value })
    if (value?.data) {
      const row = value.data[0];

      // ✅ Pick only the fields we care about
      const mapped: Evaluation = {
        type_of_house: row.type_of_house ?? null,
        other_source_of_income: row.other_source_of_income ?? null,
        occupation: row.occupation ?? null,
        monthly_income: row.monthly_income ?? null,
        number_of_meals: row.number_of_meals ?? null,
        source_of_water_per_month: row.source_of_water_per_month ?? null,
        source_of_fuel_per_month: row.source_of_fuel_per_month ?? null,
        source_of_light_per_month: row.source_of_light_per_month ?? null,
        house_and_lot: row.house_and_lot ?? null,
        appliances: row.appliances ?? null,
        economic_condition: row.economic_condition ?? null,
        expenditures_vs_income_analysis: row.expenditures_vs_income_analysis ?? null,
        evaluation_recommendation: row.evaluation_recommendation ?? null,
        problem_presented: row.problem_presented ?? null,
        economic_and_family_background: row.economic_and_family_background ?? null,
        assessment: row.assessment ?? null,
        recommendation: row.recommendation ?? null,
      };

      setEvaluation(mapped);
    }
  };

  useLayoutEffect(() => {
    getEval();
  }, [evaluationId]);

  function formatKey(key: string) {
    return key
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const longTextFields = [
    "problem_presented",
    "economic_and_family_background",
    "assessment",
    "recommendation",
  ];

  if (!evaluation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-1">
      {Object.entries(evaluation).map(([key, value]) =>
        longTextFields.includes(key) ? (
          <div key={key} className="flex flex-col mt-4">
            <span className="font-bold">{formatKey(key)}</span>
            <ExpandableTextArea
              value={value ?? ""}
              minRows={2}
              className="mb-4"
            />
          </div>
        ) : (
          <div key={key} className="flex">
            <span className="font-bold mr-2">{formatKey(key)}</span>
            <span>{value ?? "-"}</span>
          </div>
        )
      )}

      {/* <Button onClick={getEval}>Test</Button> */}
    </div>
  );
}
