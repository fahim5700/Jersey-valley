import React, { useState, useEffect } from 'react';
import { useCart } from '@/src/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { db } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'cod'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || ''
      }));
    }
  }, [user]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to place an order");
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: cartTotal + 150,
        status: 'Processing',
        shippingInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          email: formData.email
        },
        paymentMethod: formData.paymentMethod,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      // Update user stats
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        totalOrders: increment(1),
        points: increment(Math.floor(cartTotal / 100)) // 1 point per 100 BDT
      });

      toast.success("Order placed successfully!");
      clearCart();
      navigate('/dashboard');
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      <h1 className="text-5xl font-black italic tracking-tighter mb-12">CHECKOUT</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Shipping Info */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">01</span>
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">First Name</Label>
                <Input id="firstName" required className="rounded-none border-zinc-800" placeholder="John" value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Name</Label>
                <Input id="lastName" required className="rounded-none border-zinc-800" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</Label>
                <Input id="email" type="email" required className="rounded-none border-zinc-800" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Street Address</Label>
                <Input id="address" required className="rounded-none border-zinc-800" placeholder="e.g. House 12, Road 4, Sector 7" value={formData.address} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City</Label>
                <Input id="city" required className="rounded-none border-zinc-800" placeholder="Dhaka" value={formData.city} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone Number</Label>
                <Input id="phone" required className="rounded-none border-zinc-800" placeholder="017XXXXXXXX" value={formData.phone} onChange={handleInputChange} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">02</span>
              Payment Method
            </h2>
            <RadioGroup 
              defaultValue="cod" 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              onValueChange={(val) => setFormData(prev => ({ ...prev, paymentMethod: val }))}
            >
              <Label
                htmlFor="cod"
                className="flex flex-col items-center justify-between rounded-none border border-zinc-800 bg-zinc-950 p-6 hover:bg-zinc-900 cursor-pointer [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="cod" id="cod" className="sr-only" />
                <span className="text-[10px] font-bold uppercase tracking-widest mb-4">Cash on Delivery</span>
                <span className="text-xs text-gray-500">Pay when you receive</span>
              </Label>
              <Label
                htmlFor="bkash"
                className="flex flex-col items-center justify-between rounded-none border border-zinc-800 bg-zinc-950 p-6 hover:bg-zinc-900 cursor-pointer [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="bkash" id="bkash" className="sr-only" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/BKash_Logo.svg" alt="bkash" className="h-6 mb-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Mobile Banking</span>
              </Label>
              <Label
                htmlFor="nagad"
                className="flex flex-col items-center justify-between rounded-none border border-zinc-800 bg-zinc-950 p-6 hover:bg-zinc-900 cursor-pointer [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="nagad" id="nagad" className="sr-only" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Nagad_Logo.svg" alt="nagad" className="h-6 mb-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Mobile Banking</span>
              </Label>
            </RadioGroup>
          </section>

          <footer className="flex items-center gap-4 py-8 border-t border-zinc-900">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-[10px] uppercase tracking-widest text-gray-500">
              I AGREE TO THE <button type="button" className="text-primary underline">TERMS AND CONDITIONS</button>
            </Label>
          </footer>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-950 border border-zinc-900 p-8 sticky top-32">
            <h2 className="text-lg font-black uppercase tracking-widest mb-8 border-b border-zinc-900 pb-4">YOUR ORDER</h2>
            
            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">{item.quantity}x</span>
                    <span className="text-white uppercase font-bold truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="text-gray-400 font-bold italic">৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <Separator className="bg-zinc-900 mb-6" />

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                <span className="font-bold">৳{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Delivery Fee</span>
                <span className="font-bold">৳150</span>
              </div>
              <Separator className="bg-zinc-800" />
              <div className="flex justify-between">
                <span className="text-sm font-black uppercase tracking-[0.15em]">Total Amount</span>
                <span className="text-2xl font-black text-primary italic">৳{cartTotal + 150}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-[0.2em] group"
            >
              {loading ? "PROCESSING..." : "PLACE ORDER"}
            </Button>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-30 text-[8px] uppercase tracking-widest font-bold">
              <span className="flex items-center gap-1">🔒 SECURE CHECKOUT</span>
              <span>•</span>
              <span>EST. DELIVERY: 2-3 DAYS</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
