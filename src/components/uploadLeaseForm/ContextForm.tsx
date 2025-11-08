import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { CustomField } from './CustomFeilds';
import { getloiDataAsync } from '@/services/dashboard/asyncThunk';
import { LoadingOverlay } from '../loaders/overlayloader';
import type { RootState, AppDispatch } from '@/redux/store';  
import { LoiSummary } from '@/redux/slices/dashboardSlice';

type FormValues = {
  leaseId: string;
  leaseTitle: string;
  startDate: string;
  endDate: string;
  propertyAddress: string;
  notes: string;
};

export const ContextForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { myLOIs, isLoading } = useSelector((s: RootState) => s.dashboard);
  const { setFieldValue, values } = useFormikContext<FormValues>();

  useEffect(() => {
   
      dispatch(getloiDataAsync());
    
  }, [dispatch]); 

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const selected = myLOIs?.find((x: LoiSummary) => (x.id ?? x._id) === id);

    if (selected) {
      setFieldValue('leaseId', id);

    } else {
      setFieldValue('leaseTitle', '');
      setFieldValue('propertyAddress', '');
      setFieldValue('startDate', '');
      setFieldValue('endDate', '');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="space-y-4">
        {/* LOI Select */}
        <CustomField
          name="leaseId"
          label="Select LOI"
          as="select"
          onChange={handleSelect}
          value={values.leaseId}
        >
          <option value="">-- Select a LOI --</option>
          {isLoading && <LoadingOverlay visible={true} />}
          {myLOIs?.map((loi) => (
            <option key={loi.id} value={loi.id}>
              {loi.title} {loi.propertyAddress ? `— ${loi.propertyAddress}` : ''}
            </option>
          ))}
          {!isLoading && (!myLOIs || myLOIs.length === 0) && (
            <option disabled>No LOIs found</option>
          )}
        </CustomField>

      </div>
    </div>
  );
};
