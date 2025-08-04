import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CreateLoiForm from '@/pages/dashboard/pages/createform';

export default function EditLOIPage() {
  const router = useRouter();
  const { id } = router.query;

  // Optional: Wait until router is ready
  const [loiId, setLoiId] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady && typeof id === 'string') {
      setLoiId(id);
    }
  }, [id, router.isReady]);

  if (!loiId) return <div>Loading...</div>;

  return <CreateLoiForm mode="edit" loiId={loiId} />;
}
