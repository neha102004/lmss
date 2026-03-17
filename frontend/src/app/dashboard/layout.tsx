import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/DashboardNav';
import Chatbot from '@/components/Chatbot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <DashboardNav />
        <main>{children}</main>
        <Chatbot />
      </div>
    </ProtectedRoute>
  );
}
