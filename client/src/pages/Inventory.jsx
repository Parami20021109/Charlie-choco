import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
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
        const resPOs = await fetch('http://localhost:5000/api/purchase-orders');
        const resSuppliers = await fetch('http://localhost:5000/api/suppliers');

        if(resIng.ok) setIngredients(await resIng.json());
        if(resProd.ok) setProducts(await resProd.json());
        if(resOrders.ok) setOrders(await resOrders.json());
        if(resPOs.ok) setPurchaseOrders(await resPOs.json());
        if(resSuppliers.ok) setSuppliers(await resSuppliers.json());
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
    <div className="min-h-screen bg-chocolate-950 text-white font-sans flex overflow-hidden selection:bg-gold-500/30">
      
      {/* Premium Sidebar */}
      <aside className="w-72 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col z-40 relative">
        <div className="p-10">
            <h1 className="text-3xl font-bold bg-gradient-to-br from-gold-300 via-gold-500 to-amber-600 bg-clip-text text-transparent font-serif tracking-tighter leading-none italic">
                CFMS<br/>
                <span className="text-white text-xs font-sans font-black tracking-[0.3em] uppercase opacity-40 not-italic">Logistics Hub</span>
            </h1>
        </div>
        
        <nav className="flex-1 px-6 space-y-1.5">
            {[ 
                { id: 'summary', icon: '📊', label: 'Strategic Overview' },
                { id: 'ingredients', icon: '🥜', label: 'Raw Materials' },
                { id: 'procurement', icon: '🚚', label: 'Procurement' },
                { id: 'store', icon: '🍫', label: 'Finished Goods' }, 
                { id: 'orders', icon: '📦', label: 'Global Orders' }, 
            ].map((tab) => (
                <button
                    key={tab.id}
                    id={tab.id === 'procurement' ? 'btn-procurement' : undefined}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                        activeTab === tab.id 
                        ? 'text-gold-400 font-bold bg-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {activeTab === tab.id && (
                        <motion.div layoutId="activeTabGlow" className="absolute left-0 w-1 h-6 bg-gold-500 rounded-full" />
                    )}
                    <span className={`text-xl transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110 opacity-60 group-hover:opacity-100'}`}>{tab.icon}</span>
                    <span className="text-sm tracking-wide">{tab.label}</span>
                </button>
            ))}
        </nav>

        <div className="p-6 border-t border-white/5">
            <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-5 py-3 text-red-400/60 hover:text-red-400 transition-all text-xs font-bold uppercase tracking-widest group"
            >
                <span className="group-hover:translate-x-1 transition-transform">←</span> Exit Command Center
            </button>
        </div>
      </aside>

      {/* Main Command Center */}
      <main className="flex-1 overflow-y-auto bg-[#0a0604] relative">
        {/* Dynamic Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-chocolate-600/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>

        <header className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-0 z-30">
            <div>
                <h2 className="text-3xl font-serif font-bold text-white tracking-tight capitalize">{activeTab.replace('-', ' ')}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-green-500/80 font-black tracking-widest uppercase font-sans">System Operational</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={fetchData} 
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-black/20"
                >
                    <span className="text-white/60 group-hover:rotate-180 transition-transform duration-700">🔄</span>
                    <span className="text-xs font-bold text-white/80 uppercase tracking-tighter font-sans">Sync Telemetry</span>
                </button>
            </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                >
                    {activeTab === 'summary' && <SummaryView ingredients={ingredients} products={products} orders={orders} lowStock={lowStockIngredients} toProcurement={()=>setActiveTab('procurement')} />}
                    {activeTab === 'ingredients' && <IngredientsManager ingredients={ingredients} suppliers={suppliers} refresh={fetchData} toProcurement={()=>setActiveTab('procurement')} />}
                    {activeTab === 'procurement' && <ProcurementManager purchaseOrders={purchaseOrders} suppliers={suppliers} ingredients={ingredients} refresh={fetchData} />}
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
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard icon="🧪" title="Material Diversity" value={ingredients.length} subtext="Stored Raw Goods" color="from-blue-600/20 to-indigo-600/20" borderColor="border-blue-500/20" />
                <MetricCard icon="⚖️" title="Warehouse Volume" value={totalRawUnits.toFixed(1)} subtext="Total Metric Units" color="from-purple-600/20 to-fuchsia-600/20" borderColor="border-purple-500/20" />
                <MetricCard icon="🍫" title="SKU Portfolio" value={products.length} subtext="Live Store Items" color="from-amber-600/20 to-gold-600/20" borderColor="border-gold-500/20" />
                <MetricCard icon="🔥" title="Supply Risks" value={lowStock} subtext="Critical Restocks" color="from-red-600/20 to-orange-600/20" borderColor="border-red-500/20" alert={lowStock > 0} 
                    onClick={lowStock > 0 ? () => document.getElementById('btn-procurement')?.click() : undefined}
                />
            </div>
            
            {/* Visual Analytics Section */}
            <div className="bg-black/40 border border-white/5 p-10 rounded-[40px] relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5 select-none text-[200px] font-serif -mr-20 -mt-20">WONKA</div>
                <h3 className="text-xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-gold-500 rounded-full"></span>
                    Operational Throughput
                </h3>
                <div className="h-64 flex items-end gap-3 px-4">
                    {[40, 70, 45, 90, 60, 85, 55, 65, 80, 50, 95, 75, 60, 40].map((h, i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded-2xl relative overflow-hidden group border border-white/5">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.05, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                                className="absolute bottom-0 w-full bg-gradient-to-t from-gold-600/40 via-gold-500/20 to-gold-400/10 opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute top-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-black pointer-events-none">
                                {h}%
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-6 px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                    <span>Jan Production cycle</span>
                    <span>Q1 Yield Analysis</span>
                    <span>Live Monitoring</span>
                </div>
            </div>
        </div>
    );
};

const OrderManager = ({ orders }) => (
    <div className="space-y-8">
        <div className="bg-black/40 border border-white/5 rounded-[32px] overflow-hidden ring-1 ring-white/10 shadow-2xl backdrop-blur-3xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-gold-500 rounded-full"></span>
                    Global Order Registry
                </h3>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Total: {orders.length} Sessions</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-white/30 text-[10px] uppercase font-black tracking-widest border-b border-white/5 bg-white/[0.02]">
                            <th className="px-8 py-5">Manifest ID</th>
                            <th className="px-8 py-5">Client Profile</th>
                            <th className="px-8 py-5">Consolidated Items</th>
                            <th className="px-8 py-5">Valuation</th>
                            <th className="px-8 py-5">Lifecycle Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {orders.map(order => (
                            <tr key={order._id} className="group hover:bg-white/[0.04] transition-all duration-300">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gold-500/40 group-hover:bg-gold-500 transition-colors"></div>
                                        <span className="font-mono text-[11px] font-bold text-white/40 tracking-tighter">#{order._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-white text-sm tracking-tight">{order.customerName}</p>
                                        <p className="text-[10px] text-white/30 font-mono lower">{order.email}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-wrap gap-1.5">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-full text-white/60 font-black uppercase">
                                                <span className="text-gold-500 mr-1">{item.quantity}×</span> {item.name}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="font-mono font-black text-lg text-green-400 leading-none">${order.totalAmount.toFixed(2)}</span>
                                        <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <span className="text-[10px] font-black text-green-400/80 uppercase tracking-widest">
                                            {order.status}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <span className="text-4xl">📭</span>
                                        <p className="text-xs font-black uppercase tracking-[0.4em]">No Live Shipments Detected</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const IngredientsManager = ({ ingredients, suppliers, refresh }) => {
    const [newItem, setNewItem] = useState({ name: '', quantity: 0, unit: 'kg' });
    const [selectedSupplierId, setSelectedSupplierId] = useState('');
    
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
        if(!confirm('Archive this material?')) return;
        await fetch(`http://localhost:5000/api/ingredients/${id}`, { method: 'DELETE' });
        refresh();
    };

    const bulkReorder = async () => {
        const lowItems = ingredients.filter(i => i.quantity < (i.minLevel || 10));
        if (lowItems.length === 0) return alert('Supply chain is healthy. No reorders needed.');
        
        if(!confirm(`Authorize consolidated restock for ${lowItems.length} materials?`)) return;

        const supplierId = selectedSupplierId || (suppliers.length > 0 ? suppliers[0]._id : null);
        if (!supplierId) return alert('Strategic Alert: No Logistics Partner Selected!');
        
        const poData = {
            supplierId: supplierId,
            items: lowItems.map(item => ({
                ingredientId: item._id,
                quantity: (item.minLevel || 10) * 2,
                unitPrice: 5.00
            })),
            notes: "AUTHORIZED LOGISTICS RESTOCK - OOMPA LOOMPA CORE"
        };

        const res = await fetch('http://localhost:5000/api/purchase-orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(poData)
        });

        if (res.ok) {
            alert('Manifest Authorized. Check Procurement for tracking.');
            refresh();
        }
    };

    return (
        <div className="space-y-12">
            {/* High-End Command Input */}
            <div className="bg-black/40 border border-white/5 p-8 rounded-[40px] shadow-2xl ring-1 ring-white/10 relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-gold-500/20"></div>
                <div className="flex flex-col lg:flex-row gap-8 items-end relative z-10">
                    <form onSubmit={addIngredient} className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1">Material Designation</label>
                            <input value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all placeholder:text-white/10" placeholder="e.g. Tanzanian Cocoa" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1">Initial Reserve</label>
                            <div className="flex gap-2">
                                <input type="number" value={newItem.quantity} onChange={e=>setNewItem({...newItem, quantity: e.target.value})} className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all" />
                                <select value={newItem.unit} onChange={e=>setNewItem({...newItem, unit: e.target.value})} className="w-24 bg-white/10 border border-white/10 rounded-2xl px-3 py-4 text-xs font-bold text-gold-400 outline-none">
                                    <option value="kg">KG</option>
                                    <option value="liters">L</option>
                                    <option value="pcs">PCS</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full bg-gold-500 hover:bg-white text-black font-black text-xs h-[54px] rounded-2xl transition-all active:scale-95 shadow-lg shadow-gold-500/20 uppercase tracking-widest">Register Material</button>
                        </div>
                    </form>

                    <div className="lg:w-px h-12 bg-white/10 hidden lg:block"></div>

                    <div className="w-full lg:w-96 p-6 bg-white/[0.03] border border-white/5 rounded-3xl flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Logistics Partner</span>
                            <select 
                                value={selectedSupplierId} 
                                onChange={e => setSelectedSupplierId(e.target.value)}
                                className="bg-transparent text-xs text-gold-400 font-black outline-none cursor-pointer hover:text-white transition-colors"
                            >
                                <option value="" className="bg-chocolate-950">System Default</option>
                                {suppliers.map(s => <option key={s._id} value={s._id} className="bg-chocolate-950">{s.name}</option>)}
                            </select>
                        </div>
                        <button 
                            onClick={bulkReorder}
                            className="bg-white/10 hover:bg-white text-white/60 hover:text-black font-black text-[10px] py-4 rounded-xl transition-all uppercase tracking-[0.2em] border border-white/5"
                        >
                            ⚡ Initiate Batch Restock
                        </button>
                    </div>
                </div>
            </div>

            {/* Material Pods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ingredients.map(ing => {
                    const isCritical = ing.quantity < (ing.minLevel || 10);
                    const stockPercentage = Math.min((ing.quantity / ((ing.minLevel || 10) * 5)) * 100, 100);
                    
                    return (
                        <motion.div 
                            layout
                            key={ing._id} 
                            whileHover={{ y: -8 }}
                            className={`group bg-black/40 border p-8 rounded-[40px] transition-all duration-700 relative overflow-hidden ring-1 shadow-2xl ${
                                isCritical 
                                ? 'border-red-500/30 ring-red-500/20 shadow-red-500/5' 
                                : 'border-white/5 ring-white/5 shadow-black/20 hover:border-gold-500/30'
                            }`}
                        >
                            {/* Holographic Glows */}
                            <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-20 transition-colors duration-1000 ${isCritical ? 'bg-red-500' : 'group-hover:bg-gold-500 bg-white/5'}`}></div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-serif font-black text-white tracking-tight leading-none italic">{ing.name}</h3>
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Resource Node: {ing._id.slice(-4).toUpperCase()}</span>
                                    </div>
                                    <button onClick={()=>deleteItem(ing._id)} className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">✕</button>
                                </div>
                                
                                <div className="flex items-baseline gap-3 mb-8">
                                     <span className={`text-5xl font-mono font-black tracking-tighter ${isCritical ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                         {ing.quantity}
                                     </span>
                                     <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{ing.unit}</span>
                                </div>

                                {/* Dynamic Gauge */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Availability</span>
                                            <span className={`text-[10px] font-bold ${isCritical ? 'text-red-400' : 'text-gold-400'}`}>
                                                {isCritical ? 'Critical Deficiency' : 'Nominal Levels'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-white/40">Thres: {ing.minLevel || 10}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px] ring-1 ring-white/10">
                                         <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stockPercentage}%` }}
                                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                                            className={`h-full rounded-full relative ${
                                                isCritical 
                                                ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                                                : 'bg-gradient-to-r from-gold-600 to-amber-400'
                                            }`}
                                         >
                                             <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-[4px]"></div>
                                         </motion.div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                                    <div className="flex flex-col">
                                         <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Health Index</span>
                                         <span className="text-xs font-bold text-green-400/80">Optimal</span>
                                    </div>
                                    <button 
                                        disabled={!isCritical}
                                        onClick={() => singleReorder(ing)}
                                        className={`flex items-center justify-center px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            isCritical 
                                            ? 'bg-white text-black shadow-xl shadow-white/10 active:scale-95 cursor-pointer' 
                                            : 'bg-white/5 text-white/10 border border-white/5 cursor-not-allowed'
                                        }`}
                                    >
                                        Auto-PO 🤖
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
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
        if(!confirm('Decommission this product?')) return;
        await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
        refresh();
    };

    return (
        <div className="space-y-12">
             {/* The Vault Input */}
             <div className="bg-black/40 border border-white/5 p-10 rounded-[40px] shadow-2xl ring-1 ring-white/10 backdrop-blur-3xl overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent"></div>
                 <form onSubmit={handleSubmit} className="relative z-10">
                     <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-serif font-black text-white italic tracking-tight">
                                {editingId ? 'Modify SKU' : 'Register New Asset'}
                            </h3>
                            <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em]">Vault Management System</p>
                        </div>
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', price: '', stock: '', description: '', image: '' }); }} className="text-[10px] font-black uppercase text-gold-500 border border-gold-500/20 px-4 py-2 rounded-full hover:bg-gold-500 hover:text-black transition-all">
                                Abort Edit
                            </button>
                        )}
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1">Global Product Name</label>
                            <input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all" placeholder="Wonka's Secret Reserve" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1">Market Valuation</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 font-black">$</span>
                                <input type="number" step="0.01" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 py-4 text-sm text-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1">Inventory Allocation</label>
                            <input type="number" value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all" required />
                        </div>
                        <div className="col-span-1 md:col-span-3 space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1">Asset Description</label>
                            <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all h-24" placeholder="Describe the magical properties..." required ></textarea>
                        </div>
                     </div>
                     <div className="mt-10 flex justify-end">
                        <button type="submit" className={`font-black text-[10px] uppercase tracking-[0.2em] px-12 py-5 rounded-2xl transition-all active:scale-95 shadow-2xl ${editingId ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-gold-500 text-black shadow-gold-500/20'}`}>
                            {editingId ? 'Confirm Re-calibration' : 'Authorize Asset Launch'}
                        </button>
                     </div>
                 </form>
             </div>

             {/* Registry Table */}
             <div className="bg-black/40 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl ring-1 ring-white/10 backdrop-blur-3xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em] border-b border-white/5 bg-white/[0.02]">
                            <th className="px-10 py-6">Visual ID</th>
                            <th className="px-10 py-6">Product Metadata</th>
                            <th className="px-10 py-6">Stock Status</th>
                            <th className="px-10 py-6 text-right">Operational Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {products.map(p => (
                            <tr key={p._id} className="group hover:bg-white/[0.04] transition-all duration-300">
                                <td className="px-10 py-8">
                                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : null}
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="space-y-1">
                                        <p className="font-serif font-black text-xl text-white italic leading-none">{p.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gold-500 font-mono font-bold text-sm">${p.price}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                            <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">{p._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                            <span className={p.stock > 10 ? 'text-green-400' : 'text-red-400'}>{p.stock > 0 ? 'Active Supply' : 'Depleted'}</span>
                                            <span className="text-white/20">{p.stock} Units</span>
                                        </div>
                                        <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] ring-1 ring-white/10">
                                            <div className={`h-full rounded-full ${p.stock > 10 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-rose-400'}`} style={{ width: `${Math.min(p.stock, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex justify-end gap-4">
                                        <button onClick={() => handleEdit(p)} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-gold-500 transition-colors">Adjust</button>
                                        <button onClick={() => deleteProduct(p._id)} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-500 transition-colors">Purge</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    );
}

const ProcurementManager = ({ purchaseOrders, suppliers, ingredients, refresh }) => {
    const [showForm, setShowForm] = useState(false);
    const [newPO, setNewPO] = useState({ supplierId: '', items: [] });
    const [tempItem, setTempItem] = useState({ ingredientId: '', quantity: '', unitPrice: '' });

    const addItem = () => {
        if(!tempItem.ingredientId || !tempItem.quantity) return;
        setNewPO(p => ({ ...p, items: [...p.items, { ...tempItem }] }));
        setTempItem({ ingredientId: '', quantity: '', unitPrice: '' });
    };

    const submitPO = async () => {
        if(!newPO.supplierId || newPO.items.length === 0) return alert('Strategic Error: Incomplete Manifest');
        await fetch('http://localhost:5000/api/purchase-orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newPO)
        });
        setShowForm(false);
        setNewPO({ supplierId: '', items: [] });
        refresh();
    };

    const updateStatus = async (id, status) => {
        await fetch(`http://localhost:5000/api/purchase-orders/${id}/status`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ status })
        });
        refresh();
    };

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h3 className="text-4xl font-serif font-black text-white italic tracking-tighter">Procurement Matrix</h3>
                    <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em]">Inbound Supply Chain Monitoring</p>
                </div>
                <button onClick={()=>setShowForm(!showForm)} className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showForm ? 'bg-white/5 text-white/40' : 'bg-gold-500 text-black shadow-2xl shadow-gold-500/20 active:scale-95'}`}>
                    <span className="relative z-10">{showForm ? 'Close Manifest' : 'Initiate New Purchase'}</span>
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/40 border border-white/5 p-10 rounded-[40px] shadow-2xl ring-1 ring-white/10 backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1">Logistics Partner</label>
                                    <select value={newPO.supplierId} onChange={e=>setNewPO({...newPO, supplierId: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-gold-400 font-bold outline-none appearance-none">
                                        <option value="" className="bg-chocolate-950">Identify Supplier...</option>
                                        {suppliers.map(s => <option key={s._id} value={s._id} className="bg-chocolate-950">{s.name}</option>)}
                                    </select>
                                </div>
                                
                                <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 space-y-4">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Material Addendum</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <select value={tempItem.ingredientId} onChange={e=>setTempItem({...tempItem, ingredientId: e.target.value})} className="col-span-2 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none">
                                            <option value="">Select Resource Type</option>
                                            {ingredients.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                                        </select>
                                        <input type="number" value={tempItem.quantity} onChange={e=>setTempItem({...tempItem, quantity: e.target.value})} className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none" placeholder="Quantity" />
                                        <input type="number" value={tempItem.unitPrice} onChange={e=>setTempItem({...tempItem, unitPrice: e.target.value})} className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none" placeholder="Price per Unit" />
                                    </div>
                                    <button onClick={addItem} className="w-full bg-white/10 hover:bg-white hover:text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">+</button>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1 mb-2">Manifest Summary</label>
                                <div className="flex-1 bg-black/20 rounded-3xl border border-white/5 p-6 overflow-y-auto space-y-3 min-h-[200px]">
                                    {newPO.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-[11px] font-bold bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="text-white/60 font-serif italic">{ingredients.find(i=>i._id===item.ingredientId)?.name}</span>
                                            <span className="font-mono text-gold-500">{item.quantity} units @ ${item.unitPrice}</span>
                                        </div>
                                    ))}
                                    {newPO.items.length === 0 && <p className="text-center text-white/10 font-black uppercase tracking-widest text-[10px] my-auto">Manifest Empty</p>}
                                </div>
                                <button onClick={submitPO} className="mt-6 w-full bg-gold-500 hover:bg-white text-black font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-gold-500/20 transition-all">Process Manifest</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-6">
                {purchaseOrders.map(po => (
                    <motion.div 
                        layout
                        key={po._id} 
                        className="group bg-black/40 border border-white/5 p-8 rounded-[40px] flex flex-col lg:flex-row justify-between items-center gap-8 hover:bg-white/[0.02] transition-all duration-500 ring-1 ring-white/10 shadow-2xl"
                    >
                        <div className="flex items-center gap-8 w-full lg:w-auto">
                            <div className="w-16 h-16 bg-white/[0.03] rounded-3xl border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                                🚚
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-gold-500 font-black text-lg">{po.poNumber}</span>
                                    <span className={`text-[9px] px-3 py-1 rounded-full border font-black uppercase tracking-widest ${
                                        po.status === 'Received' ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                                        po.status === 'Pending' ? 'border-amber-500/50 text-amber-500 bg-amber-500/10 animate-pulse' :
                                        'border-white/10 text-white/30 bg-white/5'
                                    }`}>{po.status}</span>
                                </div>
                                <p className="text-xl font-serif font-black text-white italic tracking-tight">{po.supplier?.name}</p>
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{new Date(po.orderDate).toLocaleDateString()} • {po.items.length} Resource Batches</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-10 w-full lg:w-auto justify-between lg:justify-end">
                            <div className="text-right">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-1">Total Valuation</span>
                                <span className="font-mono font-black text-3xl text-white tracking-tighter">${po.totalAmount.toLocaleString()}</span>
                            </div>
                            {po.status !== 'Received' && po.status !== 'Cancelled' && (
                                <button onClick={()=>updateStatus(po._id, 'Received')} className="bg-white text-black font-black px-6 py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gold-500 transition-all active:scale-95 shadow-xl shadow-white/5">
                                    Finalize Receipt 📥
                                </button>
                            )}
                            {po.status === 'Received' && (
                                <div className="w-10 h-10 rounded-full border border-green-500/30 flex items-center justify-center text-green-500 text-xs">✓</div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};


const MetricCard = ({ icon, title, value, subtext, color, borderColor, alert, onClick }) => (
    <motion.div 
        whileHover={{ scale: 1.02, y: -5 }}
        onClick={onClick}
        className={`p-8 rounded-[32px] border ${borderColor} bg-gradient-to-br ${color} backdrop-blur-3xl relative overflow-hidden group cursor-pointer transition-shadow hover:shadow-2xl hover:shadow-black/40`}
    >
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            {alert && <div className="p-2 bg-red-500 text-white rounded-full animate-ping text-[6px]"></div>}
        </div>
        <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <p className="text-5xl font-mono font-black text-white">{value}</p>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{subtext}</span>
            </div>
        </div>
        {alert && <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent animate-pulse pointer-events-none"></div>}
    </motion.div>
);

export default Inventory;
