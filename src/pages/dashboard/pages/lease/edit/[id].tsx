import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CreateLeaseForm from '../../createLeaseform';

export default function EditLeasePage() {
  const router = useRouter();
  const { id } = router.query;

  const [leaseId, setLeaseId] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady && typeof id === 'string') {
      setLeaseId(id);
    }
  }, [id, router.isReady]);

  if (!leaseId) return <div>Loading...</div>;

  return <CreateLeaseForm mode="edit" leaseId={leaseId} />;
}
