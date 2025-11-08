/* eslint-disable @typescript-eslint/no-explicit-any */

import { Field, FieldArray, useFormikContext } from "formik";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";

function nextExhibitTitle(currentCount: number) {
  const n = currentCount;
  let s = "";
  let x = n;
  while (true) {
    s = String.fromCharCode(65 + (x % 26)) + s;
    if (x < 26) break;
    x = Math.floor(x / 26) - 1;
  }
  return `Exhibit ${s} — `;
}

export function ExhibitsRepeater() {
  const { values, setFieldValue } = useFormikContext<any>();

  const handleFileChange = useCallback(
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.currentTarget.files?.[0] || null;
      setFieldValue(`exhibits.${idx}.file`, file);
      if (file) {
        const url = URL.createObjectURL(file);
        setFieldValue(`exhibits.${idx}.previewUrl`, url);
      } else {
        setFieldValue(`exhibits.${idx}.previewUrl`, "");
      }
    },
    [setFieldValue]
  );

  return (
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Exhibits to Collect / Attach</h4>
        <FieldArray
          name="exhibits"
          render={(arrayHelpers) => (
            <button
              type="button"
              onClick={() =>
                arrayHelpers.push({
                  title: nextExhibitTitle(values.exhibits?.length || 0),
                  notes: "",
                  file: null,
                  previewUrl: "",
                })
              }
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" /> Add Exhibit
            </button>
          )}
        />
      </div>

      <FieldArray
        name="exhibits"
        render={(arrayHelpers) => (
          <div className="space-y-6">
            {(values.exhibits || []).map((ex: any, idx: number) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-4 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="block text-sm font-medium">Title</label>
                    <Field
                      name={`exhibits.${idx}.title`}
                      placeholder="Exhibit A — Floor/Site Plan (Premises outline)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => arrayHelpers.remove(idx)}
                    className="shrink-0 mt-6 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    aria-label="Remove exhibit"
                    title="Remove exhibit"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                    <Field
                      as="textarea"
                      rows={3}
                      name={`exhibits.${idx}.notes`}
                      placeholder="Any details: version, date, constraints, cross-reference"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Attach Image / File</label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                        <ImageIcon className="w-4 h-4" />
                        <span>Choose file</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={handleFileChange(idx)}
                        />
                      </label>
                      {ex.file && <span className="text-xs text-gray-600 truncate">{ex.file.name}</span>}
                    </div>

                    {/* Preview for images only */}
                    {ex.previewUrl && ex.file?.type.startsWith("image/") && (
                      <div className="mt-3">
                        <Image
                        width={50}
                        height={50}
                          src={ex.previewUrl}
                          alt="Exhibit preview"
                          className="object-contain border rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
}
