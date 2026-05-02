"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }),
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
      <div className="absolute inset-0 -z-10">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?auto=format&fit=crop&q=80" 
          alt="Luxury Hotel" 
          className="w-full h-full object-cover dark:opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
      </div>
      
      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        <motion.div 
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm shadow-[0_0_15px_rgba(var(--primary),0.15)]"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
          >
            <Star className="h-4 w-4 fill-primary" /> 
          </motion.div>
          Premium Guest House & Restaurant
        </motion.div>
        
        <motion.h1 
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
        >
          Experience the True Taste of <br/>
          <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
            Authentic Hospitality
          </span>
        </motion.h1>
        
        <motion.p 
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Discover a perfect blend of comfort and culinary excellence. Book our luxurious rooms and indulge in our exquisite restaurant menu.
        </motion.p>
        
        <motion.div 
          custom={4}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Link href="/register">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="group relative overflow-hidden gradient-primary text-white border-0 h-14 px-8 text-lg rounded-xl shadow-xl shadow-primary/20 transition-all duration-300">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                <span className="relative flex items-center">
                  Explore Rooms <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </Link>
          <Link href="/menu">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-2 hover:bg-muted/50 transition-all duration-300">
                View Restaurant Menu
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
