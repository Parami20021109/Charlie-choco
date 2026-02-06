import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, Sparkles, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FloatingChocolate from '../components/FloatingChocolate';
import Navbar from '../components/Navbar';

// 3D Scene Component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color="#DAA520" />
      
      {/* Background Particles */}
      <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} noise={0.2} color="#D7CCC8" />
      
      {/* Floating Chocolates - Scattered for depth */}
      <FloatingChocolate position={[0, 0, 0]} scale={1.5} />
      <FloatingChocolate position={[-2, 2, -2]} rotation={[1, 0, 0]} scale={0.8} />
      <FloatingChocolate position={[2.5, -1.5, -1]} rotation={[0, 1, 0.5]} scale={1} />
      <FloatingChocolate position={[-3, -2, -3]} rotation={[0.5, 1, 0]} scale={2} />
      <FloatingChocolate position={[3, 2, -4]} rotation={[1, 2, 1]} scale={1.2} />

      <Environment preset="city" />
    </>
  );
}

function Home() {
  return (
    <div className="bg-chocolate-900 text-white selection:bg-gold-500 selection:text-black">
      <Navbar />

      {/* Hero Section with 3D Background */}
      <section className="h-screen w-full relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-chocolate-900/50 to-chocolate-900">
           {/* Canvas Container */}
           <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <Suspense fallback={null}>
                  <Scene />
              </Suspense>
           </Canvas>
        </div>

        {/* Hero Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-4">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center"
            >
                <h2 className="text-gold-500 tracking-[0.5em] text-xs md:text-sm font-bold uppercase mb-4">The Art of Confectionery</h2>
                <h1 className="text-6xl md:text-9xl font-serif text-white mb-6 drop-shadow-2xl">
                   Velvet <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-700">Cocoa</span>
                </h1>
                <p className="text-chocolate-100 max-w-lg mx-auto leading-relaxed text-sm md:text-lg mix-blend-screen">
                    Experience the symphony of rich flavors and artisanal craftsmanship. 
                    Every piece tells a story of passion and luxury.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 pointer-events-auto"
            >
                 <Link to="/products">
                    <button className="px-8 py-3 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-all duration-300 rounded-full font-bold tracking-widest text-xs uppercase backdrop-blur-sm">
                        Taste the Magic
                    </button>
                 </Link>
            </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
                {/* Image Area */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="w-full md:w-1/2 h-[500px] md:h-[600px] relative rounded-3xl overflow-hidden shadow-2xl order-1 md:order-2"
                >
                     <img 
                        src="https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1200&q=80" 
                        alt="Pouring Chocolate" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-grayscale duration-1000 ease-in-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
                </motion.div>

                {/* Content Card */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-full md:w-1/2 bg-chocolate-900/50 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-2xl shadow-xl order-2 md:order-1"
                >
                    <span className="text-gold-500 font-bold tracking-widest text-xs uppercase mb-4 block">Our Process</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-6">
                        Crafted for the <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-600">Discerning Palate</span>
                    </h2>
                    <p className="text-chocolate-100 font-light leading-relaxed mb-6 text-lg">
                        We source the finest cocoa beans from sustainable farms across the equator. 
                        Each batch is roasted to perfection, grinding slowly to preserve the delicate aromatic notes.
                    </p>
                    <p className="text-chocolate-200/80 leading-relaxed mb-8">
                         Our master chocolatiers blend tradition with innovation, creating textures that melt seamlessly and flavors that linger like a sweet memory.
                    </p>
                    
                    <div className="flex gap-8 border-t border-white/10 pt-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-500 mb-2 mx-auto">
                                <span className="font-bold">100</span>
                            </div>
                            <span className="text-xs uppercase tracking-wider text-white/50">Organic %</span>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-500 mb-2 mx-auto">
                                <span className="font-bold">24H</span>
                            </div>
                            <span className="text-xs uppercase tracking-wider text-white/50">Conching</span>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-500 mb-2 mx-auto">
                                <span className="font-bold">0</span>
                            </div>
                            <span className="text-xs uppercase tracking-wider text-white/50">Additives</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="py-24 bg-chocolate-900 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-bold">Discover</span>
            <h2 className="text-4xl font-serif text-white mt-2">Signature Collections</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
            {[
                { title: 'Dark Intense', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800', price: '$12.99' },
                { title: 'Golden Truffles', img: 'https://images.unsplash.com/photo-1526081347589-7fa3cbcd1f5c?auto=format&fit=crop&w=800', price: '$24.99' },
                { title: 'Creamy Milk', img: 'https://images.unsplash.com/photo-1605698802053-ec076606a54f?auto=format&fit=crop&w=800', price: '$14.99' },
            ].map((item, i) => (
                <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="group cursor-pointer"
                >
                    <div className="h-80 overflow-hidden rounded-2xl mb-6 relative">
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <button className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20 hover:bg-gold-500 hover:text-black">
                            View Details
                        </button>
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-serif text-white group-hover:text-gold-500 transition-colors">{item.title}</h3>
                        <p className="text-chocolate-300 mt-2">{item.price}</p>
                    </div>
                </motion.div>
            ))}
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-white/10 text-center">
         <h2 className="text-3xl font-serif text-gold-500 mb-6">CHARLIE'S</h2>
         <div className="flex justify-center gap-8 text-sm text-chocolate-300 mb-8 font-light tracking-wide">
            <a href="#" className="hover:text-white transition-colors">SHOP</a>
            <a href="#" className="hover:text-white transition-colors">OUR STORY</a>
            <a href="#" className="hover:text-white transition-colors">LOCATIONS</a>
            <a href="#" className="hover:text-white transition-colors">CONTACT</a>
         </div>
         <p className="text-white/20 text-xs">&copy; 2026 Charlie's Chocolate Factory. Created with magic.</p>
      </footer>
    </div>
  );
}

export default Home;
