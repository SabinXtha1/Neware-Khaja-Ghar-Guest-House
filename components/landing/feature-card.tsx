"use client";

import { motion } from "framer-motion";
import { BedDouble, CheckCircle2, UtensilsCrossed } from "lucide-react";

export function RoomCard({ room, index }: { room: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative rounded-3xl overflow-hidden border border-border/50 bg-card shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="h-64 w-full relative overflow-hidden bg-muted">
        {room.imageUrl ? (
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={room.imageUrl}
            alt={`Room ${room.roomNumber}`}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <BedDouble className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
          <span className="text-sm font-bold capitalize text-primary">
            {room.type}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-4 relative z-10">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
            Room {room.roomNumber}
          </h3>
          <p className="text-xl font-bold text-primary">
            Rs. {room.price.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground">
              /night
            </span>
          </p>
        </div>
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 3).map((a: string, i: number) => (
              <span
                key={i}
                className="text-xs bg-muted/50 border border-border/50 px-2.5 py-1 rounded-md text-muted-foreground flex items-center gap-1 group-hover:border-primary/20 transition-colors"
              >
                <CheckCircle2 className="h-3 w-3 text-primary/70" /> {a}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-xs text-muted-foreground pl-1">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function FoodCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group flex gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:bg-muted/30 shadow-sm hover:shadow-md hover:shadow-amber-500/5 transition-all cursor-pointer"
    >
      <div className="h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-muted relative">
        {item.imageUrl ? (
          <motion.img
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ duration: 0.4 }}
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {item.name}
          </h3>
          <span className="font-bold text-primary whitespace-nowrap">
            Rs. {item.price}
          </span>
        </div>
        <span className="text-sm text-muted-foreground mt-1">
          {item.category}
        </span>
      </div>
    </motion.div>
  );
}
