import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ReviewsManager() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.role !== 'admin' && user.email !== 'admin@gmail.com')) {
      navigate('/');
      return;
    }
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    // In a real app we might want a dedicated endpoint for ALL reviews,
    // but for now we can fetch all products and aggregate their reviews
    try {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) {
            const products = await res.json();
            let allReviews = [];
            
            products.forEach(p => {
                if (p.reviews && Array.isArray(p.reviews)) {
                    p.reviews.forEach(r => {
                      allReviews.push({ 
                        ...r, 
                        productName: p.name, 
                        productId: p._id,
                        date: r.date || new Date().toISOString()
                      });
                    });
                }
            });
            
            // Sort by Date Descending
            allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            setReviews(allReviews);
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-chocolate-900 text-white font-sans flex flex-col">
        <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center sticky top-0 z-50">
             <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-gold-500 rounded flex items-center justify-center font-bold text-black text-xl cursor-pointer" onClick={() => navigate('/admin')}>←</div>
                <h1 className="text-xl font-serif text-white tracking-widest">USER<span className="text-gold-500">FEEDBACK</span></h1>
             </div>
             <button onClick={handleLogout} className="text-red-400 hover:text-white text-sm uppercase tracking-widest">Logout</button>
        </header>

        <div className="p-8 max-w-5xl mx-auto w-full">
            <h2 className="text-2xl font-bold mb-8 text-gold-500 flex items-center gap-2">
                <span>⭐</span> Recent Review Feed
            </h2>

            {reviews.length === 0 ? (
                <div className="text-center py-20 opacity-50 border border-dashed border-white/10 rounded-xl">
                    <p className="text-2xl mb-2">No feedback received yet.</p>
                    <p className="text-sm">Wait for customers to review their delivered orders.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review, i) => (
                         <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-black/20 border border-white/5 p-6 rounded-xl hover:bg-white/5 transition-colors relative group"
                         >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gold-200">{review.productName}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex text-gold-500 text-sm">
                                            {[...Array(5)].map((_, starI) => (
                                                <span key={starI} className={starI < review.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                                            ))}
                                        </div>
                                        <span className="text-xs text-white/40 font-mono border-l border-white/10 pl-3">
                                            by {review.name || 'Anonymous'}
                                        </span>
                                        <span className="text-xs text-white/20">
                                            {new Date(review.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-gold-500/10 text-gold-500 px-3 py-1 rounded-full font-bold text-sm border border-gold-500/20">
                                    {review.rating}.0
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg italic text-white/80 border-l-2 border-gold-500/30">
                                "{review.comment}"
                            </div>
                         </motion.div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
