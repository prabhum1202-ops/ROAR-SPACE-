import { useEffect, useState } from 'react';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminLayout from '@/components/AdminLayout';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: any;
  address: any;
  items: any[];
}

const ORDER_STATUSES = ['pending', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  if (loading) {
    return <AdminLayout><div className="text-center py-12">Loading orders...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-accent mb-8">Manage Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-secondary rounded-lg p-8 text-center text-gray-400">
            No orders yet
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-secondary rounded-lg p-6 border-l-4 border-accent">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Order ID</p>
                    <p className="font-semibold text-light">{order.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Amount</p>
                    <p className="font-semibold text-accent">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Customer</p>
                    <p className="font-semibold text-light">{order.address.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="font-semibold text-light">
                      {new Date(order.createdAt?.toDate?.()).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment</p>
                    <p className={`font-semibold ${order.paymentStatus === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {order.paymentStatus.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">Order Status</p>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className={`bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light font-semibold capitalize ${
                      order.orderStatus === 'delivered' ? 'text-green-500' : 'text-accent'
                    }`}
                  >
                    {ORDER_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-accent hover:text-light transition text-sm font-semibold"
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Order Details */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-secondary rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
              <h2 className="text-2xl font-bold text-accent mb-6">Order Details</h2>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Delivery Address</p>
                    <p className="text-light">{selectedOrder.address.fullAddress}</p>
                    <p className="text-gray-400">{selectedOrder.address.city}, {selectedOrder.address.state}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Contact</p>
                    <p className="text-light">{selectedOrder.address.phone}</p>
                    <p className="text-gray-400">{selectedOrder.address.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Items</p>
                  {selectedOrder.items.map((item, idx) => (
                    <p key={idx} className="text-light">
                      {item.name} x{item.quantity} (Size: {item.size}) - ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-accent text-primary py-2 rounded font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}