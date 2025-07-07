import { DashboardLayout } from '@/components/layouts';

export default function Dashboard() {
    console.log("runnig")
  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your dashboard!</p>
      </div>
    </DashboardLayout>
  );
}
