import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { FiShoppingCart, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { user, userData, logout } = useAuthStore();
  const { items } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-secondary border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-accent">
          ROAR SPACE
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/shop" className="hover:text-accent transition">
            Shop
          </Link>
          <Link href="/about" className="hover:text-accent transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-accent transition">
            Contact
          </Link>

          {user && userData?.isAdmin && (
            <Link href="/admin" className="text-accent font-semibold">
              Admin
            </Link>
          )}

          {user && (
            <Link href="/orders" className="hover:text-accent transition">
              Orders
            </Link>
          )}

          {!user ? (
            <>
              <Link href="/login" className="hover:text-accent transition">
                Login
              </Link>
              <Link href="/signup" className="bg-accent text-primary px-4 py-2 rounded">
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-accent transition"
            >
              <FiLogOut /> Logout
            </button>
          )}

          <Link href="/cart" className="relative">
            <FiShoppingCart className="text-2xl hover:text-accent transition" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative">
            <FiShoppingCart className="text-2xl" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-accent/20 p-4 flex flex-col gap-4">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          {user && userData?.isAdmin && <Link href="/admin">Admin</Link>}
          {user && <Link href="/orders">Orders</Link>}
          {!user ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}