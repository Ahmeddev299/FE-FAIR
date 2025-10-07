import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function StartNewCard({ children }: Props) {
  return (
    <section className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-5 sm:p-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/loititle.png" width={28} height={22} alt="" />
          <h2 className="text-[15px] sm:text-base font-semibold text-gray-900">Start New LOI</h2>
        </div>

      </div>

      {/* blurb */}
      <p className="mt-3 text-[13px] text-gray-600">
        Create a new Letter of Intent using our step-by-step intake wizard. Our AI-powered platform
        will guide you through each section to ensure your LOI is comprehensive and professional.
      </p>

      {/* form controls injected by parent (Select LOI, etc.) */}
      <div className="mt-4">{children}</div>

      {/* footer chips */}
      <div className="mt-5 rounded-lg bg-[#EFF6FF] p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-900">What you will get:</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            "Professional LOI template",
            "AI-powered suggestions",
            "Save and resume anytime",
            "Export to PDF",
          ].map((t) => (
            <div key={t} className="flex items-center text-sm text-gray-700">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
