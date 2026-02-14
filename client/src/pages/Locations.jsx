import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';

const LocationCard = ({ city, address, image, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay }}
            className="group relative h-[500px] overflow-hidden rounded-2xl cursor-pointer"
        >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-700 z-10" />
            
            <img 
                src={image} 
                alt={city} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-3xl font-serif text-white mb-2">{city}</h3>
                <p className="text-white/60 font-light mb-4">{address}</p>
                
                <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500">
                    <p className="text-gold-500 text-xs uppercase tracking-widest mb-2">Hours</p>
                    <p className="text-white/80 text-sm">Mon-Sun: 10am - 9pm</p>
                    <button className="mt-4 px-6 py-2 border border-white/30 text-white text-xs uppercase tracking-widest hover:bg-gold-500 hover:border-gold-500 hover:text-black transition-all rounded-full">
                        Get Directions
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default function Locations() {
  return (
    <div className="bg-chocolate-950 text-white font-sans min-h-screen selection:bg-gold-500 selection:text-black">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
              <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.3em] block mb-4">World of Wonka</span>
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Our Boutiques</h1>
              <p className="text-chocolate-200 max-w-2xl mx-auto font-light text-lg">
                  Step into our sanctuaries of sweetness. Each location is designed to transport you to a world of pure imagination.
              </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <LocationCard 
                  city="Paris" 
                  address="14 Rue de la Paix, 75002" 
                  image="https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?q=80&w=1000&auto=format&fit=crop"
                  delay={0}
              />
              <LocationCard 
                  city="Tokyo" 
                  address="Ginza 6-Chome, Chuo City" 
                  image="https://images.unsplash.com/photo-1550966871-3ed3c47e7c90?q=80&w=1000&auto=format&fit=crop"
                  delay={0.2}
              />
              <LocationCard 
                  city="New York" 
                  address="5th Avenue, Manhattan" 
                  image="https://images.unsplash.com/photo-1496417263034-38ec4f0d665a?q=80&w=1000&auto=format&fit=crop"
                  delay={0.4}
              />
              <LocationCard 
                  city="London" 
                  address="Covent Garden, WC2E 8BE" 
                  image="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop"
                  delay={0.1}
              />
              <LocationCard 
                  city="Dubai" 
                  address="Dubai Mall, Fashion Avenue" 
                  image="https://images.unsplash.com/photo-1512453979798-5ea904ac6686?q=80&w=1000&auto=format&fit=crop"
                  delay={0.3}
              />
               <LocationCard 
                  city="Zurich" 
                  address="Bahnhofstrasse 21" 
                  image="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=1000&auto=format&fit=crop"
                  delay={0.5}
              />
          </div>
      </div>
    </div>
  );
}
