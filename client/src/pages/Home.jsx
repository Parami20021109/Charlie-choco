import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FloatingChocolate from '../components/FloatingChocolate';

function Home() {
  return (
    <div className="min-h-screen bg-chocolate-900 text-white selection:bg-gold-500 selection:text-black">
      {/* Navigation */}
      <nav className="fixed w-full z-50 p-6 flex justify-between items-center backdrop-blur-sm bg-black/10">
        <h1 className="text-2xl font-bold text-gold-500 font-serif tracking-wider">CHARLIE'S</h1>
        <div className="space-x-8 text-sm font-medium tracking-widest hidden md:block">
          <a href="#" className="hover:text-gold-500 transition-colors">COLLECTION</a>
          <a href="#" className="hover:text-gold-500 transition-colors">STORY</a>
          <a href="#" className="hover:text-gold-500 transition-colors">VISIT</a>
        </div>
        <div className="flex gap-4">
            <Link to="/login">
                <button className="px-6 py-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-all duration-300 rounded-full text-sm uppercase tracking-wider">
                    Login
                </button>
            </Link>
             <Link to="/register">
                <button className="px-6 py-2 bg-gold-500 text-black hover:bg-white hover:text-chocolate-900 transition-all duration-300 rounded-full text-sm uppercase tracking-wider">
                    Sign Up
                </button>
            </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={1} />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <FloatingChocolate position={[-2, 0, 0]} />
            <FloatingChocolate position={[2, 1, -2]} scale={0.8} />
            <FloatingChocolate position={[0, -2, 1]} scale={1.2} />
            
             <Environment preset="city" />
             <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold-500 uppercase tracking-[0.3em] text-sm">Est. 2026</span>
            <h2 className="text-6xl md:text-8xl font-black mt-4 mb-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-chocolate-200">
              PURE IMAGINATION
            </h2>
            <p className="text-lg text-chocolate-100 max-w-2xl mx-auto font-light leading-relaxed">
              Step into a world where chocolate rivers flow and dreams taste like sugar. 
              Experience the magic of Charlie's handcrafted delights.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="pt-8"
          >
            <button className="px-8 py-4 bg-gold-500 text-black font-bold tracking-widest uppercase rounded-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(218,165,32,0.5)]">
               Explore the Factory
            </button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-black text-center relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[ 
                { title: 'Velvet Texture', desc: 'Melts in your mouth instantly.' }, 
                { title: 'Ethically Sourced', desc: 'Direct trade cocoa beans.' }, 
                { title: 'Secret Recipe', desc: 'Passed down through generations.' }
            ].map((item, i) => (
                <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    viewport={{ once: true }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="p-8 border border-chocolate-800 bg-chocolate-900/20 backdrop-blur rounded-xl hover:border-gold-500/50 transition-colors cursor-pointer group"
                >
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gold-500 to-amber-700 rounded-full mb-6 group-hover:scale-110 transition-transform"/>
                    <h3 className="text-xl font-bold mb-3 text-chocolate-100">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Featured Image Section (Placeholder for now, but styling is there) */}
      <section className="py-24 bg-gradient-to-b from-black to-chocolate-900">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gold-500 mb-6 font-serif">The Golden Experience</h2>
                    <p className="text-chocolate-200 leading-loose mb-8">
                        Every bar contains a story. Crafted with precision, patience, and a touch of magic. 
                        Our master chocolatiers work tirelessly to bring you the finest confectionery art.
                    </p>
                    <button className="text-gold-500 border-b border-gold-500 pb-1 hover:text-white hover:border-white transition-colors">
                        Learn More &rarr;
                    </button>
                </motion.div>
            </div>
            <div className="flex-1 h-[400px] w-full bg-chocolate-800 rounded-2xl overflow-hidden relative shadow-2xl">
                 {/* This would be an image tag normally */}
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
         </div>
      </section>
      
      <footer className="py-12 border-t border-chocolate-800 text-center text-chocolate-400 text-sm">
        <p>&copy; 2026 Charlie's Chocolate Factory. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
