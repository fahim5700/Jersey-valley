import { Link } from 'react-router-dom';
import { useCart } from '@/src/context/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-24 px-6 text-center">
        <ShoppingCart className="w-20 h-20 text-zinc-800 mx-auto mb-8" />
        <h1 className="text-4xl font-black italic tracking-tighter mb-4">YOUR CART IS EMPTY</h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs mb-8">LOOKS LIKE YOU HAVEN'T ADDED ANY GEAR YET.</p>
        <Link to="/shop">
          <Button className="rounded-none px-12 h-14 uppercase tracking-[0.2em] font-bold">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      <h1 className="text-5xl font-black italic tracking-tighter mb-12">SHOPPING BAG</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-6 pb-8 border-b border-zinc-900 group"
              >
                <div className="w-32 h-40 bg-zinc-900 overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">{item.category}</p>
                      <h3 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors uppercase">{item.name}</h3>
                    </div>
                    <span className="font-black text-primary">৳{item.price * item.quantity}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 italic">Size: M</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-zinc-800 w-fit">
                      <button 
                        className="p-2 hover:bg-zinc-800 transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 font-bold text-xs">{item.quantity}</span>
                      <button 
                        className="p-2 hover:bg-zinc-800 transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-red-500 flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-950 border border-zinc-900 p-8 sticky top-32">
            <h2 className="text-lg font-black uppercase tracking-widest mb-8 border-b border-zinc-900 pb-4">ORDER SUMMARY</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                <span className="font-bold">৳{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Shipping</span>
                <span className="text-primary font-bold uppercase tracking-widest text-[10px]">TBD</span>
              </div>
              <Separator className="bg-zinc-900" />
              <div className="flex justify-between">
                <span className="text-sm font-black uppercase tracking-[0.2em]">Total</span>
                <span className="text-xl font-black text-primary">৳{cartTotal}</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Promo Code</p>
              <div className="flex gap-2">
                <Input placeholder="ENTER CODE" className="rounded-none border-zinc-800 placeholder:text-zinc-700" />
                <Button variant="outline" className="rounded-none border-zinc-800 uppercase text-[10px] tracking-widest">Apply</Button>
              </div>
            </div>

            <Link to="/checkout" className="block w-full">
              <Button className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-[0.2em] group">
                Proceed to Checkout
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <div className="mt-8 flex flex-col gap-4 text-center">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest">SECURE CHECKOUT BACKED BY</p>
              <div className="flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/BKash_Logo.svg" alt="bkash" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Nagad_Logo.svg" alt="nagad" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingCart(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
