"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"


type Option = { value: string; label: string }

interface MultiSelectDropdownProps {
    options: Option[]
    value: string[]
    onChange: (next: string[]) => void
    placeholder?: string
    className?: string
    maxBadge?: number // how many badges to show before collapsing to "+N"
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select…",
    maxBadge = 3,
}) => {
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const toggle = (val: string) => {
        const set = new Set(value)
        set.has(val) ? set.delete(val) : set.add(val)
        onChange(Array.from(set))
    }

    const clearOne = (val: string) => {
        onChange(value.filter((v) => v !== val))
    }
    const [filtered, setFiltered] = React.useState<Option[]>(options)


    const selected = options.filter((o) => value.includes(o.value))

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} className={"Flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-100 "
            }>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full flex justify-between items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-left"
            >
                {selected.length === 0 ? (
                    <span className="text-gray-400">{placeholder}</span>
                ) : (
                    <div className="flex flex-wrap gap-1">
                        {selected.slice(0, maxBadge).map((opt) => (
                            <span
                                key={opt.value}
                                className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-sm"
                            >
                                {opt.label}
                                <X
                                    className="h-3 w-3 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        clearOne(opt.value)
                                    }}
                                />
                            </span>
                        ))}
                        {selected.length > maxBadge && (
                            <span className="rounded border px-2 py-0.5 text-xs text-gray-600">
                                +{selected.length - maxBadge}
                            </span>
                        )}
                    </div>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>

            {/* Dropdown list */}
            {open && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-md">
                    <input
                        type="text"
                        placeholder="Search…"
                        className="w-full border-b px-2 py-1 text-sm outline-none"
                        onChange={(e) => {
                            const search = e.target.value.toLowerCase()
                            const filtered = options.filter((o) =>
                                o.label.toLowerCase().includes(search)
                            )
                            // hack: just set filtered list inside options (could also manage state)
                            setFiltered(filtered)
                        }}
                    />
                    <div className="max-h-48 overflow-y-auto">
                        {options.map((opt) => {
                            const checked = value.includes(opt.value)
                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => toggle(opt.value)}
                                    className=
                                    "flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-100"


                                >
                                    <Check className={`mr-2 h-4 w-4 ${checked ? "opacity-100" : "opacity-0"}`} />

                                    {opt.label}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
