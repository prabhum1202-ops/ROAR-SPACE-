import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-accent mb-4">Your Cart</h1>
          <p className="text-gray-400 text-lg mb-8">Your cart is empty</p>
          <Link
            href="/shop"
            className="inline-block bg-accent text-primary px-8 py-3 rounded font-semibold hover:opacity-90 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-accent mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="bg-secondary rounded-lg p-6 flex gap-6"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 bg-primary rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-light mb-2">
                    {item.name}
                  </h3>
                  <p className="text-accent font-semibold mb-2">Size: {item.size}</p>
                  <p className="text-accent">₹{item.price.toLocaleString()}</p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <FiTrash2 className="text-xl" />
                  </button>

                  <div className="flex items-center gap-3 border-2 border-accent/30 rounded px-3 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity - 1)
                      }
                      className="hover:text-accent transition"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity + 1)
                      }
                      className="hover:text-accent transition"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <p className="text-lg font-bold text-accent">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-secondary rounded-lg p-6 h-fit">
            <h2 className="text-2xl font-bold text-accent mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 border-b border-accent/20 pb-6">
              <div className="flex justify-between text-light">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-light">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-light">
                <span>Tax</span>
                <span>₹{Math.round(getTotal() * 0.18).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-bold text-accent mb-6">
              <span>Total</span>
              <span>
                ₹{Math.round(getTotal() * 1.18).toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-accent text-primary px-6 py-3 rounded font-semibold text-center hover:opacity-90 transition mb-4"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
              className="w-full border-2 border-accent text-accent px-6 py-3 rounded font-semibold hover:bg-accent hover:text-primary transition"
            >
              Clear Cart
            </button>

            <Link
              href="/shop"
              className="block w-full text-center text-accent hover:text-light transition mt-4 py-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}