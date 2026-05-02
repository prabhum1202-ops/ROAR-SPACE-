import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (!userData?.isAdmin) {
        toast.error('You do not have admin access');
        return;
      }

      toast.success('Admin login successful!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-secondary rounded-lg p-8 border-2 border-accent/30">
        <h1 className="text-3xl font-bold text-accent mb-2 text-center">ROAR SPACE</h1>
        <p className="text-center text-gray-400 mb-8">Admin Panel</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-light font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600"
              placeholder="admin@roarspace.com"
            />
          </div>

          <div>
            <label className="block text-light font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-primary py-3 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>
      </div>
    </div>
  );
}