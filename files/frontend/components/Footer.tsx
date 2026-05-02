import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <footer className="bg-secondary border-t border-accent/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-accent mb-4">ROAR SPACE</h3>
            <p className="text-gray-400">
              Premium streetwear for the modern man.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-accent font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/shop" className="hover:text-accent">Shop</Link></li>
              <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-accent">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-accent font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <FiPhone /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <FiMail /> hello@roarspace.com
              </li>
              <li className="flex items-center gap-2">
                <FiMapPin /> Mumbai, India
              </li>
            </ul>
          </div>

          {/* WhatsApp */}
          <div>
            <h4 className="text-accent font-semibold mb-4">Support</h4>
            <a
              href={`https://wa.me/${whatsappNumber?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent text-primary px-4 py-2 rounded font-semibold hover:opacity-90 transition"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="border-t border-accent/20 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Roar Space Mens Collection. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}