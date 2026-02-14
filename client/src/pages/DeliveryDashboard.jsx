import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || (storedUser.role !== 'delivery' && storedUser.role !== 'admin' && storedUser.email !== 'admin@gmail.com')) {
      alert('Access Restricted: Delivery Staff Only');
      navigate('/');
      return;
    }
    setUser(storedUser);
    fetchOrders(storedUser);
  }, []);

  const fetchOrders = async (user) => {
    try {
      let url = `http://localhost:5000/api/orders/delivery/${user.id}`;
      // If admin, fetch ALL orders (or all delivery orders, but here we can reuse the generic orders endpoint or filter)
      // Since existing endpoint is /orders/delivery/:staffId, let's just make a new simple check or separate endpoint.
      // But actually, the user wants 'admin can go to delivery page'. It implies seeing what delivery staff sees?
      // Or supervising everything? Let's assume Admin wants to see Global Delivery Status.
      
      if (user.role === 'admin' || user.email === 'admin@gmail.com') {
          // Fetch ALL orders that are assigned
          // Ideally we'd have a specific endpoint, but let's filter client side or use the main orders endpoint
          url = `http://localhost:5000/api/orders`; 
      }

      const res = await fetch(url);
      if (res.ok) {
        let data = await res.json();
        // If admin, maybe filter only those that are 'Assigned', 'Out for Delivery', 'Delivered' to keep it relevant?
        // Or just show all. Let's filter to show only 'active' delivery context if it helps, 
        // but showing all orders is fine too as a 'Master Delivery View'.
        if (user.role === 'admin' || user.email === 'admin@gmail.com') {
            data = data.filter(o => o.deliveryStatus && o.deliveryStatus !== 'Pending');
        }
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    const note = prompt('Add a note (optional):', '');
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/delivery-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note })
      });
      if (res.ok) {
        alert('Status Updated');
        fetchOrders(user);
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
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
            <span>🚚</span> DELIVERY DASHBOARD
        </h1>
        <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="text-red-400 hover:text-white text-sm uppercase tracking-wider">Logout</button>
        </div>
      </header>

      <main className="p-8 max-w-6xl mx-auto space-y-8">
        <h2 className="text-xl text-white/50 uppercase tracking-widest pl-2 border-l-4 border-amber-500">My Assignments</h2>

        {orders.length === 0 ? (
            <div className="text-center py-20 opacity-50">
                <p className="text-2xl">No deliveries assigned currently.</p>
            </div>
        ) : (
            <div className="grid gap-6">
                {orders.map(order => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={order._id} 
                        className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/10 transition-colors"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                    order.deliveryStatus === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                    order.deliveryStatus === 'Out for Delivery' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-amber-500/20 text-amber-400'
                                }`}>
                                    {order.deliveryStatus}
                                </span>
                                <span className="text-white/40 text-xs">#{order._id.slice(-6)}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">{order.customerName}</h3>
                            <p className="text-neutral-400 text-sm mb-4">{order.address}</p>
                            
                            <div className="flex flex-col gap-1 text-sm text-neutral-500">
                                {order.items.map((item, i) => (
                                    <span key={i}>• {item.quantity}x {item.name || 'Product'}</span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <button 
                                onClick={() => updateStatus(order._id, 'Out for Delivery')}
                                disabled={order.deliveryStatus === 'Delivered' || order.deliveryStatus === 'Out for Delivery'}
                                className="px-4 py-2 bg-blue-600 rounded text-sm font-bold disabled:opacity-30 hover:bg-blue-500 transition-colors"
                            >
                                Mark Out for Delivery
                            </button>
                            <button 
                                onClick={() => updateStatus(order._id, 'Delivered')}
                                disabled={order.deliveryStatus === 'Delivered'}
                                className="px-4 py-2 bg-green-600 rounded text-sm font-bold disabled:opacity-30 hover:bg-green-500 transition-colors"
                            >
                                Mark Delivered
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}
