import Layout from '@/components/Layout';
import Image from 'next/image';

export default function About() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-accent mb-4">About Roar Space</h1>
          <p className="text-xl text-gray-400">Premium Streetwear, Authentic Culture</p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-accent mb-6">Our Story</h2>
            <p className="text-gray-300 mb-4 text-lg leading-relaxed">
              Founded in 2024, Roar Space was born from a passion for authentic streetwear. We believe that clothing is more than just fabric—it's a statement, a lifestyle, and a way to express individuality.
            </p>
            <p className="text-gray-300 mb-4 text-lg leading-relaxed">
              Our mission is to provide high-quality, premium streetwear pieces that resonate with the modern man. Every item in our collection is carefully selected to ensure it meets our standards of quality, style, and authenticity.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              We're committed to supporting local artisans and emerging designers while maintaining the highest standards of craftsmanship.
            </p>
          </div>
          <div className="bg-secondary rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-accent text-6xl font-bold mb-2">ROAR</p>
              <p className="text-gray-400">Premium Streetwear Since 2024</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-accent mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality',
                description: 'We never compromise on quality. Every piece is tested for durability and comfort.'
              },
              {
                title: 'Authenticity',
                description: 'We believe in staying true to streetwear culture and supporting authentic designers.'
              },
              {
                title: 'Community',
                description: 'We build a community of individuals who share our passion for premium streetwear.'
              }
            ].map((value, idx) => (
              <div key={idx} className="bg-secondary rounded-lg p-8 text-center hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-accent mb-4">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-accent mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'John Doe', role: 'Founder & Designer' },
              { name: 'Jane Smith', role: 'Creative Director' },
              { name: 'Mike Johnson', role: 'Operations Lead' }
            ].map((member, idx) => (
              <div key={idx} className="bg-secondary rounded-lg p-8 text-center">
                <div className="w-24 h-24 bg-accent/20 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-light mb-2">{member.name}</h3>
                <p className="text-accent">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}