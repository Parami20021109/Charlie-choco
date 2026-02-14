import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="bg-chocolate-950 text-white font-sans overflow-x-hidden selection:bg-gold-500 selection:text-black">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: parallaxY }} className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=2000&auto=format&fit=crop" 
             alt="Chocolate Texture" 
             className="w-full h-full object-cover opacity-40 scale-110"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-chocolate-950/80 via-transparent to-chocolate-950" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.span 
                initial={{ opacity: 0, letterSpacing: "0em" }}
                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                transition={{ duration: 1.5 }}
                className="text-gold-500 text-xs md:text-sm font-bold uppercase block mb-6"
            >
                Est. 1924
            </motion.span>
            <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-6xl md:text-8xl font-serif text-white leading-tight mb-8"
            >
                The Legacy of <br/><span className="text-gold-500 italic">Wonka</span>
            </motion.h1>
            <motion.div 
                initial={{ h: 0 }}
                animate={{ h: 100 }}
                transition={{ delay: 1, duration: 1 }}
                className="w-[1px] bg-gold-500/50 mx-auto"
            />
        </div>
      </section>

      {/* --- CHAPTER 1: THE BEGINNING --- */}
      <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                  <FadeIn>
                      <span className="text-gold-500/60 font-mono text-sm mb-4 block">01. THE BEGINNING</span>
                      <h2 className="text-4xl md:text-5xl font-serif mb-8">A Dream Forged in Cocoa</h2>
                      <p className="text-chocolate-200 text-lg font-light leading-relaxed mb-6">
                          It started not with a factory, but with a single truffle. Willy Wonka traveled the globe, from the misty jungles of Loompaland to the spice markets of Istanbul, seeking the perfect bean.
                      </p>
                      <p className="text-chocolate-200 text-lg font-light leading-relaxed">
                          Rejected by traditional chocolatiers for his "impossible" ideas, he built his own sanctuary—a place where waterfalls mix the chocolate by air, giving it a lightness no machine could replicate.
                      </p>
                  </FadeIn>
              </div>
              <div className="relative h-[600px] rounded-t-full overflow-hidden border border-white/10">
                  <motion.div 
                    whileInView={{ scale: 1.05 }}
                    transition={{ duration: 1.5 }}
                    className="w-full h-full"
                  >
                      <img 
                        src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1000&auto=format&fit=crop" 
                        alt="Vintage Chocolate Making" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      />
                  </motion.div>
              </div>
          </div>
      </section>

      {/* --- CHAPTER 2: CRAFTSMANSHIP (Parallax Strip) --- */}
      <section className="py-20 relative overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0">
               <img 
                    src="https://images.unsplash.com/photo-1549419163-9d9fc480749e?q=80&w=2000&auto=format&fit=crop"
                    alt="Liquid Chocolate"
                    className="w-full h-full object-cover opacity-20 fixed top-0"
               />
               <div className="absolute inset-0 bg-chocolate-950/80 backdrop-blur-sm" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
              <FadeIn>
                   <h2 className="text-3xl md:text-5xl font-serif text-white mb-12">"We don't make chocolate.<br/>We craft <span className="text-gold-500 italic">moments</span>."</h2>
              </FadeIn>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      { title: "Ethical Sourcing", desc: "100% Fair Trade beans from small family farms." },
                      { title: "Slow Roasting", desc: "Roasted in small batches to unlock hidden flavors." },
                      { title: "Zero Additives", desc: "Pure cocoa butter, raw cane sugar, and nothing else." }
                  ].map((item, i) => (
                      <FadeIn delay={i * 0.2} key={i}>
                          <div className="p-8 border border-white/10 rounded-2xl bg-black/20 hover:bg-white/5 transition-colors">
                              <h3 className="text-gold-500 font-bold uppercase tracking-wider text-sm mb-4">{item.title}</h3>
                              <p className="text-white/60 font-light">{item.desc}</p>
                          </div>
                      </FadeIn>
                  ))}
              </div>
          </div>
      </section>

      {/* --- CHAPTER 3: THE FUTURE --- */}
      <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div className="order-2 md:order-1 relative h-[500px] overflow-hidden rounded-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1623946050519-5d259e21975e?q=80&w=1000&auto=format&fit=crop" 
                    alt="Modern Chocolate Art" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 to-transparent opacity-60" />
             </div>
             
             <div className="order-1 md:order-2">
                 <FadeIn>
                    <span className="text-gold-500/60 font-mono text-sm mb-4 block">02. THE FUTURE</span>
                    <h2 className="text-4xl md:text-5xl font-serif mb-8">Innovation Meets Tradition</h2>
                    <p className="text-chocolate-200 text-lg font-light leading-relaxed mb-6">
                        Today, Charlie Bucket continues the legacy. We aren't just preserving the past; we are inventing the future of flavor. 
                    </p>
                    <p className="text-chocolate-200 text-lg font-light leading-relaxed">
                        From ruby chocolate discoveries to sustainable packaging that returns to the earth, every bar you buy supports a greener, sweeter planet.
                    </p>
                 </FadeIn>
             </div>
          </div>
      </section>

      {/* --- SIGNATURE --- */}
      <section className="py-24 text-center border-t border-white/5">
          <FadeIn>
              <img src="/signatures/wonka-sig.png" alt="" className="h-20 mx-auto opacity-50 mb-6" /> 
              {/* Note: If image doesn't exist, alt text won't show broken icon with css tricks, or we just rely on text below */}
              <p className="font-serif text-2xl italic text-gold-500">Willy Wonka & Charlie Bucket</p>
          </FadeIn>
      </section>

      {/* --- FOOTER (Simplified) --- */}
      <footer className="bg-black py-12 text-center text-white/20 text-xs">
          <p>&copy; 2026 Charlie's Chocolate Factory.</p>
      </footer>
    </div>
  );
}
