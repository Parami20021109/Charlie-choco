import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-chocolate-900 text-white font-sans">
      <Navbar />
      
      <div className="pt-32 pb-12 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gold-500 mb-8">Your Basket</h1>

        {cart.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                <p className="text-xl text-chocolate-200 mb-4">Your basket is empty.</p>
                <Link to="/products" className="text-gold-500 hover:text-white underline">Browse Chocolates</Link>
            </div>
        ) : (
            <div className="flex flex-col md:flex-row gap-12">
                {/* Cart Items */}
                <div className="flex-1 space-y-6">
                    {cart.map(item => (
                        <motion.div 
                            key={item._id} 
                            layout
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="bg-black/20 border border-white/5 p-4 rounded-xl flex items-center gap-4"
                        >
                            <div className="w-20 h-20 bg-chocolate-800 rounded-lg overflow-hidden shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-gold-500 font-mono">${item.price}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-black/40 rounded-full px-3 py-1">
                                <button onClick={()=>updateQuantity(item._id, -1)} className="text-white hover:text-gold-500">-</button>
                                <span className="font-mono w-4 text-center">{item.quantity}</span>
                                <button onClick={()=>updateQuantity(item._id, 1)} className="text-white hover:text-gold-500">+</button>
                            </div>
                            <button onClick={()=>removeFromCart(item._id)} className="text-red-500 hover:text-red-400 p-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Summary */}
                <div className="w-full md:w-80 h-fit bg-chocolate-800/20 border border-white/10 p-6 rounded-xl backdrop-blur-sm sticky top-32">
                    <h3 className="text-xl font-bold mb-6 text-gold-500">Summary</h3>
                    <div className="flex justify-between mb-2 text-chocolate-200">
                        <span>Subtotal</span>
                        <span className="font-mono text-white">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-chocolate-200">
                        <span>Shipping</span>
                        <span className="font-mono text-white">Free</span>
                    </div>
                    <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-xl mb-8">
                        <span>Total</span>
                        <span className="font-mono text-gold-500">${total.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="w-full py-4 bg-gold-500 text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all transform hover:scale-[1.02]"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
