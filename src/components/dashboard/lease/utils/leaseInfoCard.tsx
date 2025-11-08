/* eslint-disable @typescript-eslint/no-explicit-any */

import { Building2, User, FileText, Calendar, DollarSign } from "lucide-react";
import { InfoCard } from "./InfoCard";

interface LeaseInfoCardsProps {
  leaseInfo: any;
}

export const LeaseInfoCards: React.FC<LeaseInfoCardsProps> = ({ leaseInfo }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <InfoCard icon={Building2} label="Lease Type" value={leaseInfo.leaseType} />
    <InfoCard icon={User} label="Landlord" value={leaseInfo.landlordName} />
    <InfoCard icon={User} label="Tenant" value={leaseInfo.tenantName} />
    <InfoCard
      icon={FileText}
      label="Square Footage"
      value={
        typeof leaseInfo.squareFootage === "number"
          ? `${leaseInfo.squareFootage.toLocaleString()} SF`
          : leaseInfo.squareFootage
      }
    />
    <InfoCard
      icon={Calendar}
      label="Start Date"
      value={leaseInfo.startDate ? new Date(leaseInfo.startDate).toLocaleDateString() : "—"}
    />
    <InfoCard
      icon={Calendar}
      label="End Date"
      value={leaseInfo.endDate ? new Date(leaseInfo.endDate).toLocaleDateString() : "—"}
    />
    <InfoCard icon={DollarSign} label="Base Rent" value={leaseInfo.rentAmount} />
    <InfoCard icon={DollarSign} label="Security Deposit" value={leaseInfo.securityDeposit} />
  </div>
);
