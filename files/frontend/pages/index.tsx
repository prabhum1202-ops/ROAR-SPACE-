import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiArrowRight, FiTrendingUp, FiShield, FiTruck } from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(6));
        const querySnapshot = await getDocs(q);
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-secondary to-black h-96 md:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-accent mb-4 animate-fade-in">
            ROAR SPACE
          </h1>
          <p className="text-xl md:text-2xl text-light mb-8 text-gray-200">
            Premium Streetwear for the Modern Man
          </p>
          <p className="text-lg text-gray-300 mb-8">
            Elevate your style with our curated collection of premium streetwear
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 font-semibold rounded-lg hover:opacity-90 transition transform hover:scale-105"
          >
            Explore Collection <FiArrowRight className="text-xl" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FiTruck className="text-accent text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-light mb-2">Free Shipping</h3>
              <p className="text-gray-400">On orders above ₹500 across India</p>
            </div>
            <div className="text-center">
              <FiShield className="text-accent text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-light mb-2">Secure Payment</h3>
              <p className="text-gray-400">Safe & encrypted transactions</p>
            </div>
            <div className="text-center">
              <FiTrendingUp className="text-accent text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-light mb-2">Premium Quality</h3>
              <p className="text-gray-400">Handpicked streetwear collection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-accent mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-400 text-lg">Discover our latest premium pieces</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-secondary rounded-lg animate-pulse h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group cursor-pointer"
              >
                <div className="relative h-80 bg-secondary rounded-lg overflow-hidden mb-4 shadow-lg hover:shadow-2xl transition">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-300"
                  />
                  {product.stock < 5 && product.stock > 0 && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-primary px-3 py-1 rounded-full text-sm font-bold">
                      Low Stock
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-light group-hover:text-accent transition mb-2">
                  {product.name}
                </h3>
                <p className="text-accent font-bold text-lg">₹{product.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-block bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-primary py-16 border-y border-accent/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-accent mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['T-Shirts', 'Hoodies', 'Jackets'].map((category) => (
              <Link
                key={category}
                href={`/shop?category=${category.toLowerCase()}`}
                className="group relative h-64 rounded-lg overflow-hidden bg-secondary hover:shadow-2xl transition"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-accent mb-2">{category}</h3>
                    <p className="text-light">Explore Now →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-secondary py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-accent mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8">Get exclusive deals and new collection updates</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-primary border-2 border-accent/20 rounded-lg px-4 py-3 text-light placeholder-gray-600 focus:border-accent focus:outline-none"
            />
            <button className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-accent/10 to-transparent border-2 border-accent/30 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-accent mb-4">Need Assistance?</h2>
          <p className="text-light mb-8 text-lg">Our team is ready to help you find the perfect style</p>
          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')}`}
            target="_blank"
            className="inline-block bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Message on WhatsApp
          </Link>
        </div>
      </div>
    </Layout>
  );
}