import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { user, userData, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user && !userData?.isAdmin) {
      router.push('/admin/login');
    }
  }, [user, userData, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-primary text-light">
      {/* Sidebar */}
      <div className={`fixed md:static w-64 bg-secondary border-r border-accent/20 transform transition-transform duration-300 z-40 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 border-b border-accent/20">
          <h1 className="text-2xl font-bold text-accent">ROAR SPACE</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="p-6 space-y-4">
          <Link
            href="/admin/dashboard"
            className={`block px-4 py-2 rounded transition ${
              router.pathname === '/admin/dashboard'
                ? 'bg-accent text-primary'
                : 'hover:bg-accent/10'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={`block px-4 py-2 rounded transition ${
              router.pathname.includes('/admin/products')
                ? 'bg-accent text-primary'
                : 'hover:bg-accent/10'
            }`}
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className={`block px-4 py-2 rounded transition ${
              router.pathname === '/admin/orders'
                ? 'bg-accent text-primary'
                : 'hover:bg-accent/10'
            }`}
          >
            Orders
          </Link>
          <Link
            href="/admin/inventory"
            className={`block px-4 py-2 rounded transition ${
              router.pathname === '/admin/inventory'
                ? 'bg-accent text-primary'
                : 'hover:bg-accent/10'
            }`}
          >
            Inventory
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-accent text-primary p-2 rounded"
        >
          {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-auto">
        {children}
      </div>
    </div>
  );
}