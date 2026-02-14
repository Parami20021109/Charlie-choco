import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);

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
        
        if(resUsers.ok) setUsers(await resUsers.json());
        if(resOrders.ok) setRecentOrders(await resOrders.json()); // Get all orders
        if(resStaff.ok) setDeliveryStaff(await resStaff.json());
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

  return (
    <div className="min-h-screen bg-chocolate-900 text-white font-sans flex flex-col">
        {/* Top Bar */}
        <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center sticky top-0 z-50">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold-500 rounded flex items-center justify-center font-bold text-black text-xl">W</div>
                <h1 className="text-xl font-serif text-white tracking-widest">WONKA<span className="text-gold-500">ADMIN</span></h1>
             </div>
             <button onClick={handleLogout} className="text-red-400 hover:text-white text-sm uppercase tracking-widest">Logout</button>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
            
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
                                             <p className="text-xs text-white/40 mt-1">{order._id}</p>
                                         </div>
                                         <div className="text-right">
                                             <p className="text-gold-400 font-mono font-bold">${order.totalAmount.toFixed(2)}</p>
                                             <span className={`text-[10px] uppercase px-2 py-1 rounded ${
                                                 order.deliveryStatus === 'Delivered' ? 'bg-green-500/20 text-green-400' : 
                                                 order.deliveryStatus === 'Assigned' ? 'bg-blue-500/20 text-blue-400' :
                                                 'bg-amber-500/20 text-amber-400'
                                             }`}>{order.deliveryStatus || order.status}</span>
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

        </div>
    </div>
  );
}
