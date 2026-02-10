import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
        navigate('/login');
        return;
    }
    setUser(userData);
    fetchUserOrders(userData.id);
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
        if(res.ok) {
            const data = await res.json();
            setOrders(data);
        }
    } catch(err) {
        console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if(!user) return null;

  return (
    <div className="min-h-screen bg-chocolate-900 text-white font-sans">
      <Navbar />
      
      <div className="pt-32 pb-12 px-6 max-w-4xl mx-auto">
        
        <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
            {/* User Card */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full md:w-1/3 bg-black/30 border border-white/10 p-8 rounded-2xl text-center backdrop-blur-sm"
            >
                <div className="w-24 h-24 bg-gold-500 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-black mb-4">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-2xl font-serif text-white mb-1">{user.username}</h1>
                <p className="text-chocolate-200 text-sm mb-6">{user.email}</p>
                <div className="bg-white/5 rounded-lg p-3 mb-6">
                    <p className="text-xs uppercase text-gold-500 tracking-widest">Membership Status</p>
                    <p className="font-bold">Golden Ticket Holder</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="w-full py-2 border border-red-500/50 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors text-sm uppercase font-bold"
                >
                    Logout
                </button>
            </motion.div>

            {/* Orders Section */}
            <div className="w-full md:w-2/3">
                <h2 className="text-xl font-serif text-gold-500 mb-6 flex items-center gap-2">
                    <span>📦</span> Order History
                </h2>

                {orders.length === 0 ? (
                    <div className="bg-white/5 border-dashed border border-white/10 rounded-2xl p-8 text-center text-white/50">
                        No orders found. Time to buy some chocolate!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, i) => (
                            <motion.div 
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/5 rounded-xl p-6 hover:border-gold-500/30 transition-all"
                            >
                                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                                    <div>
                                        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Order #{order._id.slice(-6)}</p>
                                        <p className="text-sm font-bold text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-mono text-gold-500 font-bold">${order.totalAmount.toFixed(2)}</p>
                                        <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded font-bold uppercase">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-chocolate-200">
                                                <span className="text-white font-bold mr-2">{item.quantity}x</span> 
                                                {item.name}
                                            </span>
                                            <span className="text-white/30">${item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
