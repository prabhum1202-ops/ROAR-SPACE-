import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function Checkout() {
  const router = useRouter();
  const { user, userData } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  const [address, setAddress] = useState<Address>({
    firstName: userData?.name?.split(' ')[0] || '',
    lastName: userData?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
    }
  }, [user, items, router]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';

      script.onload = async () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: Math.round(getTotal() * 1.18 * 100),
          currency: 'INR',
          name: 'Roar Space',
          description: 'Premium Streetwear',
          prefill: {
            name: `${address.firstName} ${address.lastName}`,
            email: address.email,
            contact: address.phone,
          },
          handler: async (response: any) => {
            await createOrder(response.razorpay_payment_id);
          },
          theme: {
            color: '#d4af37',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (paymentId?: string) => {
    try {
      const orderData = {
        userId: user?.uid,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: Math.round(getTotal() * 1.18),
        paymentMethod,
        paymentStatus: paymentMethod === 'razorpay' ? 'completed' : 'pending',
        paymentId: paymentId || null,
        orderStatus: 'pending',
        address: {
          name: `${address.firstName} ${address.lastName}`,
          email: address.email,
          phone: address.phone,
          fullAddress: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // Update product stock
      for (const item of items) {
        const productRef = doc(db, 'products', item.id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const currentStock = productDoc.data().stock;
          await updateDoc(productRef, {
            stock: Math.max(0, currentStock - item.quantity),
          });
        }
      }

      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${docRef.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    }
  };

  const handleCODOrder = async () => {
    try {
      setLoading(true);
      await createOrder();
    } finally {
      setLoading(false);
    }
  };

  if (!user || items.length === 0) {
    return <Layout><div className="text-center py-12">Loading...</div></Layout>;
  }

  const total = Math.round(getTotal() * 1.18);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-accent mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <div className="bg-secondary rounded-lg p-6">
              <h2 className="text-2xl font-bold text-accent mb-6">Delivery Address</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={address.firstName}
                  onChange={handleAddressChange}
                  className="bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={address.lastName}
                  onChange={handleAddressChange}
                  className="bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={address.email}
                onChange={handleAddressChange}
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600 mb-4"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={address.phone}
                onChange={handleAddressChange}
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600 mb-4"
              />

              <textarea
                name="address"
                placeholder="Street Address"
                value={address.address}
                onChange={handleAddressChange}
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600 mb-4 h-24"
              />

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleAddressChange}
                  className="bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleAddressChange}
                  className="bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  className="bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light placeholder-gray-600"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-secondary rounded-lg p-6">
              <h2 className="text-2xl font-bold text-accent mb-6">Payment Method</h2>

              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border-2 border-accent/20 rounded cursor-pointer hover:border-accent transition">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-light">Razorpay</p>
                    <p className="text-sm text-gray-400">
                      Pay online using credit/debit card, UPI, or net banking
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-4 border-2 border-accent/20 rounded cursor-pointer hover:border-accent transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-light">Cash on Delivery</p>
                    <p className="text-sm text-gray-400">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-secondary rounded-lg p-6 h-fit">
            <h2 className="text-2xl font-bold text-accent mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 border-b border-accent/20 pb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm text-light">
                  <span>
                    {item.name} x{item.quantity} (Size: {item.size})
                  </span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 border-b border-accent/20 pb-6">
              <div className="flex justify-between text-light">
                <span>Subtotal</span>
                <span>₹{getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-light">
                <span>Tax (18%)</span>
                <span>₹{Math.round(getTotal() * 0.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-light">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-bold text-accent mb-6">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            {paymentMethod === 'razorpay' ? (
              <button
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full bg-accent text-primary px-6 py-3 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay with Razorpay'}
              </button>
            ) : (
              <button
                onClick={handleCODOrder}
                disabled={loading}
                className="w-full bg-accent text-primary px-6 py-3 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order (COD)'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}