import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', contactPerson: '', email: '', phone: '', address: '', suppliedIngredients: [] });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user && (user.role === 'admin' || user.email === 'admin@gmail.com');
    const isSupplier = user && (user.role === 'supplier' || user.email === 'supplier@gmail.com');

    if (!isAdmin && !isSupplier) {
        alert('Access Denied: Suppliers or Admin Only!');
        navigate('/login');
        return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const resSuppliers = await fetch('http://localhost:5000/api/suppliers');
        const resIngredients = await fetch('http://localhost:5000/api/ingredients');
        if(resSuppliers.ok) setSuppliers(await resSuppliers.json());
        if(resIngredients.ok) setIngredients(await resIngredients.json());
    } catch (err) {
        console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:5000/api/suppliers/${editingId}` : 'http://localhost:5000/api/suppliers';

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier)
    });

    if(res.ok) {
        setShowAddModal(false);
        setNewSupplier({ name: '', contactPerson: '', email: '', phone: '', address: '', suppliedIngredients: [] });
        setEditingId(null);
        fetchData();
    }
  };

  const deleteSupplier = async (id) => {
      if(!window.confirm('Delete this supplier?')) return;
      await fetch(`http://localhost:5000/api/suppliers/${id}`, { method: 'DELETE' });
      fetchData();
  };

  const startEdit = (s) => {
      setEditingId(s._id);
      setNewSupplier({
          name: s.name,
          contactPerson: s.contactPerson || '',
          email: s.email || '',
          phone: s.phone || '',
          address: s.address || '',
          suppliedIngredients: s.suppliedIngredients.map(i => i._id || i)
      });
      setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-chocolate-900 text-white font-sans flex flex-col md:flex-row">
        
        {/* Sidebar Space (Consistent with other dashboards) */}
        <aside className="w-full md:w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
            <h1 className="text-2xl font-serif text-white mb-8">🚢 SUPPLIER <span className="text-gold-500">CENTRAL</span></h1>
            <nav className="space-y-2 flex-1">
                <button onClick={()=>navigate('/')} className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-white/5 text-chocolate-100">
                    <span>🏠</span> Home
                </button>
                {JSON.parse(localStorage.getItem('user'))?.role === 'admin' && (
                    <button onClick={()=>navigate('/admin')} className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-white/5 text-chocolate-100">
                        <span>⬅️</span> Admin Panel
                    </button>
                )}
                <button onClick={()=>setShowAddModal(true)} className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 bg-gold-500 text-black font-bold shadow-lg shadow-gold-500/20 mt-4">
                    <span>➕</span> Add New Supplier
                </button>
            </nav>
        </aside>

        <main className="flex-1 p-8 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            <h2 className="text-3xl font-serif text-gold-500 mb-8 tracking-wide">Supplier Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map(s => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={s._id} 
                        className="bg-black/30 border border-white/10 p-6 rounded-2xl hover:border-gold-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>startEdit(s)} className="text-blue-400 hover:text-blue-300 text-xs bg-blue-400/10 px-2 py-1 rounded">Edit</button>
                            <button onClick={()=>deleteSupplier(s._id)} className="text-red-400 hover:text-red-300 text-xs bg-red-400/10 px-2 py-1 rounded">Del</button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
                        <div className="space-y-2 text-sm text-chocolate-100">
                            <p className="flex items-center gap-2"><span className="opacity-50">👤</span> {s.contactPerson || 'No contact'}</p>
                            <p className="flex items-center gap-2"><span className="opacity-50">📧</span> {s.email || 'N/A'}</p>
                            <p className="flex items-center gap-2"><span className="opacity-50">📞</span> {s.phone || 'N/A'}</p>
                            <p className="flex items-center gap-2 line-clamp-1"><span className="opacity-50">📍</span> {s.address || 'N/A'}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5">
                            <h4 className="text-[10px] uppercase text-gold-500/50 font-bold mb-2 tracking-widest">Supplies:</h4>
                            <div className="flex flex-wrap gap-1">
                                {s.suppliedIngredients.map(i => (
                                    <span key={i._id} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full text-white/70">
                                        {i.name}
                                    </span>
                                ))}
                                {s.suppliedIngredients.length === 0 && <span className="text-[10px] text-white/20 italic">No items linked</span>}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {suppliers.length === 0 && (
                <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/10">
                    <p className="text-white/30 italic">No supplier companies registered yet.</p>
                </div>
            )}
        </main>

        {/* Add/Edit Modal */}
        <AnimatePresence>
            {showAddModal && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                >
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="bg-chocolate-800 border border-white/10 p-8 rounded-3xl w-full max-w-xl shadow-2xl relative"
                    >
                        <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-white/30 hover:text-white text-2xl">×</button>
                        <h2 className="text-2xl font-serif text-gold-500 mb-6">{editingId ? 'Edit Supplier' : 'Register New Supplier'}</h2>
                        
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs text-chocolate-200 uppercase block mb-1">Company Name</label>
                                    <input required value={newSupplier.name} onChange={e=>setNewSupplier({...newSupplier, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none" placeholder="Cocoa International Ltd" />
                                </div>
                                <div>
                                    <label className="text-xs text-chocolate-200 uppercase block mb-1">Contact Person</label>
                                    <input value={newSupplier.contactPerson} onChange={e=>setNewSupplier({...newSupplier, contactPerson: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-chocolate-200 uppercase block mb-1">Phone</label>
                                    <input value={newSupplier.phone} onChange={e=>setNewSupplier({...newSupplier, phone: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-chocolate-200 uppercase block mb-1">Email</label>
                                    <input type="email" value={newSupplier.email} onChange={e=>setNewSupplier({...newSupplier, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-chocolate-200 uppercase block mb-1">Supplied Ingredients</label>
                                    <div className="flex flex-wrap gap-2 p-3 bg-black/20 rounded-lg border border-white/5">
                                        {ingredients.map(ing => (
                                            <label key={ing._id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    checked={newSupplier.suppliedIngredients.includes(ing._id)}
                                                    onChange={(e) => {
                                                        const id = ing._id;
                                                        setNewSupplier(prev => ({
                                                            ...prev,
                                                            suppliedIngredients: e.target.checked 
                                                                ? [...prev.suppliedIngredients, id]
                                                                : prev.suppliedIngredients.filter(sid => sid !== id)
                                                        }));
                                                    }}
                                                    className="accent-gold-500" 
                                                />
                                                {ing.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-gold-500 text-black font-bold rounded-xl mt-4 shadow-lg shadow-gold-500/20 active:scale-95 transition-all">
                                {editingId ? 'Update Company Details' : 'Register Supplier'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default SupplierDashboard;
