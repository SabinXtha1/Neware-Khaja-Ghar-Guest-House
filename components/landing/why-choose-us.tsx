"use client";

import { motion } from "framer-motion";
import { Hotel, MapPin, UtensilsCrossed } from "lucide-react";

export function WhyChooseUs() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Stay With Us?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We provide everything you need for an unforgettable stay in the heart of the city.</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
        >
          <motion.div variants={itemVariants} whileHover={{ y: -12 }} className="group space-y-3 p-8 rounded-3xl bg-primary/5 border border-primary/10 transition-all duration-500 cursor-default relative overflow-hidden">
            <motion.div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" whileHover={{ rotate: 45, scale: 1.5 }}>
              <MapPin className="h-40 w-40" />
            </motion.div>
            <div className="h-14 w-14 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold relative z-10">Prime Location</h3>
            <p className="text-muted-foreground leading-relaxed relative z-10">Easily accessible from all major landmarks and transit points.</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -12 }} className="group space-y-3 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 transition-all duration-500 cursor-default relative overflow-hidden">
             <motion.div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" whileHover={{ rotate: -45, scale: 1.5 }}>
              <UtensilsCrossed className="h-40 w-40 text-amber-500" />
            </motion.div>
            <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative z-10">
              <UtensilsCrossed className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold relative z-10">In-house Restaurant</h3>
            <p className="text-muted-foreground leading-relaxed relative z-10">Authentic flavors and 24/7 room service delivered to your door.</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -12 }} className="group space-y-3 p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 transition-all duration-500 cursor-default relative overflow-hidden">
             <motion.div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" whileHover={{ rotate: 45, scale: 1.5 }}>
              <Hotel className="h-40 w-40 text-emerald-500" />
            </motion.div>
            <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
              <Hotel className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold relative z-10">Premium Comfort</h3>
            <p className="text-muted-foreground leading-relaxed relative z-10">Spacious rooms equipped with modern amenities and fast WiFi.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
