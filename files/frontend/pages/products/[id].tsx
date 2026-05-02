import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCartStore } from '@/store/cartStore';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  stock: number;
  category: string;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          router.push('/shop');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (quantity <= 0) {
      toast.error('Please select a quantity');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.images[0],
    });

    toast.success('Added to cart!');
    setQuantity(1);
    setSelectedSize('');
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-secondary rounded-lg h-96 animate-pulse"></div>
            <div className="space-y-4">
              <div className="bg-secondary h-8 rounded animate-pulse"></div>
              <div className="bg-secondary h-24 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-12">Product not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative h-96 md:h-screen bg-secondary rounded-lg overflow-hidden mb-4">
              <Image
                src={product.images[mainImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(idx)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition ${
                      mainImage === idx ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <p className="text-accent text-sm font-semibold mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-light mb-4">{product.name}</h1>
              <p className="text-2xl text-accent font-bold mb-4">
                ₹{product.price.toLocaleString()}
              </p>
              <p className="text-gray-400 text-lg">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <p className="text-green-500 font-semibold">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-500 font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-light mb-4">Select Size</h3>
              <div className="grid grid-cols-4 gap-3">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-2 border-2 rounded font-semibold transition ${
                      selectedSize === size
                        ? 'border-accent bg-accent text-primary'
                        : 'border-accent/30 hover:border-accent'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold text-light mb-4">Quantity</h3>
              <div className="flex items-center gap-4 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-2 border-accent/30 hover:border-accent p-2 rounded transition"
                >
                  <FiMinus />
                </button>
                <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="border-2 border-accent/30 hover:border-accent p-2 rounded transition"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 px-6 rounded font-semibold flex items-center justify-center gap-2 text-lg transition ${
                product.stock === 0
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-accent text-primary hover:opacity-90'
              }`}
            >
              <FiShoppingCart /> Add to Cart
            </button>

            {/* Additional Info */}
            <div className="border-t border-accent/20 pt-8 space-y-4">
              <div>
                <h4 className="font-semibold text-accent mb-2">Shipping</h4>
                <p className="text-gray-400">
                  Free shipping on orders above ₹500. Express delivery available.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-2">Returns</h4>
                <p className="text-gray-400">
                  30-day hassle-free returns for unworn items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}