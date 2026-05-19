import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useCart, Product } from '@/src/context/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="group block relative h-full">
      <Card className="relative overflow-hidden border border-white/5 bg-[#111111] rounded-none h-full transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
        <Link to={`/product/${product.id}`} className="absolute inset-0 z-0" aria-label={product.name} />
        
        {/* Badge */}
        {product.badge && (
          <Badge className="absolute top-0 left-0 z-10 rounded-none bg-primary text-black font-bold text-[9px] uppercase tracking-widest px-3 py-1 border-none">
            {product.badge}
          </Badge>
        )}

        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900/50">
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100",
              product.hoverImage ? "group-hover:opacity-0" : ""
            )}
            referrerPolicy="no-referrer"
          />
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-105 group-hover:scale-100"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Icon Overlay (Single Heart) */}
          <button 
            className="absolute top-4 right-4 text-white/20 hover:text-primary transition-colors duration-300 z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success("Saved to collections");
            }}
          >
            <Heart className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-5 flex flex-col border-t border-white/5 h-[calc(100%-75%)] relative z-10 pointer-events-none">
          <div className="mb-auto">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">{product.category}</p>
            <h3 className="font-bold text-xs tracking-[0.05em] uppercase text-white/90 group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center pointer-events-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-primary">৳{product.price}</span>
              {product.originalPrice && (
                <span className="text-[10px] text-white/20 line-through">৳{product.originalPrice}</span>
              )}
            </div>
            
            <Button 
              className="h-8 px-4 rounded-none border border-white/10 bg-transparent text-[9px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
              onClick={handleAddToCart}
            >
              Quick Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCard;
