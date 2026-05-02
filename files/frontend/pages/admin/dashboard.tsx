import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminLayout from '@/components/AdminLayout';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  revenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersSnap = await getDocs(collection(db, 'orders'));
        let revenue = 0;
        let pendingOrders = 0;

        ordersSnap.forEach((doc) => {
          const order = doc.data();
          revenue += order.totalAmount || 0;
          if (order.orderStatus === 'pending') {
            pendingOrders += 1;
          }
        });

        setStats({
          totalOrders: ordersSnap.size,
          totalSales: ordersSnap.size,
          revenue,
          pendingOrders,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-accent mb-12">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Stats Cards */}
          {[
            { label: 'Total Orders', value: stats.totalOrders, color: 'bg-blue-600' },
            { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, color: 'bg-green-600' },
            { label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-yellow-600' },
            { label: 'Total Sales', value: stats.totalSales, color: 'bg-purple-600' },
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.color} rounded-lg p-6 text-white`}>
              <p className="text-sm font-semibold opacity-90 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-secondary rounded-lg p-6">
            <h2 className="text-2xl font-bold text-accent mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/products')}
                className="w-full bg-accent text-primary px-6 py-3 rounded font-semibold hover:opacity-90 transition"
              >
                Manage Products
              </button>
              <button
                onClick={() => router.push('/admin/orders')}
                className="w-full bg-accent text-primary px-6 py-3 rounded font-semibold hover:opacity-90 transition"
              >
                View Orders
              </button>
              <button
                onClick={() => router.push('/admin/products/new')}
                className="w-full border-2 border-accent text-accent px-6 py-3 rounded font-semibold hover:bg-accent hover:text-primary transition"
              >
                Add New Product
              </button>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-6">
            <h2 className="text-2xl font-bold text-accent mb-4">Recent Activity</h2>
            <p className="text-gray-400">No recent activity</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}