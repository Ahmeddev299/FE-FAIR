import React, { JSX } from "react";
import { Save, FileText, Edit3, Bot } from "lucide-react";

interface FormHeaderProps {
  mode?: "edit" | "create";
  onSaveDraft: () => void;
  isLoading?: boolean;
  lastSaved?: string | null;
  aiEnabled?: boolean;
  onOpenAi?: () => void;
  aiBusy?: boolean;
}

export function FormHeader({
  mode = "create",
  onSaveDraft,
  isLoading = false,
  lastSaved,
  aiEnabled = false,
  onOpenAi,
  aiBusy = false,
}: FormHeaderProps): JSX.Element {
  const getTitle = (): string =>
    mode === "edit" ? "Update Draft lease" : "Create New Lease";

  const getSubtitle = (): string =>
    mode === "edit"
      ? "Update your existing Letter of Intent draft"
      : "Complete the form to create your Lease";

  const getIcon = (): JSX.Element =>
    mode === "edit" ? (
      <Edit3 className="h-5 w-5 sm:h-6 sm:w-6" />
    ) : (
      <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
    );

  const formattedLastSaved =
    lastSaved && !Number.isNaN(new Date(lastSaved).getTime())
      ? new Date(lastSaved).toLocaleString()
      : null;

  const aiDisabled = !aiEnabled || aiBusy;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      {/* layout: stack on mobile, split on md+ */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left: title/subtitle */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 sm:p-2.5 bg-blue-100 rounded-lg text-blue-600">
            {getIcon()}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {getTitle()}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {getSubtitle()}
            </p>
            {formattedLastSaved && mode === "edit" && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Last updated: {formattedLastSaved}
              </p>
            )}
          </div>
        </div>

        {/* Right: actions (wrap on small screens) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {formattedLastSaved && (
            <div className="w-full sm:w-auto text-xs sm:text-sm text-gray-500">
              Auto-saved
            </div>
          )}

          {/* Save Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
              isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Save draft"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? "Saving..." : "Save Draft"}</span>
          </button>

          {/* AI Assistant */}
          <button
            type="button"
            onClick={aiDisabled ? undefined : onOpenAi}
            disabled={aiDisabled}
            className={`inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
              aiDisabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            title={aiEnabled ? "Open AI Assistant" : "Available on Final Review step"}
            aria-label="Open AI Assistant"
          >
            <Bot className="h-4 w-4" />
            <span>{aiBusy ? "Loading..." : "AI Assistant"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
