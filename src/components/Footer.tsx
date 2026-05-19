import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-10 px-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] uppercase tracking-[0.2em] font-medium text-white/40">
        <div>&copy; 2026 JERSEY VALLEY PREMIUM LTD.</div>
        
        <div className="flex items-center space-x-8">
          <Link to="/security" className="hover:text-primary transition-colors">Payment Security</Link>
          <Link to="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Elite</Link>
        </div>

        <div className="flex items-center space-x-6">
          <span className="text-primary font-bold">bKash</span>
          <span>Nagad</span>
          <span>Rocket</span>
          <span>SSL</span>
        </div>
      </div>
    </footer>
  );
}
