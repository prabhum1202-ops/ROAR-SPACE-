import Link from 'next/link';
import Image from 'next/image';
import { FiHeart } from 'react-icons/fi';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer">
        <div className="relative h-80 bg-secondary rounded-lg overflow-hidden mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className="absolute top-4 right-4 bg-primary/80 hover:bg-accent hover:text-primary p-2 rounded-full transition"
          >
            <FiHeart className="text-xl" />
          </button>
          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-primary px-3 py-1 rounded text-sm font-semibold">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-xl font-bold text-accent">Out of Stock</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-light group-hover:text-accent transition mb-2">
          {product.name}
        </h3>
        <p className="text-accent font-bold text-lg">₹{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}