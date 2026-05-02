import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AdminLayout from '@/components/AdminLayout';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';

interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  category: string;
  sizes: string[];
  stock: number;
  images: string[];
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories'];

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<Product>({
    name: '',
    price: 0,
    description: '',
    category: '',
    sizes: [],
    stock: 0,
    images: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!isNew && id) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, 'products', id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
            setPreviewUrls(docSnap.data().images || []);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseInt(value) : value
    }));
  };

  const handleSizeToggle = (size: string) => {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    if (index < imageFiles.length) {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrls = product.images || [];

      // Upload new images
      for (const file of imageFiles) {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      const productData = {
        ...product,
        images: imageUrls,
        updatedAt: serverTimestamp(),
      };

      if (isNew) {
        await setDoc(doc(db, 'products', `product_${Date.now()}`), {
          ...productData,
          createdAt: serverTimestamp(),
        });
        toast.success('Product created successfully!');
      } else {
        await updateDoc(doc(db, 'products', id as string), productData);
        toast.success('Product updated successfully!');
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLayout><div className="text-center py-12">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-accent mb-8">
          {isNew ? 'Add New Product' : 'Edit Product'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 bg-secondary rounded-lg p-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-light font-semibold mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light"
              />
            </div>

            <div>
              <label className="block text-light font-semibold mb-2">Category</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-light font-semibold mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light"
              />
            </div>

            <div>
              <label className="block text-light font-semibold mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                required
                className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-light font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={5}
              className="w-full bg-primary border-2 border-accent/20 rounded px-4 py-2 text-light"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-light font-semibold mb-4">Available Sizes</label>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`py-2 px-3 border-2 rounded font-semibold transition ${
                    product.sizes.includes(size)
                      ? 'border-accent bg-accent text-primary'
                      : 'border-accent/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-light font-semibold mb-4">Product Images</label>
            <div className="border-2 border-dashed border-accent/30 rounded-lg p-8 text-center mb-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-input"
              />
              <label
                htmlFor="image-input"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FiUpload className="text-4xl text-accent" />
                <p className="text-light">Click to upload images</p>
                <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
              </label>
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${idx}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-accent text-primary py-3 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isNew ? 'Create Product' : 'Update Product'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="flex-1 border-2 border-accent text-accent py-3 rounded font-semibold hover:bg-accent hover:text-primary transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}