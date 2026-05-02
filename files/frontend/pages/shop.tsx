import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['T-Shirts', 'Hoodies', 'Jackets', 'Pants'];

export default function Shop() {
  const router = useRouter();
  const { category, minPrice = 0, maxPrice = 100000 } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: (category as string) || '',
    minPrice: parseInt(minPrice as string) || 0,
    maxPrice: parseInt(maxPrice as string) || 100000,
    sizes: [] as string[],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const constraints: QueryConstraint[] = [];

        if (filters.category) {
          constraints.push(where('category', '==', filters.category));
        }
        constraints.push(where('price', '>=', filters.minPrice));
        constraints.push(where('price', '<=', filters.maxPrice));

        const q = query(collection(db, 'products'), ...constraints);
        const querySnapshot = await getDocs(q);
        const fetchedProducts: Product[] = [];

        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleCategoryChange = (cat: string) => {
    setFilters({ ...filters, category: filters.category === cat ? '' : cat });
  };

  const handleSizeChange = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: parseInt(value),
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-accent mb-8">Shop Our Collection</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="bg-secondary rounded-lg p-6 h-fit">
            <h3 className="text-xl font-bold text-accent mb-6">Filters</h3>

            {/* Category Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-light mb-4">Category</h4>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category === cat}
                      onChange={() => handleCategoryChange(cat)}
                      className="w-4 h-4"
                    />
                    <span className="text-light hover:text-accent transition">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-light mb-4">Price Range</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Min: ₹{filters.minPrice}</label>
                  <input
                    type="range"
                    name="minPrice"
                    min="0"
                    max="100000"
                    step="1000"
                    value={filters.minPrice}
                    onChange={handlePriceChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Max: ₹{filters.maxPrice}</label>
                  <input
                    type="range"
                    name="maxPrice"
                    min="0"
                    max="100000"
                    step="1000"
                    value={filters.maxPrice}
                    onChange={handlePriceChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h4 className="font-semibold text-light mb-4">Size</h4>
              <div className="space-y-2">
                {SIZES.map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="w-4 h-4"
                    />
                    <span className="text-light hover:text-accent transition">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-secondary rounded animate-pulse h-80"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">No products found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}