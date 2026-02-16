import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// 3D Chocolate Particle Effect
function ChocolateParticles() {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });
  return (
    <group ref={ref}>
      <Sparkles count={150} scale={12} size={4} speed={0.2} opacity={0.8} color="#DAA520" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

function Home() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="bg-chocolate-950 text-white selection:bg-gold-500 selection:text-black font-sans overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute inset-0 z-0"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-chocolate-900/40 to-chocolate-950 z-10" />
            <img 
                src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=2070&auto=format&fit=crop" 
                alt="Chocolate Factory Background" 
                className="w-full h-full object-cover object-center scale-110"
            />
        </motion.div>

        {/* 3D Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <Suspense fallback={null}>
                    <ChocolateParticles />
                </Suspense>
            </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                <h2 className="text-gold-400 tracking-[0.8em] text-xs md:text-sm font-bold uppercase mb-6 drop-shadow-lg">
                    Est. 1924 • Handcrafted Quality
                </h2>
                <h1 className="text-7xl md:text-9xl font-serif text-white mb-8 drop-shadow-2xl leading-tight">
                    Pure <span className="italic text-gold-500">Magic</span>
                </h1>
                <p className="text-chocolate-100/90 max-w-xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-10 drop-shadow-md">
                    Immerse yourself in a world of artisanal confectionery, 
                    where every bite is a journey to pure imagination.
                </p>
                
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <Link to="/products">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gold-600 text-black font-bold uppercase tracking-widest text-sm rounded-full shadow-[0_0_20px_rgba(218,165,32,0.4)] hover:shadow-[0_0_30px_rgba(218,165,32,0.6)] transition-all"
                        >
                            Explore Collection
                        </motion.button>
                    </Link>
                    <Link to="/about">
                        <button className="px-8 py-4 border border-white/30 hover:border-white text-white font-bold uppercase tracking-widest text-sm rounded-full backdrop-blur-sm transition-all">
                            Our Story
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 z-30"
        >
            <span className="text-[10px] uppercase tracking-widest mb-2 block text-center">Scroll</span>
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </motion.div>
      </section>

      {/* --- FEATURED SHOWCASE --- */}
      <section className="py-32 bg-chocolate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-white/10 pb-8">
                <div>
                    <span className="text-gold-500 uppercase tracking-widest text-xs font-bold block mb-2">The Collection</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white">Signature Creations</h2>
                </div>
                <Link to="/products" className="text-white/60 hover:text-white mt-4 md:mt-0 flex items-center gap-2 group transition-colors">
                    View All Products 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { 
                        title: 'Dark & Mysterious', 
                        desc: '85% Cacao with hints of espresso.', 
                        price: '$14.00', 
                        img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000&auto=format&fit=crop' 
                    },
                    { 
                        title: 'Golden Hazelnut', 
                        desc: 'Roasted nuts in creamy milk chocolate.', 
                        price: '$16.50',
                        img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1000&auto=format&fit=crop'
                    },
                    { 
                        title: 'Ruby Berry', 
                        desc: 'Rare ruby cocoa with dried raspberry.', 
                        price: '$18.00',
                        img: 'https://images.unsplash.com/photo-1616031036573-2e06c7ed1651?q=80&w=1000&auto=format&fit=crop'
                    },
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        viewport={{ once: true }}
                        className="group cursor-pointer relative"
                    >
                        <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-6 relative shadow-2xl">
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 z-10" />
                            <img 
                                src={item.img} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 translate-y-4 group-hover:translate-y-0">
                                <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-gold-500 transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        <h3 className="text-2xl font-serif text-white group-hover:text-gold-500 transition-colors">{item.title}</h3>
                        <p className="text-chocolate-200 text-sm mt-1">{item.desc}</p>
                        <p className="text-gold-500 font-mono mt-3 text-lg">{item.price}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* --- INVENTING ROOM CTA --- */}
      <section className="py-24 bg-gradient-to-r from-chocolate-900 to-black relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/honeycomb.png')]"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                  <span className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-4 block">Exclusive Feature</span>
                  <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">The Inventing Room</h2>
                  <p className="text-chocolate-100 text-lg mb-8 max-w-xl">
                      Have you ever dreamed of creating your own chocolate bar? Choose your base, 
                      sprinkle in the magic, and design the wrapper of your dreams. 
                      Your creation, delivered from our factory to your door.
                  </p>
                  <Link to="/inventing-room">
                      <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-10 py-5 bg-gold-500 text-black font-bold uppercase tracking-[0.2em] rounded shadow-2xl shadow-gold-500/20 hover:bg-white transition-all"
                      >
                          Start Inventing 🎩
                      </motion.button>
                  </Link>
              </div>
              <div className="flex-1 relative">
                  <motion.div 
                      animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                      className="relative z-20"
                  >
                      <img 
                          src="https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?q=80&w=1000&auto=format&fit=crop" 
                          alt="Custom Chocolate" 
                          className="rounded-3xl shadow-2xl border border-white/10"
                      />
                  </motion.div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-500/20 blur-3xl rounded-full animate-pulse"></div>
              </div>
          </div>
      </section>

      {/* --- IMMERSIVE BANNER --- */}
      <section className="h-[80vh] relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0">
             <img 
                src="https://images.unsplash.com/photo-1614088685112-0a760b7163c8?q=80&w=2070&auto=format&fit=crop" 
                alt="Liquid Chocolate" 
                className="w-full h-full object-cover opacity-60"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-transparent to-chocolate-950" />
         </div>
         
         <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
             <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-serif text-white mb-8"
            >
                 "The secret ingredient is always <span className="text-gold-500 italic">love</span>."
             </motion.h2>
             <p className="text-white/60 text-lg md:text-xl font-light italic">
                 — Willy Wonka
             </p>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black py-20 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 text-center">
             <div className="mb-12">
                 <h2 className="text-4xl font-serif text-gold-500 tracking-widest">WONKA</h2>
                 <p className="text-white/40 text-xs uppercase tracking-[0.5em] mt-2">Fine Chocolates</p>
             </div>
             
             <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm text-white/60 font-light tracking-wide mb-12">
                <Link to="/products" className="hover:text-gold-500 transition-colors">Store</Link>
                <Link to="/about" className="hover:text-gold-500 transition-colors">Our Story</Link>
                <Link to="/locations" className="hover:text-gold-500 transition-colors">Locations</Link>
                <Link to="/contact" className="hover:text-gold-500 transition-colors">Concierge</Link>
             </div>
             
             <div className="text-white/20 text-xs flex flex-col gap-2">
                 <p>&copy; 2026 Charlie's Chocolate Factory. All rights reserved.</p>
                 <p>Made with magic in the Cloud.</p>
             </div>
         </div>
      </footer>
    </div>
  );
}

export default Home;
