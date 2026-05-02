import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { deleteObject, ref } from 'firebase/storage';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-accent">Manage Products</h1>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded font-semibold hover:opacity-90 transition"
          >
            <FiPlus /> Add Product
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="bg-secondary rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg mb-4">No products yet</p>
            <Link
              href="/admin/products/new"
              className="inline-block bg-accent text-primary px-6 py-2 rounded font-semibold"
            >
              Create First Product
            </Link>
          </div>
        ) : (
          <div className="bg-secondary rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent/20">
                  <th className="px-6 py-4 text-left font-semibold text-accent">Product Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-accent">Price</th>
                  <th className="px-6 py-4 text-left font-semibold text-accent">Category</th>
                  <th className="px-6 py-4 text-left font-semibold text-accent">Stock</th>
                  <th className="px-6 py-4 text-left font-semibold text-accent">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-accent/10 hover:bg-primary/50 transition">
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">₹{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded font-semibold ${
                        product.stock > 0 ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-accent hover:text-light transition"
                        >
                          <FiEdit2 className="text-xl" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-400 transition"
                        >
                          <FiTrash2 className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}