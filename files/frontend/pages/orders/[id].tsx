import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from 'react-icons/fi';

interface Order {
  id: string;
  items: any[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: any;
  address: any;
}

const statusSteps = [
  { label: 'Order Confirmed', icon: FiCheckCircle },
  { label: 'Packed', icon: FiPackage },
  { label: 'Shipped', icon: FiTruck },
  { label: 'Delivered', icon: FiHome }
];

export default function OrderStatus() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const docRef = doc(db, 'orders', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) {
    return <Layout><div className="text-center py-16">Loading order details...</div></Layout>;
  }

  if (!order) {
    return <Layout><div className="text-center py-16">Order not found</div></Layout>;
  }

  const currentStepIndex = statusSteps.findIndex(s => s.label.toLowerCase() === order.orderStatus.toLowerCase());

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-accent mb-2">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-gray-400">
            Placed on {new Date(order.createdAt?.toDate?.()).toLocaleDateString()}
          </p>
        </div>

        {/* Status Timeline */}
        <div className="mb-12 bg-secondary rounded-lg p-8">
          <h2 className="text-2xl font-bold text-accent mb-8">Delivery Status</h2>
          <div className="flex justify-between">
            {statusSteps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={idx} className="flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition ${
                        isCompleted
                          ? 'bg-accent text-primary'
                          : 'bg-accent/20 text-accent'
                      } ${isCurrent ? 'ring-4 ring-accent/50' : ''}`}
                    >
                      <Icon className="text-2xl" />
                    </div>
                    <p className={`text-sm font-semibold ${isCompleted ? 'text-accent' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div
                      className={`h-1 mt-4 transition ${
                        isCompleted && idx < currentStepIndex ? 'bg-accent' : 'bg-accent/20'
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-12 bg-secondary rounded-lg p-8">
          <h2 className="text-2xl font-bold text-accent mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-accent/20 pb-4">
                <div>
                  <p className="font-semibold text-light">{item.name}</p>
                  <p className="text-gray-400">Size: {item.size} x {item.quantity}</p>
                </div>
                <p className="font-bold text-accent">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-secondary rounded-lg p-8">
            <h2 className="text-2xl font-bold text-accent mb-6">Delivery Address</h2>
            <div className="text-gray-300 space-y-2">
              <p className="font-semibold">{order.address.name}</p>
              <p>{order.address.fullAddress}</p>
              <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
              <p>Phone: {order.address.phone}</p>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-8">
            <h2 className="text-2xl font-bold text-accent mb-6">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>₹{Math.round(order.totalAmount / 1.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax (18%):</span>
                <span>₹{(order.totalAmount - Math.round(order.totalAmount / 1.18)).toLocaleString()}</span>
              </div>
              <div className="border-t border-accent/20 pt-3 flex justify-between font-bold text-accent text-lg">
                <span>Total:</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="mt-4 p-3 bg-primary rounded">
                <p className="text-sm text-gray-400">Payment Status:</p>
                <p className="font-semibold text-green-500">{order.paymentStatus.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}