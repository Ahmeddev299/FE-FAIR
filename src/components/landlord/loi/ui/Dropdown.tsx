import clsx from "clsx";

type Props = {
  className?: string;
  value: string;
  onChange: (v: string) => void;
  items: string[];
};
export default function Dropdown({ className, value, onChange, items }: Props) {
  return (
    <div className={clsx("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-200"
      >
        {items.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.112l3.71-3.88a.75.75 0 111.08 1.04l-4.24 4.43a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
      </svg>
    </div>
  );
}
