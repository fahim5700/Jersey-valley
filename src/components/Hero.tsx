import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// We'll use the generated image here
const HERO_IMAGE = '/src/assets/images/hero_banner_1779195562062.png';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Premium Jersey"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs mb-4 block">
            Premium Sportswear 2026
          </span>
          <h1 className="text-6xl md:text-[120px] leading-none mb-8 serif-heading uppercase">
            WEAR THE <br />
            <span className="text-primary">GAME.</span>
          </h1>
          <p className="text-sm md:text-base text-white/50 mb-10 max-w-md leading-relaxed uppercase tracking-wider">
            Elevate your street style with our elite football-inspired luxury collection. Crafted for the modern athlete, styled for the city.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link to="/shop">
              <Button size="lg" className="rounded-none px-10 py-6 h-auto text-[10px] font-black tracking-[0.2em] group bg-primary text-black hover:bg-white transition-colors">
                SHOP NOW
              </Button>
            </Link>
            <Link to="/shop?category=collections">
              <Button
                variant="outline"
                size="lg"
                className="rounded-none px-10 py-6 h-auto text-[10px] font-black tracking-[0.2em] border-white/20 text-white hover:border-primary transition-colors"
              >
                EXPLORE RETRO
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
