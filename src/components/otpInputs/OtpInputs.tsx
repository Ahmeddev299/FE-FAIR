import React, { useEffect, useRef } from "react";
import { useField } from "formik";

type Props = {
  name: string;
  length?: number;     // 4, 5, 6...
  autoFocus?: boolean;
  className?: string;
};

const OTPInput: React.FC<Props> = ({ name, length = 5, autoFocus, className }) => {
  const [field, meta, helpers] = useField<string>(name);
  const { value = "" } = field;
  const { setValue, setTouched } = helpers;

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const chars = Array.from({ length }, (_, i) => value[i] ?? "");

  const focusIndex = (i: number) => {
    const el = inputsRef.current[i];
    if (el) {
      el.focus();
      el.select();
    }
  };

  useEffect(() => {
    if (autoFocus) focusIndex(0);
  }, [autoFocus]); // include in deps

  const setAt = (idx: number, ch: string) => {
    const arr = [...chars];
    arr[idx] = ch;
    setValue(arr.join(""));
  };

  const handleChange =
    (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/\D/g, "");
      if (!digits) {
        setAt(i, "");
        return;
      }

      // single digit typed
      if (digits.length === 1) {
        setAt(i, digits);
        if (i < length - 1) focusIndex(i + 1);
        else setTouched(true);
        return;
      }

      // paste scenario
      const arr = [...chars];
      const pasted = digits.slice(0, length - i).split("");
      pasted.forEach((d, k) => (arr[i + k] = d));
      setValue(arr.join(""));
      const next = Math.min(i + pasted.length, length - 1);
      focusIndex(next);
      if (next === length - 1) setTouched(true);
    };

  const handleKeyDown =
    (i: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (chars[i]) {
          setAt(i, "");
        } else if (i > 0) {
          setAt(i - 1, "");
          focusIndex(i - 1);
        }
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && i > 0) {
        e.preventDefault();
        focusIndex(i - 1);
      } else if (e.key === "ArrowRight" && i < length - 1) {
        e.preventDefault();
        focusIndex(i + 1);
      }
    };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!digits) return;
    e.preventDefault();
    setValue(digits.slice(0, length));
    focusIndex(Math.min(digits.length, length) - 1);
    setTouched(true);
  };

  return (
    <div className={className}>
      <div
        className="flex justify-center gap-3"
        onPaste={handlePaste}
        role="group"
        aria-label="One-time code"
      >
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el; // <-- return void (no value returned)
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d*"
            maxLength={1}
            value={chars[i]}
            onChange={handleChange(i)}
            onKeyDown={handleKeyDown(i)}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => i === length - 1 && setTouched(true)}
            className="w-12 h-12 rounded-lg border-2 border-gray-300 text-center text-xl font-semibold
                       focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
          />
        ))}
      </div>

      {/* keep the Formik field in form state */}
      <input type="hidden" {...field} />

      {meta.touched && meta.error ? (
        <p className="mt-2 text-sm text-red-600 text-center">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default OTPInput;
