import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function Signup() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-secondary rounded-lg p-8">
          <h1 className="text-3xl font-bold text-accent mb-8 text-center">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-light font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600 focus:border-accent focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-light font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600 focus:border-accent focus:outline-none"
                placeholder="your@email.com"
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
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600 focus:border-accent focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-light font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600 focus:border-accent focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-primary py-3 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:text-light transition font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}