import React from 'react';
import { FullLOI } from '@/types/loi'; // adjust path

interface LoiDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FullLOI; // adjust to your full LOI type if needed
}

const LoiDetailsModal: React.FC<LoiDetailsModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const sectionTitle = (text: string) => (
    <h3 className="text-md font-semibold text-gray-800 mt-6 mb-2 border-b pb-1">{text}</h3>
  );

  const twoColItem = (label: string, value: string | number | boolean | null) => (
    <div className="grid grid-cols-2 gap-2 text-sm py-1">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-700">{value || '—'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-1 text-gray-900">Letter of Intent</h2>

        {sectionTitle('Basic Info')}
        {twoColItem('Title', data.title)}
        {twoColItem('Property Address', data.propertyAddress)}
        {twoColItem('Status', data.submit_status)}

        {sectionTitle('Party Info')}
        {twoColItem('Landlord Name', data.partyInfo?.landlord_name)}
        {twoColItem('Landlord Email', data.partyInfo?.landlord_email)}
        {twoColItem('Tenant Name', data.partyInfo?.tenant_name)}
        {twoColItem('Tenant Email', data.partyInfo?.tenant_email)}

        {sectionTitle('Lease Terms')}
        {twoColItem('Monthly Rent', `$${data.leaseTerms?.monthlyRent}`)}
        {twoColItem('Security Deposit', `$${data.leaseTerms?.securityDeposit}`)}
        {twoColItem('Lease Type', data.leaseTerms?.leaseType)}
        {twoColItem('Lease Duration', data.leaseTerms?.leaseDuration)}

        {sectionTitle('Property Details')}
        {twoColItem('Property Size', data.propertyDetails?.propertySize)}
        {twoColItem('Intended Use', data.propertyDetails?.intendedUse)}
        {twoColItem('Property Type', data.propertyDetails?.propertyType)}
        {twoColItem('Amenities', data.propertyDetails?.amenities?.join(', ') || '—')}
        {twoColItem('Utilities', data.propertyDetails?.utilities?.join(', ') || '—')}

        {sectionTitle('Additional Details')}
        {twoColItem('Renewal Option', data.additionalDetails?.renewalOption ? 'Yes' : 'No')}
        {twoColItem('Tenant Improvement', data.additionalDetails?.tenantImprovement)}
        {twoColItem('Special Conditions', data.additionalDetails?.specialConditions)}
        {twoColItem('Contingencies', data.additionalDetails?.contingencies)}
      </div>
    </div>
  );
};

export default LoiDetailsModal;
