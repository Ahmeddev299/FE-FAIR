import React, { useEffect, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { CustomField } from './CustomFeilds';
import { getloiDataAsync } from '@/services/dashboard/asyncThunk';
import { LoadingOverlay } from '../loaders/overlayloader';

type LOI = {
  id: string;
  title?: string;
  propertyAddress?: string;
  startDate?: string; // ISO (yyyy-mm-dd)
  endDate?: string;   // ISO (yyyy-mm-dd)
};

type FormValues = {
  leaseId: string;
  leaseTitle: string;
  startDate: string;
  endDate: string;
  propertyAddress: string;
  notes: string;
};

export const ContextForm: React.FC = () => {
  const dispatch = useDispatch();
  const { myLOIs, isLoading } = useSelector((s: any) => s.dashboard);
  console.log("mylois", myLOIs)
  const { setFieldValue, values } = useFormikContext<FormValues>();

  // fetch once (avoid refetch if already in store)
  useEffect(() => {
    if (!myLOIs || myLOIs.length === 0) {
      dispatch(getloiDataAsync() as any);
    }
  }, [dispatch]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    

    const selected = myLOIs?.find((x: LOI) => x.id === id);
    if (selected) {
        setFieldValue('leaseId', id);
      setFieldValue('leaseTitle', selected.title || '');
      setFieldValue('propertyAddress', selected.propertyAddress || '');
      setFieldValue('startDate', (selected.startDate || '').slice(0, 10));
      setFieldValue('endDate', (selected.endDate || '').slice(0, 10));
    } else {
      // clear if none selected
      setFieldValue('leaseTitle', '');
      setFieldValue('propertyAddress', '');
      setFieldValue('startDate', '');
      setFieldValue('endDate', '');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between flex-wrap gap-2">
        <span className="flex items-center font-semibold min-w-0 flex-1">
          <AlertCircle className="w-6 h-6 mr-2 flex-shrink-0" />
          <span className="truncate">Context Information</span>
        </span>
        <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded flex-shrink-0">Required</span>
      </h3>

      <div className="space-y-4">
        {/* LOI Select */}
        <CustomField
          name="leaseId"
          label="Select LOI"
          as="select"
          required
          onChange={handleSelect} // IMPORTANT: forward onChange to Formik
          value={values.leaseId}
        >
          <option value="">-- Select a LOI --</option>
          {isLoading && <LoadingOverlay isVisible={true}/>}
          {myLOIs?.map((loi: LOI) => (
            console.log("loi", loi),
            <option key={loi.id} value={loi.id}>
              {loi.title} {loi.propertyAddress ? `— ${loi.propertyAddress}` : ''}
            </option>
          ))}
          {!isLoading && (!myLOIs || myLOIs.length === 0) && (
            <option disabled>No LOIs found</option>
          )}
        </CustomField>

        <CustomField
          name="leaseTitle"
          label="Lease Title"
          placeholder="e.g., Downtown Office Lease Agreement"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomField name="startDate" label="Start Date" type="date" required />
          <CustomField name="endDate" label="End Date" type="date" required />
        </div>

        <CustomField
          name="propertyAddress"
          label="Property Address"
          placeholder="123 Main Street, City, State, ZIP"
          required
        />

        <CustomField
          name="notes"
          label="Notes"
          as="textarea"
          rows={3}
          placeholder="Any additional notes or context about this lease"
        />
      </div>
    </div>
  );
};
