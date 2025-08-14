'use client';

import { Input } from '@/components/ui/input';
import { runQuery } from '@/lib/utils';
import React, { useState } from 'react';
import { toast } from 'sonner';

type OptionItem = {
    code: string;
};

type OptionGroup = {
    code: string;
    name: string;
    list: OptionItem[];
};

export default function Evaluation() {

    const objList: OptionGroup[] = [
        { code: "type_of_house", name: "Type of House", list: [{ code: "Concrete" }, { code: "Wood" }, { code: "Concrete w/ wood" }, { code: "Others" }] },
        { code: "other_source_of_income", name: "Other Source of Income", list: [{ code: "Friends" }, { code: "Relatives" }, { code: "Children" }, { code: "Others" }] },
        { code: "occupation", name: "Occupation", list: [{ code: "Farmers" }, { code: "Laborer" }, { code: "Vendor" }, { code: "Others" }] },
        { code: "monthly_income", name: "Monthly Income", list: [{ code: "1,000-3,000" }, { code: "4,000-8,000" }, { code: "9,000-15,000" }, { code: "Others" }] },
        { code: "number_of_meals", name: "Number of Meals", list: [{ code: "Once a day" }, { code: "Two times a day" }, { code: "Three times a day" }, { code: "Others" }] },
        { code: "source_of_water_per_month", name: "Source of Water/Month", list: [{ code: "Deepwell" }, { code: "Water district" }, { code: "Water pump" }, { code: "Others" }] },
        { code: "source_of_fuel_per_month", name: "Source of Fuel/Month", list: [{ code: "Firewood" }, { code: "Charcoal" }, { code: "Gasul" }, { code: "Others" }] },
        { code: "source_of_light_per_month", name: "Source of Light/Month", list: [{ code: "Lamp" }, { code: "Electric" }, { code: "Candle" }, { code: "Others" }] },
        { code: "house_and_lot", name: "House & Lot", list: [{ code: "Owned house & lot" }, { code: "Share w/ parents" }, { code: "Share w/ relatives" }, { code: "Caretaker" }, { code: "Rented home" }, { code: "Owned house but rented lot" }, { code: "Others" }] },
        { code: "appliances", name: "Appliances", list: [{ code: "TV" }, { code: "Refrigerator" }, { code: "Radio" }, { code: "Others" }] },
    ];

    const extraSections: OptionGroup[] = [
        {
            code: "economic_condition",
            name: "Economic Condition",
            list: [
                { code: "Income is sufficient to meet/provide all family basic needs" },
                { code: "Income is sufficient to meet/provide some basic needs" },
                { code: "Income is insufficient to meet/provide all basic needs" },
                { code: "Not applicable" }
            ]
        },
        {
            code: "expenditures_vs_income_analysis",
            name: "Expenditures vs. Income Analysis",
            list: [
                { code: "Total monthly family expenditures is equal to the monthly family income" },
                { code: "Total monthly family expenditures is higher than the total monthly income" },
                { code: "Total monthly family expenditures is lower than the total monthly income" },
                { code: "None of the above/not applicable" }
            ]
        },
        {
            code: "evaluation_recommendation",
            name: "Evaluation/Recommendation",
            list: [
                { code: "Indigent" },
                { code: "In dire need of immediate/appropriate intervention" },
                { code: "Exhausted Resources" },
                { code: "Limited Economic Resources" },
                { code: "Not eligible" },
                { code: "Eligible and highly recommended for" }
            ]
        }
    ];

    const [textAreas, setTextAreas] = useState<Record<string, string>>({
        "problem_presented": "",
        "economic_and_family_background": "",
        "assessment": ""
    });

    const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
    const [othersValues, setOthersValues] = useState<Record<string, string>>({});

    const handleRadioChange = (groupName: string, value: string) => {
        setSelectedValues((prev) => ({ ...prev, [groupName]: value }));
        if (value !== "Others") {
            setOthersValues((prev) => ({ ...prev, [groupName]: "" }));
        }
    };

    const handleOthersInput = (groupName: string, value: string) => {
        setOthersValues((prev) => ({ ...prev, [groupName]: value }));
    };

    const handleTextAreaChange = (field: string, value: string) => {
        setTextAreas((prev) => ({ ...prev, [field]: value }));
    };

    const postValue = async () => {
        const result: Record<string, string> = {};
        result.projectId = "123"; // Example only

        const allGroups = [...objList, ...extraSections];
        for (const group of allGroups) {
            const selected = selectedValues[group.name];
            if (!selected) {
                toast(`Please select an option for "${group.name}".`);
                return null;
            }
            if (selected === "Others" && !othersValues[group.name]?.trim()) {
                toast(`Please specify the "Others" value for "${group.name}".`);
                return null;
            }
            result[group.code] = selected === "Others" ? othersValues[group.name].trim() : selected;
        }

        for (const key in textAreas) {
            if (!textAreas[key]?.trim()) {
                toast(`Please fill in the "${key.replace(/_/g, " ")}" section.`);
                return null;
            }
            result[key] = textAreas[key].trim();
        }

        console.log(result);

        const res = await runQuery("insertEvaluation", [
            result.projectId,
            result.type_of_house,
            result.other_source_of_income,
            result.occupation,
            result.monthly_income,
            result.number_of_meals,
            result.source_of_water_per_month,
            result.source_of_fuel_per_month,
            result.source_of_light_per_month,
            result.house_and_lot,
            result.appliances,
            result.economic_condition,
            result.expenditures_vs_income_analysis,
            result.evaluation_recommendation,
            result.problem_presented,
            result.economic_and_family_background,
            result.assessment
        ]);
        return res;
    };

    const renderGroup = (group: OptionGroup) => (
        <div key={group.name} className="mb-6">
            <h3 className="font-semibold bg-muted-foreground w-fit px-2 p-0 rounded-md">{group.name}</h3>
            <ul className="list-none p-0">
                {group.list.map((item, i) => (
                    <li key={i} className="mb-1">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={group.name}
                                value={item.code}
                                checked={selectedValues[group.name] === item.code}
                                onChange={() => handleRadioChange(group.name, item.code)}
                            />
                            {item.code}
                        </label>
                        {item.code === "Others" &&
                            selectedValues[group.name] === "Others" && (
                                <Input
                                    type="text"
                                    placeholder="Please specify"
                                    value={othersValues[group.name] || ""}
                                    onChange={(e) =>
                                        handleOthersInput(group.name, e.target.value)
                                    }
                                    className="ml-6 mt-1"
                                />
                            )}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="mt-4">
            {/* Grid Section */}
            <div className="grid grid-cols-3 gap-x-4">
                {objList.map(renderGroup)}
            </div>

            {/* Separate Sections */}
            <div className="mt-8 space-y-6">
                {extraSections.map(renderGroup)}
            </div>

            {/* Textareas */}
            <div className="mt-8 space-y-6">
                {Object.keys(textAreas).map((field) => (
                    <div key={field}>
                        <h3 className="font-semibold bg-muted-foreground w-fit px-2 p-0 rounded-md">{field.replace(/_/g, " ").toUpperCase()}:</h3>
                        <textarea
                            className="w-full mt-2 border rounded p-2"
                            rows={5}
                            placeholder={`Enter ${field.replace(/_/g, " ").toLowerCase()}...`}
                            value={textAreas[field]}
                            onChange={(e) => handleTextAreaChange(field, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <button
                className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => {
                    const values = postValue();
                }}
            > Get All Values
            </button>
        </div>
    );
}
