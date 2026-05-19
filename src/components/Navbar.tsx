import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/src/context/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import LoginModal from '@/src/components/LoginModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Jerseys', path: '/shop?category=jerseys' },
    { name: 'Tracksuits', path: '/shop?category=tracksuits' },
    { name: 'Collections', path: '/shop?category=collections' },
    { name: 'Winter Wear', path: '/shop?category=winter' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-10 h-20 flex items-center justify-between border-b',
        isScrolled || isMobileMenuOpen 
          ? 'bg-background/95 backdrop-blur-md border-white/10' 
          : 'bg-transparent border-transparent'
      )}
    >
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tighter serif-heading">
          <span className="text-primary italic">JV</span>
          <span className="text-white not-italic"> VALLEY</span>
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              'nav-link',
              location.pathname === link.path && 'text-primary border-b border-primary pb-1'
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 border-r border-white/20 pr-6 group cursor-pointer">
          <Search className="w-4 h-4 text-white/50 group-hover:text-primary transition-colors" />
          <span className="text-[10px] uppercase tracking-widest text-white/30 group-hover:text-primary font-bold">Search</span>
        </div>
        
        <div className="flex items-center gap-4">
          <LoginModal />
          
          <Link to="/cart" className="relative group">
            <ShoppingBag className="w-5 h-5 text-white/80 group-hover:text-primary transition-colors stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white/80"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-background border-b border-border p-6 flex flex-col gap-4 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-lg font-medium py-2 border-b border-border last:border-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
