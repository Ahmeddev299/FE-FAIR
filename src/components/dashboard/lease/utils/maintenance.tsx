// utils/maintenanceHelpers.ts or components/lease/MaintenanceRow.tsx

import React from "react";
import { useFormikContext, Field } from "formik";

export const MAINTENANCE_CATEGORIES = [
  { key: "maintenance_structural", label: "Structural Repairs (foundation, roof, exterior walls)" },
  { key: "maintenance_non_structural", label: "Non-Structural Repairs (interior walls, ceilings, flooring)" },
  { key: "maintenance_hvac", label: "HVAC" },
  { key: "maintenance_plumbing", label: "Plumbing" },
  { key: "maintenance_electrical", label: "Electrical" },
  { key: "maintenance_common_areas", label: "Common Areas (lobbies, parking lots, landscaping)" },
  { key: "maintenance_utilities", label: "Utilities (gas, water, electricity connections)" },
  { key: "maintenance_special_equipment", label: "Special Equipment / Fixtures (if applicable)" },
] as const;

type MaintenanceKey = typeof MAINTENANCE_CATEGORIES[number]["key"];

export const MaintenanceRow: React.FC<{ rowKey: MaintenanceKey; label: string }> = ({
  rowKey,
  label,
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();

  const handleRadioChange = (party: "Landlord" | "Tenant") => {
    setFieldValue(rowKey, party);
  };

  const currentValue = values[rowKey];

  return (
    <div className="grid grid-cols-12 items-center border-b border-gray-100 p-4 hover:bg-gray-50">
      <div className="col-span-8 text-sm text-gray-700">{label}</div>
      
      <div className="col-span-2 flex justify-center">
        <input
          type="radio"
          name={rowKey}
          checked={currentValue === "Landlord"}
          onChange={() => handleRadioChange("Landlord")}
          className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="col-span-2 flex justify-center">
        <input
          type="radio"
          name={rowKey}
          checked={currentValue === "Tenant"}
          onChange={() => handleRadioChange("Tenant")}
          className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};