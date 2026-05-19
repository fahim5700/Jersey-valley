import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '@/src/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/src/context/CartContext';
import { cn } from '@/lib/utils';

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ELITE PERFORMANCE HOME JERSEY 26',
    price: 3450,
    originalPrice: 4200,
    image: 'https://picsum.photos/seed/jersey1/600/800',
    hoverImage: 'https://picsum.photos/seed/jersey1alt/600/800',
    category: 'jerseys',
    badge: 'Best Seller',
    description: 'The ultimate performance jersey for professional athletes.'
  },
  {
    id: '2',
    name: 'RETRO CLASSIC 98 EDITION',
    price: 2800,
    image: 'https://picsum.photos/seed/jersey2/600/800',
    category: 'retro',
    badge: 'Limited',
    description: 'A tribute to the legends of 1998. Pure nostalgia.'
  },
  {
    id: '3',
    name: 'GOLD STITCHED PRO TRACKSUIT',
    price: 5500,
    originalPrice: 6500,
    image: 'https://picsum.photos/seed/tracksuit1/600/800',
    category: 'tracksuits',
    badge: 'New Arrival',
    description: 'Luxury comfort combined with peak street performance.'
  },
  {
    id: '4',
    name: 'CARBON BLACK AWAY KIT',
    price: 3200,
    image: 'https://picsum.photos/seed/jersey3/600/800',
    category: 'jerseys',
    description: 'Sleek, dark, and unstoppable. The carbon black kit.'
  },
  {
    id: '5',
    name: 'PREMIUM COTTON CLUB T-SHIRT',
    price: 1850,
    image: 'https://picsum.photos/seed/tshirt1/600/800',
    category: 'collections',
    description: 'High-quality cotton tee with minimalist club branding.'
  },
  {
    id: '6',
    name: 'WINTER DRILL TOP JACKET',
    price: 4500,
    image: 'https://picsum.photos/seed/winter1/600/800',
    category: 'winter',
    badge: 'Season Pick',
    description: 'Stay warm and agile during winter training sessions.'
  }
];

export default function Shop() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'all';

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = ALL_PRODUCTS.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 px-10 max-w-7xl mx-auto w-full">
      <div className="mb-20 text-center">
        <h1 className="text-6xl md:text-8xl serif-heading mb-4 uppercase tracking-tighter italic">
          <span className="text-primary mr-4">Elite</span> Collection
        </h1>
        <p className="text-white/30 uppercase tracking-[0.5em] text-[10px] font-bold">Precision • Performance • Prestige</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-8 mb-16 items-center justify-between border-y border-white/5 py-10">
        <div className="flex flex-wrap gap-4 justify-center">
          {['all', 'jerseys', 'tracksuits', 'collections', 'winter', 'retro'].map((cat) => (
            <button
              key={cat}
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-bold py-2 px-4 transition-all border-b-2",
                category === cat ? "text-primary border-primary" : "text-white/30 border-transparent hover:text-white"
              )}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-grow lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input 
              placeholder="SEARCH THE VALLEY..." 
              className="pl-10 rounded-none border-white/10 bg-zinc-950 text-[10px] uppercase font-bold tracking-widest h-12 focus:border-primary transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-none border-white/10 bg-zinc-950 text-[10px] uppercase font-bold tracking-widest">
              <SelectValue placeholder="SORT BY" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-none">
              <SelectItem value="featured" className="text-[10px] uppercase font-bold tracking-widest">FEATURED</SelectItem>
              <SelectItem value="newest" className="text-[10px] uppercase font-bold tracking-widest">NEWEST</SelectItem>
              <SelectItem value="price-low" className="text-[10px] uppercase font-bold tracking-widest">PRICE: LOW TO HIGH</SelectItem>
              <SelectItem value="price-high" className="text-[10px] uppercase font-bold tracking-widest">PRICE: HIGH TO LOW</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-gray-500 uppercase tracking-widest text-sm">No products found matching your criteria.</p>
          <Button variant="link" onClick={() => {setCategory('all'); setSearchTerm('');}} className="mt-4">Reset Filters</Button>
        </div>
      )}
    </div>
  );
}
