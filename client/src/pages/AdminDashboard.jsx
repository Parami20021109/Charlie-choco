import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [messages, setMessages] = useState([]);
  const [customBars, setCustomBars] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Flexible admin check
    if (!user || (user.role !== 'admin' && user.email !== 'admin@gmail.com')) {
        alert('Restricted Area: Executives Only');
        navigate('/');
        return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
        const resUsers = await fetch('http://localhost:5000/api/users');
        const resOrders = await fetch('http://localhost:5000/api/orders');
        const resStaff = await fetch('http://localhost:5000/api/users/delivery-staff');
        const resMessages = await fetch('http://localhost:5000/api/messages');
        const resCustom = await fetch('http://localhost:5000/api/custom-bars');
        const resIngredients = await fetch('http://localhost:5000/api/ingredients');
        
        if(resUsers.ok) setUsers(await resUsers.json());
        if(resOrders.ok) setRecentOrders(await resOrders.json()); 
        if(resStaff.ok) setDeliveryStaff(await resStaff.json());
        if(resMessages.ok) setMessages(await resMessages.json());
        if(resCustom.ok) setCustomBars(await resCustom.json());
        if(resIngredients.ok) setIngredients(await resIngredients.json());
      } catch (err) {
          console.error(err);
      }
  };

  const deleteUser = async (id) => {
      if(!confirm('Ban this user from the factory?')) return;
      await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
      fetchData();
  };

  const assignDelivery = async (orderId, staffId) => {
      if(!staffId) return;
      await fetch(`http://localhost:5000/api/orders/${orderId}/assign`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ staffId })
      });
      fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const totalRevenue = recentOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalPoints = users.reduce((sum, u) => sum + (u.points || 0), 0);
  const lowStock = ingredients.filter(i => i.quantity < (i.minLevel || 10));
  const tierCounts = {
      Platinum: users.filter(u => u.tier === 'Platinum').length,
      Gold: users.filter(u => u.tier === 'Gold').length,
      Silver: users.filter(u => u.tier === 'Silver').length,
      Free: users.filter(u => !u.tier || u.tier === 'Standard').length
  };

  return (
    <div className="min-h-screen bg-chocolate-950 text-white p-8 font-serif">
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                <div>
                     <h1 className="text-4xl font-bold text-gold-500">EXECUTIVE <span className="text-white">DASHBOARD</span></h1>
                     <p className="text-white/40 font-sans text-xs tracking-[0.4em] uppercase mt-2 font-bold">Willy Wonka's Strategic Command</p>
                </div>
                <div className="flex gap-4">
                     <button onClick={() => navigate('/')} className="px-6 py-2 border border-white/10 hover:bg-white/5 rounded-full text-xs uppercase tracking-widest font-sans transition-all">Factory Home</button>
                     <button onClick={handleLogout} className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-full text-xs uppercase tracking-widest font-sans transition-all">Sign Out</button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">💰</div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-sans">Total Revenue</p>
                    <h2 className="text-3xl font-bold text-green-400 font-mono">${totalRevenue.toLocaleString()}</h2>
                    <div className="mt-2 text-[10px] text-green-400/60 font-sans">Live earnings across all sales</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">🎫</div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-sans">Points Economy</p>
                    <h2 className="text-3xl font-bold text-gold-500 font-mono">{totalPoints.toLocaleString()}</h2>
                    <div className="mt-2 text-[10px] text-gold-400/60 font-sans">Total loyalty points in circulation</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">🧪</div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-sans">Inventions Made</p>
                    <h2 className="text-3xl font-bold text-sky-400 font-mono">{customBars.length}</h2>
                    <div className="mt-2 text-[10px] text-sky-400/60 font-sans">Custom bars designed by users</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">👷</div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-sans">Inventory Health</p>
                    <h2 className={`text-3xl font-bold font-mono ${lowStock.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {lowStock.length > 0 ? `${lowStock.length} Alerts` : 'Healthy'}
                    </h2>
                    <div className="mt-2 text-[10px] text-white/30 font-sans">Automatic supply alerts</div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-gradient-to-br from-gold-600 to-amber-700 rounded-2xl shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
                    onClick={() => navigate('/inventory')}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Inventory</h2>
                    <p className="text-black/60 font-medium mb-6 text-sm">Manage stocks & supply.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
                    onClick={() => navigate('/chef')}
                >
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-white">
                        <span className="text-8xl">🍳</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Chef's Kitchen</h2>
                    <p className="text-white/60 font-medium mb-6 text-sm">Create recipes & cook.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-8 bg-gradient-to-br from-blue-900 to-indigo-950 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
                    onClick={() => navigate('/suppliers')}
                >
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-white">
                        <span className="text-8xl">🚢</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Suppliers</h2>
                    <p className="text-white/60 font-medium mb-6 text-sm">Manage companies.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="p-8 bg-gradient-to-br from-amber-900 to-orange-950 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
                    onClick={() => navigate('/delivery')}
                >
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-white">
                        <span className="text-8xl">🚚</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Delivery</h2>
                    <p className="text-white/60 font-medium mb-6 text-sm">Track shipments.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => navigate('/reviews')}
                >
                    <h2 className="text-xl font-serif text-gold-500 mb-2">⭐ Reviews</h2>
                    <p className="text-white/60 text-xs mb-4">Read customer feedback.</p>
                    
                    <div className="space-y-2 pointer-events-none">
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                             <span className="text-white/60">Users</span>
                             <span className="font-mono font-bold text-xl">{users.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                             <span className="text-white/60">Orders</span>
                             <span className="font-mono font-bold text-xl text-green-400">{recentOrders.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                             <span className="text-white/60">Inquiries</span>
                             <span className="font-mono font-bold text-xl text-gold-400">{messages.length}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Tier Breakdown & Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tier Distribution */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/20 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-gold-500 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span>📊</span> Loyalty Tier Distribution
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(tierCounts).map(([tier, count]) => {
                            const percentage = (count / (users.length || 1)) * 100;
                            return (
                                <div key={tier} className="space-y-1">
                                    <div className="flex justify-between text-xs font-sans uppercase">
                                        <span className="text-white/60 font-bold">{tier}</span>
                                        <span className="text-white/40">{count} Users</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className={`h-full rounded-full ${
                                                tier === 'Platinum' ? 'bg-gradient-to-r from-sky-400 to-indigo-500' :
                                                tier === 'Gold' ? 'bg-gradient-to-r from-amber-400 to-yellow-600' :
                                                tier === 'Silver' ? 'bg-gradient-to-r from-neutral-400 to-neutral-600' :
                                                'bg-white/10'
                                            }`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Oompa Loompa Alerts */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-black/20 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-red-500 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span>🚨</span> Oompa Loompa Supply Alerts
                    </h3>
                    <div className="space-y-3">
                        {lowStock.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="text-4xl block mb-2">🍭</span>
                                <p className="text-white/30 italic text-sm">All sugar levels are perfect!</p>
                            </div>
                        ) : (
                            lowStock.map(ing => (
                                <div key={ing._id} className="flex justify-between items-center bg-red-500/10 border border-red-500/20 p-3 rounded-xl animate-pulse">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">⚙️</span>
                                        <div>
                                            <p className="text-xs font-bold font-sans uppercase text-red-400">{ing.name}</p>
                                            <p className="text-[10px] text-white/40">Critical: {ing.quantity}{ing.unit} remaining</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/suppliers')}
                                        className="text-[10px] font-bold bg-red-500 text-white px-3 py-1 rounded-full uppercase"
                                    >
                                        Order More
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Split View: Recent Orders & User Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* New Orders */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-black/20 border border-white/5 rounded-2xl p-6"
                >
                    <h3 className="text-gold-500 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span>📦</span> New Orders
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                         {recentOrders.length === 0 ? (
                             <p className="text-white/30 text-center py-8">No orders yet.</p>
                         ) : (
                             recentOrders.map(order => (
                                 <div key={order._id} className="bg-white/5 p-4 rounded-lg flex flex-col gap-3">
                                     <div className="flex justify-between items-start">
                                         <div>
                                             <p className="font-bold text-sm">{order.customerName}</p>
                                             <p className="text-xs text-white/50">{new Date(order.createdAt).toLocaleDateString()}</p>
                                             <div className="flex flex-wrap gap-1 mt-2">
                                                 {order.items?.map((item, idx) => (
                                                     <div key={idx} className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[10px]">
                                                         <span className="text-white/80">{item.name}</span>
                                                         <span className="text-gold-500/60">x{item.quantity}</span>
                                                         {item.isCustom && (
                                                             <span className="text-[8px] bg-sky-500/20 text-sky-400 px-1 rounded font-bold uppercase">✨ INV</span>
                                                         )}
                                                     </div>
                                                 ))}
                                             </div>
                                         </div>
                                         <div className="text-right">
                                             <p className="text-gold-400 font-mono font-bold">${order.totalAmount.toFixed(2)}</p>
                                             <div className="flex gap-2 justify-end mt-1">
                                                {order.goldenTicket && (
                                                    <span className="text-[10px] bg-gold-500 text-black px-2 py-0.5 rounded font-black animate-pulse">🎫 GOLDEN</span>
                                                )}
                                                <span className={`text-[10px] uppercase px-2 py-1 rounded ${
                                                    order.deliveryStatus === 'Delivered' ? 'bg-green-500/20 text-green-400' : 
                                                    order.deliveryStatus === 'Assigned' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-amber-500/20 text-amber-400'
                                                }`}>{order.deliveryStatus || order.status}</span>
                                             </div>
                                         </div>
                                     </div>
                                     
                                     {/* Assignment Section */}
                                     {order.deliveryStatus !== 'Delivered' && (
                                         <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2">
                                             <span className="text-xs text-white/40">Assign:</span>
                                             <select 
                                                 className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                                 onChange={(e) => assignDelivery(order._id, e.target.value)}
                                                 value={order.deliveryStaff || ""}
                                             >
                                                 <option value="">Select Staff</option>
                                                 {deliveryStaff.map(s => (
                                                     <option key={s._id} value={s._id}>{s.username}</option>
                                                 ))}
                                             </select>
                                         </div>
                                     )}
                                 </div>
                             ))
                         )}
                    </div>
                </motion.div>

                {/* User Management */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-black/20 border border-white/5 rounded-2xl p-6"
                >
                    <h3 className="text-gold-500 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span>👥</span> User Management
                    </h3>
                    <div className="overflow-y-auto max-h-[400px] pr-2 space-y-3">
                         {users.map(u => (
                             <div key={u._id} className="flex justify-between items-center bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-chocolate-800 flex items-center justify-center font-bold text-chocolate-300">
                                         {u.username.charAt(0).toUpperCase()}
                                     </div>
                                     <div>
                                         <p className="font-bold text-sm">{u.username}</p>
                                         <p className="text-xs text-white/50">{u.email}</p>
                                     </div>
                                 </div>
                                 {u.email !== 'admin@gmail.com' && (
                                     <button onClick={() => deleteUser(u._id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 p-2 rounded">
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                     </button>
                                 )}
                             </div>
                         ))}
                    </div>
                </motion.div>
            </div>

            {/* Inquiries Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/20 border border-white/5 rounded-2xl p-6"
            >
                <h3 className="text-gold-500 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span>✉️</span> Recent Inquiries
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {messages.length === 0 ? (
                         <p className="text-white/30 italic">No new messages.</p>
                     ) : (
                         messages.map(msg => (
                             <div key={msg._id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className="font-bold text-gold-500 text-sm">{msg.name}</span>
                                     <span className="text-[10px] text-white/40">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 <p className="text-xs text-white/50 mb-2">{msg.email}</p>
                                 <p className="text-sm text-white/80 line-clamp-2">"{msg.message}"</p>
                                 <div className="mt-2 text-right">
                                     <span className={`text-[10px] px-2 py-1 rounded border ${msg.status === 'New' ? 'border-green-500/30 text-green-400' : 'border-white/10 text-white/40'}`}>
                                         {msg.status}
                                     </span>
                                 </div>
                             </div>
                         ))
                     )}
                </div>
            </motion.div>


            {/* Inventions Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-black/20 border border-white/5 rounded-2xl p-6"
            >
                <h3 className="text-gold-500 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span>🎩</span> Wonka's Inventing Room Designs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {customBars.length === 0 ? (
                         <p className="text-white/30 italic">No inventions yet.</p>
                     ) : (
                         customBars.map(bar => (
                             <div key={bar._id} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-gold-500/30 transition-colors">
                                 <div className="flex justify-between items-start mb-3">
                                     <div className="w-6 h-6 rounded" style={{ backgroundColor: bar.wrapperColor }}></div>
                                     <span className="text-[10px] font-mono text-white/40">{new Date(bar.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 <h4 className="font-bold text-white mb-1 line-clamp-1">{bar.labelName}</h4>
                                 <p className="text-[10px] text-white/50 mb-3">by {bar.user?.username || 'Guest'}</p>
                                 <div className="flex flex-wrap gap-1 mb-3">
                                     <span className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded text-gold-500">{bar.base}</span>
                                     {bar.toppings.map((t, idx) => (
                                         <span key={idx} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/60">{t}</span>
                                     ))}
                                 </div>
                                 <p className="text-sm font-bold text-gold-500">${bar.price.toFixed(2)}</p>
                             </div>
                         ))
                     )}
                </div>
            </motion.div>
        </div>
    </div>
  );
}
