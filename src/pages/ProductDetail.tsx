import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Shield, Truck, RotateCcw, Star, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/src/context/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import React from 'react';

const ALL_PRODUCTS = [
  {
    id: '1',
    name: 'ELITE PERFORMANCE HOME JERSEY 26',
    price: 3450,
    originalPrice: 4200,
    image: 'https://picsum.photos/seed/jersey1/600/800',
    hoverImage: 'https://picsum.photos/seed/jersey1alt/600/800',
    category: 'jerseys',
    badge: 'Best Seller',
    description: 'Developed for peak performance, the Elite 26 Home Jersey features moisture-wicking technology and a lightweight, breathable fabric inspired by professional football clubs. Metallic gold accents meet matte black for a truly luxury feel.'
  },
  {
    id: '2',
    name: 'RETRO CLASSIC 98 EDITION',
    price: 2800,
    image: 'https://picsum.photos/seed/jersey2/600/800',
    category: 'retro',
    badge: 'Limited',
    description: 'Relive the magic of the 98 season with this faithful recreation. Made from premium vintage-style polyester with high-quality embroidery.'
  },
  {
    id: '3',
    name: 'GOLD STITCHED PRO TRACKSUIT',
    price: 5500,
    originalPrice: 6500,
    image: 'https://picsum.photos/seed/tracksuit1/600/800',
    category: 'tracksuits',
    badge: 'New Arrival',
    description: 'The Gold Stitched Pro Tracksuit is the pinnacle of luxury streetwear. Featuring a sleek tapered fit, metallic gold stripes, and heavy-duty zippers.'
  }
];

export default function ProductDetail() {
  const { id } = useParams();
  const product = ALL_PRODUCTS.find((p) => p.id === id) || ALL_PRODUCTS[0];
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ ...product });
    toast.success(`${product.name} added to cart`);
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[3/4] bg-zinc-900 overflow-hidden"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-zinc-900 overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                <img 
                  src={`https://picsum.photos/seed/thumb${i}${product.id}/200/200`} 
                  alt="thumbnail" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Badge className="rounded-none bg-primary text-primary-foreground font-bold px-3 py-1 uppercase tracking-widest text-[10px]">
                {product.category}
              </Badge>
              {product.badge && (
                <Badge variant="outline" className="rounded-none border-primary text-primary uppercase text-[10px] tracking-widest">
                  {product.badge}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-primary">৳{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through opacity-70 italic">৳{product.originalPrice}</span>
              )}
            </div>
            <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>
          </div>

          <Separator className="bg-zinc-800 mb-8" />

          {/* Configuration */}
          <div className="space-y-8 mb-10">
            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest">Select Size</span>
                <button className="text-[10px] text-primary underline underline-offset-4 font-bold uppercase tracking-widest hover:opacity-80">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-12 h-12 flex items-center justify-center border text-xs font-bold transition-all duration-300",
                      selectedSize === size 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-zinc-800 text-gray-400 hover:border-white hover:text-white"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest block mb-4">Quantity</span>
              <div className="flex items-center border border-zinc-800 w-fit">
                <button 
                  className="p-3 hover:bg-zinc-800 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 font-bold text-sm">{quantity}</span>
                <button 
                  className="p-3 hover:bg-zinc-800 transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              className="flex-grow rounded-none h-14 text-sm font-bold uppercase tracking-[0.2em]"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              className="px-8 rounded-none h-14 border-zinc-800 hover:bg-zinc-900"
              onClick={() => toast.success("Added to wishlist")}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Authentic Jersey</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mb-24">
        <TabsList className="bg-transparent border-b border-zinc-800 w-full justify-start rounded-none h-auto p-0 mb-8 overflow-x-auto overflow-y-hidden">
          <TabsTrigger value="description" className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 data-[state=active]:text-white border-none shadow-none">Description</TabsTrigger>
          <TabsTrigger value="sizing" className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 data-[state=active]:text-white border-none shadow-none">Size Guide</TabsTrigger>
          <TabsTrigger value="shipping" className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 data-[state=active]:text-white border-none shadow-none">Shipping & Returns</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 data-[state=active]:text-white border-none shadow-none">Reviews (12)</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="text-gray-400 text-sm leading-relaxed max-w-4xl pt-4">
          <p className="mb-6">The Elite Performance Home Jersey 26 represents a milestone in technical sportswear design. Built specifically for high-intensity matches and elite-level comfort, this jersey utilizes advanced moisture-wicking technology to keep players dry and cool even in the heat of competition.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Lightweight, breathable polyester fabric</li>
            <li>Precision metallic gold embroidery</li>
            <li>Tapered athletic fit for maximum agility</li>
            <li>Official Jersey Valley authentication label</li>
            <li>Reinforced double-stitching in high-wear areas</li>
          </ul>
        </TabsContent>
        <TabsContent value="sizing" className="text-zinc-400 pt-4">
          <div className="border border-zinc-800 p-8 max-w-2xl">
            <h4 className="text-white font-bold uppercase tracking-widest mb-4">Standard Fitting Guide</h4>
            <table className="w-full text-xs">
              <thead className="text-primary border-b border-zinc-800">
                <tr>
                  <th className="py-4 text-left">SIZE</th>
                  <th className="py-4 text-left">CHEST (IN)</th>
                  <th className="py-4 text-left">WAIST (IN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                <tr><td className="py-4">S</td><td className="py-4">34-36</td><td className="py-4">28-30</td></tr>
                <tr><td className="py-4">M</td><td className="py-4">38-40</td><td className="py-4">32-34</td></tr>
                <tr><td className="py-4">L</td><td className="py-4">42-44</td><td className="py-4">36-38</td></tr>
                <tr><td className="py-4">XL</td><td className="py-4">46-48</td><td className="py-4">40-42</td></tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="pt-4">
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="border-b border-zinc-900 pb-8 last:border-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex text-primary">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">John Doe • 2 days ago</span>
                </div>
                <h5 className="text-white font-bold text-sm mb-2 uppercase tracking-wide italic">INCREDIBLE QUALITY</h5>
                <p className="text-gray-400 text-xs leading-relaxed">Most premium jersey I have ever owned. The gold stitching looks insane in person. Delivery take only 2 days in Dhaka.</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
