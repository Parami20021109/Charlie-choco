import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-chocolate-900 text-white font-sans">
      <Navbar />
      
      <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
        >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gold-500 mb-4">Our Collection</h1>
            <p className="text-chocolate-200 max-w-2xl mx-auto">Handcrafted with passion, available for the true connoisseur.</p>
        </motion.div>

        {products.length === 0 ? (
            <div className="text-center py-20 text-white/30 border border-dashed border-white/10 rounded-xl">
                <p>No products available in the factory yet.</p>
                <p className="text-sm mt-2">Check back soon!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, i) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-all group shadow-xl"
                    >
                        <div className="h-64 overflow-hidden relative">
                             {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             ) : (
                                <div className="w-full h-full bg-chocolate-800 flex items-center justify-center text-chocolate-600">No Image</div>
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <button 
                                    onClick={() => addToCart(product)}
                                    className="w-full py-3 bg-gold-500 text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-colors transform active:scale-95"
                                >
                                    Add to Cart
                                </button>
                             </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-white">{product.name}</h3>
                                <span className="text-gold-500 font-mono text-lg">${product.price}</span>
                            </div>
                            <p className="text-chocolate-200 text-sm mb-4 line-clamp-2">{product.description}</p>
                            <div className={`text-xs uppercase tracking-wider font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
