import Layout from '@/components/Layout';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Send email via backend
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-accent mb-4">Contact Us</h1>
          <p className="text-xl text-gray-400">We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-accent mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <FiPhone className="text-accent text-2xl flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-light mb-1">Phone</h3>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex gap-4">
                <FiMail className="text-accent text-2xl flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-light mb-1">Email</h3>
                  <p className="text-gray-400">hello@roarspace.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <FiMapPin className="text-accent text-2xl flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-light mb-1">Address</h3>
                  <p className="text-gray-400">123 Fashion Street<br />Mumbai, India 400001</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Section */}
            <div className="mt-12 p-6 bg-secondary rounded-lg">
              <h3 className="font-semibold text-light mb-4">Quick Chat</h3>
              <p className="text-gray-400 mb-4">Have a quick question? Chat with us on WhatsApp</p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-secondary rounded-lg p-8">
            <h2 className="text-2xl font-bold text-accent mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-light font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-primary border-2 border-accent/20 rounded-lg px-4 py-2 text-light placeholder-gray-600 focus:border-accent focus:outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-light font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-primary border-2 border-accent/20 rounded-lg px-4 py-2 text-light placeholder-gray-600 focus:border-accent focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-light font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-primary border-2 border-accent/20 rounded-lg px-4 py-2 text-light placeholder-gray-600 focus:border-accent focus:outline-none"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label className="block text-light font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-primary border-2 border-accent/20 rounded-lg px-4 py-2 text-light placeholder-gray-600 focus:border-accent focus:outline-none"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-primary py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiSend /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}