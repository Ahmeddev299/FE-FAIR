// src/components/startlOI/customFeilds.tsx
import React from "react";
import {
  useFormikContext,
  type FormikContextType,
  type FormikValues,
} from "formik";

type FormShape = FormikValues; // or your concrete FormValues

// Value types that make sense for input/select/textarea
type FieldValue = string | number | readonly string[];

// Unified change handler for the three elements we support
type ChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;

type BaseProps =
  React.InputHTMLAttributes<HTMLInputElement> &
  React.SelectHTMLAttributes<HTMLSelectElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type Props = BaseProps & {
  name: string;
  label?: string;
  as?: "select" | "input" | "textarea";
  /** Fallback value/onChange when used outside <Formik> */
  value?: FieldValue;
  onChange?: ChangeHandler;
  children?: React.ReactNode;
};

export const CustomField: React.FC<Props> = ({
  name,
  label,
  as = "input",
  value: propValue,
  onChange: propOnChange,
  className,
  children,
  ...rest
}) => {
  // Formik may be null if no <Formik> wrapper
  const formik = useFormikContext<FormShape>() as
    | (FormikContextType<FormShape> & { values: FormShape })
    | null;

  const formikValue = formik?.values?.[name as keyof FormShape];

  const idProp = (rest as { id?: string }).id ?? name;

  // Build a typed change handler
  const handleChange: ChangeHandler | undefined = formik
    ? (formik.handleChange as unknown as ChangeHandler)
    : propOnChange;

  // Only control `value` when we truly have one
  let controlledValue: FieldValue | undefined;
  if (formik) {
    controlledValue = (formikValue as FieldValue) ?? "";
  } else if (typeof propValue !== "undefined") {
    controlledValue = propValue;
  }

  const touched =
    (formik?.touched as Record<string, boolean | undefined>)?.[
      name as string
    ];
  const error =
    (formik?.errors as Record<string, string | undefined>)?.[
      name as string
    ];
  const invalid = Boolean(formik && touched && error);

  const baseClasses = `rounded-lg border px-3 py-2 ${
    invalid ? "border-red-400" : "border-gray-300"
  } ${className ?? ""}`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={idProp} className="text-sm font-medium text-gray-800">
          {label}
        </label>
      )}

      {as === "select" ? (
        <select
          id={idProp}
          name={name}
          className={baseClasses}
          onChange={handleChange}
          // only add value when defined to avoid switching to controlled unintentionally
          {...(controlledValue !== undefined ? { value: controlledValue } : {})}
          {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {children}
        </select>
      ) : as === "textarea" ? (
        <textarea
          id={idProp}
          name={name}
          className={baseClasses}
          onChange={handleChange}
          {...(controlledValue !== undefined ? { value: controlledValue as string } : {})}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        >
          {children}
        </textarea>
      ) : (
        <input
          id={idProp}
          name={name}
          className={baseClasses}
          onChange={handleChange}
          {...(controlledValue !== undefined ? { value: controlledValue } : {})}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {formik && invalid && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
