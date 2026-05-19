import Hero from '@/src/components/Hero';
import ProductCard from '@/src/components/ProductCard';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { ArrowRight, Trophy, Shield, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const JERSEY_CAT_IMG = '/src/assets/images/jersey_category_1779195579959.png';
const TRACKSUIT_CAT_IMG = '/src/assets/images/tracksuit_category_1779195601683.png';

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'ELITE PERFORMANCE HOME JERSEY 26',
    price: 3450,
    originalPrice: 4200,
    image: 'https://picsum.photos/seed/jersey1/600/800',
    hoverImage: 'https://picsum.photos/seed/jersey1alt/600/800',
    category: 'Football Jerseys',
    badge: 'Best Seller',
    description: 'The ultimate performance jersey for professional athletes.'
  },
  {
    id: '2',
    name: 'RETRO CLASSIC 98 EDITION',
    price: 2800,
    image: 'https://picsum.photos/seed/jersey2/600/800',
    category: 'Retro Jerseys',
    badge: 'Limited',
    description: 'A tribute to the legends of 1998. Pure nostalgia.'
  },
  {
    id: '3',
    name: 'GOLD STITCHED PRO TRACKSUIT',
    price: 5500,
    originalPrice: 6500,
    image: 'https://picsum.photos/seed/tracksuit1/600/800',
    category: 'Tracksuits',
    badge: 'New Arrival',
    description: 'Luxury comfort combined with peak street performance.'
  },
  {
    id: '4',
    name: 'CARBON BLACK AWAY KIT',
    price: 3200,
    image: 'https://picsum.photos/seed/jersey3/600/800',
    category: 'Football Jerseys',
    description: 'Sleek, dark, and unstoppable. The carbon black kit.'
  }
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />

      {/* Featured Categories */}
      <section className="py-32 px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl serif-heading mb-6 uppercase tracking-tight">
              <span className="text-primary italic">Explore</span> Categories
            </h2>
            <p className="text-white/30 uppercase tracking-[0.4em] text-[10px] font-bold">Premium selection for the elite</p>
          </div>
          <Link to="/shop">
            <Button variant="link" className="text-primary p-0 h-auto font-black uppercase tracking-[0.2em] text-[10px] group transition-all">
              View All Collections
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div 
            whileHover={{ y: -10 }}
            className="relative group h-[600px] overflow-hidden border border-white/5"
          >
            <img src={JERSEY_CAT_IMG} alt="Jerseys" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end">
              <h3 className="text-5xl serif-heading text-white mb-4 uppercase">JERSEY COLLECTION</h3>
              <p className="text-white/40 mb-8 uppercase tracking-[0.3em] text-[10px] font-bold">Official & Retro Editions</p>
              <Link to="/shop?category=jerseys">
                <Button className="w-fit rounded-none px-10 py-6 bg-primary text-black font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors">EXPLORE</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="relative group h-[600px] overflow-hidden border border-white/5"
          >
            <img src={TRACKSUIT_CAT_IMG} alt="Tracksuits" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end text-right items-end">
              <h3 className="text-5xl serif-heading text-white mb-4 uppercase">STREETWEAR</h3>
              <p className="text-white/40 mb-8 uppercase tracking-[0.3em] text-[10px] font-bold">Premium Lifestyle Wear</p>
              <Link to="/shop?category=tracksuits">
                <Button className="w-fit rounded-none px-10 py-6 bg-primary text-black font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors">EXPLORE</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products (Trending Now) */}
      <section className="py-32 bg-[#0a0a0a] px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h3 className="text-3xl font-bold tracking-tight">
              <span className="text-primary italic serif-heading text-5xl mr-4">Trending</span> NOW
            </h3>
            <div className="hidden md:flex gap-4">
               <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:border-primary hover:text-primary cursor-pointer transition-all">&larr;</div>
               <div className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary cursor-pointer">&rarr;</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {FEATURED_PRODUCTS.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-20 px-6 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col items-center text-center">
            <Trophy className="w-10 h-10 text-primary mb-6" />
            <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Premium Quality</h4>
            <p className="text-xs text-gray-500">Only the highest grade fabrics and stitching.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Shield className="w-10 h-10 text-primary mb-6" />
            <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Authentic Design</h4>
            <p className="text-xs text-gray-500">Unique pieces inspired by football culture.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Truck className="w-10 h-10 text-primary mb-6" />
            <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Fast Shipping</h4>
            <p className="text-xs text-gray-500">Quick delivery across Bangladesh.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CreditCard className="w-10 h-10 text-primary mb-6" />
            <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Secure Payments</h4>
            <p className="text-xs text-gray-500">bKash, Nagad, and Card payments supported.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
