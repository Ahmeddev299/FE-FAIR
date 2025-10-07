import React from "react";
import { Sparkles, CheckCircle, FileText, LifeBuoy } from "lucide-react";

type CardProps = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

const FeatureCard: React.FC<CardProps> = ({ title, desc, icon, ctaLabel, onCtaClick }) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <div className="flex items-start gap-3 mb-2">
      <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-700 text-sm leading-snug pl-[52px] -mt-2">{desc}</p>

    {ctaLabel && (
      <button
        onClick={onCtaClick}
        className="mt-3 ml-[52px] w-full bg-gray-50 font-semibold text-gray-900 h-10 rounded-lg text-sm hover:bg-gray-100 transition"
      >
        {ctaLabel}
      </button>
    )}
  </div>
);

/** Sidebar stack used on the LOI start page */
export const WhyUseLoiSidebar: React.FC<{ onSupport?: () => void }> = ({ onSupport }) => {
  return (
    <aside className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-2">Why Use Our LOI Wizard?</h2>
        <div className="flex flex-col gap-3">
          <FeatureCard
            title="AI-Powered Assistance"
            desc="Get intelligent suggestions and guidance throughout the process."
            icon={<Sparkles className="h-5 w-5 text-blue-600" />}
          />
          <FeatureCard
            title="Step-by-Step Wizard"
            desc="Complete your LOI with our intuitive guided workflow."
            icon={<CheckCircle className="h-5 w-5 text-blue-600" />}
          />
          <FeatureCard
            title="Professional Templates"
            desc="Use industry-standard LOI templates tailored for commercial leases."
            icon={<FileText className="h-5 w-5 text-blue-600" />}
          />
        </div>
      </div>

      <FeatureCard
        title="Need Help?"
        desc="Our support team is here to assist you with any questions about the LOI process."
        icon={<LifeBuoy className="h-5 w-5 text-blue-600" />}
        ctaLabel="Contact Support"
        onCtaClick={onSupport}
      />
    </aside>
  );
};
