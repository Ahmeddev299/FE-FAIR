import React from "react";
import { useFormikContext, ErrorMessage } from "formik";
import { ChevronDown } from "lucide-react";

type Props = React.PropsWithChildren<{
  name: string;
  label: string;
  as?: "input" | "textarea" | "select";
  type?: string;
  required?: boolean;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  rows?: number;
  [key: string]: any; // for onChange, value, etc.
}>;

const baseInput =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 " +
  "disabled:bg-gray-100 disabled:text-gray-500";

export const CustomField: React.FC<Props> = ({
  name,
  label,
  as = "input",
  className = "",
  wrapperClassName = "",
  labelClassName = "",
  children,
  rows = 4,
  ...rest
}) => {
  const { values, handleChange, errors, touched } = useFormikContext<any>();
  const id = rest.id ?? name;
  const invalid = touched?.[name] && !!errors?.[name];

  const onChange = (e: React.ChangeEvent<any>) => {
    handleChange(e);           // Formik
    rest.onChange?.(e);        // Your custom handler (e.g., select -> autofill)
  };

  const base = `${baseInput} ${invalid ? "border-red-500 ring-red-500/30" : ""} ${className}`;

  return (
    <div className={`space-y-1 ${wrapperClassName}`}>
      <label htmlFor={id} className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
        {label} {rest.required && <span className="text-red-500">*</span>}
      </label>

      {as === "textarea" && (
        <textarea id={id} name={name} rows={rows} value={values?.[name] ?? ""} onChange={onChange} className={base} {...rest} />
      )}

      {as === "select" && (
        <div className="relative">
          <select id={id} name={name} value={values?.[name] ?? ""} onChange={onChange} className={`${base} appearance-none pr-9`} {...rest}>
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      )}

      {as === "input" && (
        <input id={id} name={name} value={values?.[name] ?? ""} onChange={onChange} className={base} {...rest} />
      )}

      <ErrorMessage name={name} component="p" className="text-xs text-red-500" />
    </div>
  );
};
