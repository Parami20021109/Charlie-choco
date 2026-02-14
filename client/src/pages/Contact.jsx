import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
      e.preventDefault();
      // Simulate submission
      setTimeout(() => setIsSubmitted(true), 1000);
  };

  return (
    <div className="bg-chocolate-950 text-white font-sans min-h-screen selection:bg-gold-500 selection:text-black">
      <Navbar />
      
      <div className="min-h-screen flex flex-col md:flex-row">
          {/* Left Side - Info */}
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.3em] block mb-6">Concierge Service</span>
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-8">Get in Touch</h1>
                    <p className="text-chocolate-200 text-lg font-light leading-relaxed mb-12 max-w-md">
                        Have a question about our collections? Looking for a custom creation? 
                        Our team of chocolatiers is at your service.
                    </p>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-white font-serif text-xl mb-1">Headquarters</h3>
                            <p className="text-white/60 font-light">1 Wonka Way, United Kingdom</p>
                        </div>
                        <div>
                            <h3 className="text-white font-serif text-xl mb-1">Email</h3>
                            <p className="text-gold-500 font-light">concierge@wonka.com</p>
                        </div>
                        <div>
                            <h3 className="text-white font-serif text-xl mb-1">Phone</h3>
                            <p className="text-white/60 font-light">+44 (0) 20 7946 0123</p>
                        </div>
                    </div>
                </motion.div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 bg-black/20 backdrop-blur-3xl border-l border-white/5 p-12 md:p-24 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-md"
              >
                  {isSubmitted ? (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center p-12 border border-gold-500/30 rounded-2xl bg-gold-500/10"
                      >
                          <div className="text-5xl mb-4">✨</div>
                          <h3 className="text-2xl font-serif text-gold-500 mb-2">Message Sent</h3>
                          <p className="text-white/70">An Oompa Loompa will be with you shortly.</p>
                      </motion.div>
                  ) : (
                      <form onSubmit={handleSubmit} className="space-y-8">
                          <div className="group">
                              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-gold-500 transition-colors">Name</label>
                              <input 
                                required
                                type="text" 
                                className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors text-lg"
                                placeholder="Charlie Bucket"
                                value={formState.name}
                                onChange={e => setFormState({...formState, name: e.target.value})}
                              />
                          </div>
                          
                          <div className="group">
                              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-gold-500 transition-colors">Email</label>
                              <input 
                                required
                                type="email" 
                                className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors text-lg"
                                placeholder="charlie@goldenticket.com"
                                value={formState.email}
                                onChange={e => setFormState({...formState, email: e.target.value})}
                              />
                          </div>

                          <div className="group">
                              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-gold-500 transition-colors">Message</label>
                              <textarea 
                                required
                                rows="4"
                                className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors text-lg resize-none"
                                placeholder="I would like to inquire about..."
                                value={formState.message}
                                onChange={e => setFormState({...formState, message: e.target.value})}
                              />
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-5 bg-gold-600 hover:bg-gold-500 text-black font-bold uppercase tracking-widest text-sm rounded-full transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(218,165,32,0.2)]"
                          >
                              Send Message
                          </button>
                      </form>
                  )}
              </motion.div>
          </div>
      </div>
    </div>
  );
}
