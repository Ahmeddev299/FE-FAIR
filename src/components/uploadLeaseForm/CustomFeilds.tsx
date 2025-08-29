import React from "react";
import { useFormikContext, ErrorMessage } from "formik";
import { ChevronDown } from "lucide-react";

/** Base props shared by all variants */
type BaseProps = {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
};

/** Variant-specific props */
type InputVariantProps = React.InputHTMLAttributes<HTMLInputElement> & {
  as?: "input";
  rows?: never;
  children?: never;
};

type TextareaVariantProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  as: "textarea";
  rows?: number;
  children?: never;
};

type SelectVariantProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  as: "select";
  rows?: never;
  children?: React.ReactNode; // options
};

/** Union for all variants */
type CustomFieldProps = BaseProps & (InputVariantProps | TextareaVariantProps | SelectVariantProps);

/** Allow any form shape; values are indexed by string keys */
type FormShape = Record<string, unknown>;

const baseInput =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 " +
  "disabled:bg-gray-100 disabled:text-gray-500";

export const CustomField: React.FC<CustomFieldProps> = ({
  name,
  label,
  as = "input",
  className = "",
  wrapperClassName = "",
  labelClassName = "",
  children,
  rows = 4,
  required,
  ...rest
}) => {
  const { values, handleChange, errors, touched } = useFormikContext<FormShape>();
  const id = (rest as { id?: string }).id ?? name;
  const invalid = Boolean((touched as Record<string, boolean | undefined>)?.[name] &&
                          (errors as Record<string, string | undefined>)?.[name]);

  const base = `${baseInput} ${invalid ? "border-red-500 ring-red-500/30" : ""} ${className}`;

  // Value from Formik (normalize to string for controlled inputs)
  const value = (values?.[name] ?? "") as string;

  // Properly typed change handlers that still call consumer's onChange if provided
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    (rest as React.InputHTMLAttributes<HTMLInputElement>).onChange?.(e);
  };
  const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e);
    (rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>).onChange?.(e);
  };
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
    (rest as React.SelectHTMLAttributes<HTMLSelectElement>).onChange?.(e);
  };

  return (
    <div className={`space-y-1 ${wrapperClassName}`}>
      <label htmlFor={id} className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onTextareaChange}
          className={base}
          required={required}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === "select" ? (
        <div className="relative">
          <select
            id={id}
            name={name}
            value={value}
            onChange={onSelectChange}
            className={`${base} appearance-none pr-9`}
            required={required}
            {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      ) : (
        <input
          id={id}
          name={name}
          value={value}
          onChange={onInputChange}
          className={base}
          required={required}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      <ErrorMessage name={name} component="p" className="text-xs text-red-500" />
    </div>
  );
};
