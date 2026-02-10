import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Dashboard Metrics
  const lowStockIngredients = ingredients.filter(i => i.quantity < i.minLevel).length;

  useEffect(() => {
    // Check Auth
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.role !== 'admin' && user.email !== 'admin@gmail.com')) {
        alert('Access Denied: Oompa Loompas Only!');
        navigate('/login');
        return;
    }
    fetchData();

    // Auto refresh when coming back to this tab
    window.addEventListener('focus', fetchData);
    return () => window.removeEventListener('focus', fetchData);
  },[]);

  const fetchData = async () => {
    try {
        console.log("Fetching fresh inventory data...");
        const resIng = await fetch('http://localhost:5000/api/ingredients');
        const resProd = await fetch('http://localhost:5000/api/products');
        const resOrders = await fetch('http://localhost:5000/api/orders');

        if(resIng.ok) setIngredients(await resIng.json());
        if(resProd.ok) setProducts(await resProd.json());
        if(resOrders.ok) setOrders(await resOrders.json());
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
    <div className="min-h-screen bg-chocolate-900 text-white font-sans flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
        {/* ... existing sidebar content ... */}
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gold-500 font-serif tracking-wider">FACTORY<br/><span className="text-white text-base font-sans font-light tracking-normal">CONTROL ROOM</span></h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
            {[ 
                { id: 'summary', icon: '📊', label: 'Overview' },
                { id: 'ingredients', icon: '🥜', label: 'Ingredients' },
                { id: 'store', icon: '🍫', label: 'Chocolate Store' },
                { id: 'orders', icon: '📦', label: 'Customer Orders' }, 
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-gold-500 text-black font-bold' : 'text-chocolate-100 hover:bg-white/5'}`}
                >
                    <span>{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 transition-colors text-sm">
                Exit Factory
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-sm sticky top-0 z-30">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">{activeTab}</h2>
            <div className="flex items-center gap-6">
                <button onClick={fetchData} className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 transition-all active:scale-95">
                    🔄 Sync Data
                </button>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-green-500 font-mono">LIVE FEED</span>
                </div>
            </div>
        </header>

        <div className="p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'summary' && <SummaryView ingredients={ingredients} products={products} orders={orders} lowStock={lowStockIngredients} />}
                    {activeTab === 'ingredients' && <IngredientsManager ingredients={ingredients} refresh={fetchData} />}
                    {activeTab === 'store' && <StoreManager products={products} refresh={fetchData} />}
                    {activeTab === 'orders' && <OrderManager orders={orders} />}
                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub Components ---

const SummaryView = ({ ingredients, products, orders, lowStock }) => {
    const totalRawUnits = ingredients.reduce((sum, ing) => sum + (ing.quantity || 0), 0);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard title="Ingredient Types" value={ingredients.length} color="bg-blue-500/10 border-blue-500/50 text-blue-400" />
            <MetricCard title="Total Raw Units" value={totalRawUnits.toFixed(1)} color="bg-purple-500/10 border-purple-500/50 text-purple-400" />
            <MetricCard title="Active Products" value={products.length} color="bg-gold-500/10 border-gold-500/50 text-gold-400" />
            <MetricCard title="Low Stock Alerts" value={lowStock} color="bg-red-500/10 border-red-500/50 text-red-400" alert={lowStock > 0} />
            
            {/* Simple visual chart placeholder */}
            <div className="col-span-1 md:col-span-4 bg-black/30 border border-white/10 p-6 rounded-xl mt-6">
                <h3 className="text-sm font-bold text-chocolate-200 uppercase mb-4">Production Output</h3>
                <div className="h-40 flex items-end gap-2">
                    {[40, 70, 45, 90, 60, 85, 55, 65, 80, 50, 95, 75].map((h, i) => (
                        <div key={i} className="flex-1 bg-gold-600/20 rounded-t-sm relative overflow-hidden group">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                className="absolute bottom-0 w-full bg-gradient-to-t from-gold-600 to-gold-400 opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const OrderManager = ({ orders }) => (
    <div className="space-y-6">
        <div className="overflow-x-auto bg-black/20 rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-chocolate-200 text-xs uppercase border-b border-white/10">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-xs opacity-50">#{order._id.slice(-6)}</td>
                            <td className="p-4">
                                <p className="font-bold">{order.customerName}</p>
                                <p className="text-xs text-white/50">{order.email}</p>
                            </td>
                            <td className="p-4">
                                <div className="space-y-1">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="text-sm">
                                            <span className="text-gold-500 font-bold">{item.quantity}x</span> {item.name}
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="p-4 font-mono font-bold text-green-400">${order.totalAmount.toFixed(2)}</td>
                            <td className="p-4 text-sm text-white/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="p-4">
                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan="6" className="p-8 text-center text-white/30">No orders received yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const IngredientsManager = ({ ingredients, refresh }) => {
    const [newItem, setNewItem] = useState({ name: '', quantity: 0, unit: 'kg' });
    
    const addIngredient = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:5000/api/ingredients', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newItem)
        });
        setNewItem({ name: '', quantity: 0, unit: 'kg' });
        refresh();
    };

    const deleteItem = async (id) => {
        if(!confirm('Are you sure?')) return;
        await fetch(`http://localhost:5000/api/ingredients/${id}`, { method: 'DELETE' });
        refresh();
    };

    return (
        <div className="space-y-8">
            {/* Add Form */}
            <form onSubmit={addIngredient} className="bg-black/30 p-6 rounded-xl border border-white/10 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-chocolate-200 uppercase block mb-2">Ingredient Name</label>
                    <input value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 focus:border-gold-500 outline-none text-white" placeholder="Cocoa Beans" required />
                </div>
                <div className="w-32">
                    <label className="text-xs text-chocolate-200 uppercase block mb-2">Quantity</label>
                    <input type="number" value={newItem.quantity} onChange={e=>setNewItem({...newItem, quantity: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 focus:border-gold-500 outline-none text-white" />
                </div>
                <div className="w-32">
                     <label className="text-xs text-chocolate-200 uppercase block mb-2">Unit</label>
                    <select value={newItem.unit} onChange={e=>setNewItem({...newItem, unit: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-gold-500 outline-none">
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="liters">liters</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pcs</option>
                    </select>
                </div>
                <button type="submit" className="bg-gold-500 text-black font-bold px-6 py-2 rounded hover:bg-gold-400 transition-colors">ADD</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ingredients.map(ing => (
                    <div key={ing._id} className="bg-white/5 border border-white/5 p-6 rounded-xl hover:border-gold-500/30 transition-colors relative group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-chocolate-100">{ing.name}</h3>
                            <button onClick={()=>deleteItem(ing._id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                        <div className="flex items-end gap-2">
                             <span className="text-4xl font-mono text-gold-500">{ing.quantity}</span>
                             <span className="text-sm text-white/50 mb-2">{ing.unit}</span>
                        </div>
                        {ing.quantity < ing.minLevel && (
                             <div className="absolute top-4 right-4 animate-pulse w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const StoreManager = ({ products, refresh }) => {
    const [formData, setFormData] = useState({ name: '', price: '', stock: '', description: '', image: '' });
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId 
            ? `http://localhost:5000/api/products/${editingId}`
            : 'http://localhost:5000/api/products';
        
        const method = editingId ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        setFormData({ name: '', price: '', stock: '', description: '', image: '' });
        setEditingId(null);
        refresh();
    };
    
    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description,
            image: product.image
        });
        setEditingId(product._id);
    };

    const deleteProduct = async (id) => {
        if(!confirm('Delete this chocolate?')) return;
        await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
        refresh();
    };

    return (
        <div className="space-y-6">
             {/* Add/Edit Product Form */}
             <form onSubmit={handleSubmit} className="bg-black/30 p-6 rounded-xl border border-white/10 space-y-4">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gold-500 font-bold uppercase tracking-wider text-sm">
                        {editingId ? 'Edit Chocolate' : 'Add New Chocolate'}
                    </h3>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', price: '', stock: '', description: '', image: '' }); }} className="text-xs text-white/50 hover:text-white">
                            Cancel Edit
                        </button>
                    )}
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-chocolate-200 block mb-1">Product Name</label>
                        <input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 focus:border-gold-500 outline-none text-white" required />
                    </div>
                    <div>
                        <label className="text-xs text-chocolate-200 block mb-1">Price ($)</label>
                        <input type="number" step="0.01" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 focus:border-gold-500 outline-none text-white" required />
                    </div>
                    <div>
                        <label className="text-xs text-chocolate-200 block mb-1">Stock Qty</label>
                         <input type="number" value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 focus:border-gold-500 outline-none text-white" required />
                    </div>
                    <div>
                        <label className="text-xs text-chocolate-200 block mb-1">Image URL</label>
                         <input value={formData.image} onChange={e=>setFormData({...formData, image: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 focus:border-gold-500 outline-none text-white" placeholder="https://..." />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-xs text-chocolate-200 block mb-1">Description</label>
                        <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 focus:border-gold-500 outline-none text-white h-20" required ></textarea>
                    </div>
                 </div>
                 <div className="text-right">
                    <button type="submit" className={`font-bold px-6 py-2 rounded transition-colors ${editingId ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-gold-500 text-black hover:bg-gold-400'}`}>
                        {editingId ? 'Update Product' : 'Create Product'}
                    </button>
                 </div>
             </form>

             <div className="overflow-x-auto bg-black/20 rounded-xl border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-chocolate-200 text-xs uppercase border-b border-white/10">
                            <th className="p-4">Image</th>
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock Level</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="w-12 h-12 rounded bg-chocolate-800 overflow-hidden">
                                        {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : null}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-lg">{p.name}</td>
                                <td className="p-4 font-mono text-gold-400">${p.price}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-black/50 rounded-full overflow-hidden">
                                            <div className={`h-full ${p.stock > 20 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(p.stock, 100)}%` }}></div>
                                        </div>
                                        <span className="text-xs opacity-70">{p.stock} units</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 rounded text-xs ${p.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {p.stock > 0 ? 'In Stock' : 'Sold Out'}
                                     </span>
                                </td>
                                <td className="p-4 flex gap-3">
                                    <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                    <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:text-red-400">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    );
}

const MetricCard = ({ title, value, color, alert }) => (
    <div className={`p-6 rounded-xl border ${color} bg-clip-padding backdrop-filter backdrop-blur-xl relative overflow-hidden`}>
        <h3 className="text-sm font-bold uppercase opacity-80 mb-2">{title}</h3>
        <p className="text-4xl font-mono font-bold">{value}</p>
        {alert && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"></div>}
    </div>
);

export default Inventory;
