import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChefDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('kitchen'); // kitchen, recipes
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]); // New Batch State
  
  // State for editing
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [newRecipe, setNewRecipe] = useState({ name: '', description: '', ingredients: [], productLink: '' });
  const [tempIng, setTempIng] = useState({ id: '', qty: '' });

  useEffect(() => {
    // Check Auth (Chef or Admin)
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.email !== 'chef@gmail.com' && user.email !== 'admin@gmail.com')) {
        alert('Access Denied: Kitchen Staff Only!');
        navigate('/');
        return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
      const resRecipes = await fetch('http://localhost:5000/api/recipes');
      const resIng = await fetch('http://localhost:5000/api/ingredients');
      const resProd = await fetch('http://localhost:5000/api/products');
      const resBatches = await fetch('http://localhost:5000/api/batches');
      
      if(resRecipes.ok) setRecipes(await resRecipes.json());
      if(resIng.ok) setIngredients(await resIng.json());
      if(resProd.ok) setProducts(await resProd.json());
      if(resBatches.ok) setBatches(await resBatches.json());
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- Recipe Management ---
  const addIngredientToRecipe = () => {
      if(!tempIng.id || !tempIng.qty) return;
      // Check if already added
      if(newRecipe.ingredients.some(i => i.ingredient === tempIng.id)) {
          alert('Ingredient already added!');
          return;
      }
      setNewRecipe(prev => ({
          ...prev, 
          ingredients: [...prev.ingredients, { ingredient: tempIng.id, quantity: Number(tempIng.qty) }] 
      }));
      setTempIng({ id: '', qty: '' });
  };

  const removeIngredientFromRecipe = (id) => {
      setNewRecipe(prev => ({
          ...prev,
          ingredients: prev.ingredients.filter(i => i.ingredient !== id)
      }));
  };

  const saveRecipe = async () => {
      if (!newRecipe.name) return alert('Recipe name is required!');
      if (newRecipe.ingredients.length === 0) {
          return alert('Please add at least one ingredient using the yellow "+" button before saving!');
      }

      const method = editingRecipeId ? 'PUT' : 'POST';
      const url = editingRecipeId ? `http://localhost:5000/api/recipes/${editingRecipeId}` : 'http://localhost:5000/api/recipes';
      
      const res = await fetch(url, {
          method: method,
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newRecipe)
      });

      if(res.ok) {
          alert(editingRecipeId ? 'Recipe Updated!' : 'New Recipe Created!');
          resetRecipeForm();
          fetchData();
          setActiveTab('kitchen');
      }
  };

  const deleteRecipe = async (id) => {
      if(!window.confirm('Are you sure you want to delete this recipe?')) return;
      const res = await fetch(`http://localhost:5000/api/recipes/${id}`, {
          method: 'DELETE'
      });
      if(res.ok) {
          alert('Recipe Deleted!');
          fetchData();
      }
  };

  const startEdit = (recipe) => {
      setEditingRecipeId(recipe._id);
      setNewRecipe({
          name: recipe.name,
          description: recipe.description || '',
          ingredients: recipe.ingredients.map(i => ({ ingredient: i.ingredient._id, quantity: i.quantity })),
          productLink: recipe.productLink ? recipe.productLink._id : ''
      });
      setActiveTab('recipes');
  };

  const resetRecipeForm = () => {
      setEditingRecipeId(null);
      setNewRecipe({ name: '', description: '', ingredients: [], productLink: '' });
      setTempIng({ id: '', qty: '' });
  };

  // --- Production ---
  // --- Production (Batch System) ---
  const createBatch = async (recipe, quantity) => {
      if(quantity <= 0) return;
      
      const res = await fetch('http://localhost:5000/api/batches', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ recipeId: recipe._id, quantity: Number(quantity) })
      });
      
      const data = await res.json();
      if(res.ok) {
          alert(`Batch ${data.batchNumber} Started! Moved to Roasting.`);
          fetchData(); 
      } else {
          alert('Error: ' + data.msg);
      }
  };

  const updateBatchStage = async (batchId, stageName, status) => {
      const res = await fetch(`http://localhost:5000/api/batches/${batchId}/stage`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ stageName, status })
      });
      if(res.ok) fetchData();
  };

  const submitForQC = async (batchId) => {
      // For now, auto-advance to QC_Pending by finishing Cooling
       const res = await fetch(`http://localhost:5000/api/batches/${batchId}/qc`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ 
              status: 'Approved', 
              inspectorId: JSON.parse(localStorage.getItem('user')).id,
              remarks: 'Auto-approved by Chef' 
          })
      });
      if(res.ok) {
          alert('Batch Approved & Stock Updated!');
          fetchData();
      }
  };

  return (
    <div className="min-h-screen bg-[#070403] text-white font-sans flex overflow-hidden lg:flex-row flex-col selection:bg-gold-500/30">
        <style>{`
            @keyframes scan {
                0% { top: 0% }
                100% { top: 100% }
            }
            .animate-scan {
                animation: scan 4s linear infinite;
            }
            .animate-spin-slow {
                animation: spin 8s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(212, 175, 55, 0.2);
                border-radius: 10px;
            }
        `}</style>
        
        {/* Master Sidebar */}
        <aside className="lg:w-72 w-full bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col z-40 relative">
            <div className="p-10">
                <h1 className="text-3xl font-bold bg-gradient-to-br from-gold-300 via-gold-500 to-amber-600 bg-clip-text text-transparent font-serif tracking-tighter leading-none italic">
                    WONKA<br/>
                    <span className="text-white text-xs font-sans font-black tracking-[0.3em] uppercase opacity-40 not-italic">Chef's Tactical</span>
                </h1>
            </div>
            
            <nav className="flex-1 px-6 space-y-1.5">
                {[ 
                    { id: 'kitchen', icon: '🍳', label: 'Tactical Production' },
                    { id: 'factory-map', icon: '🗺️', label: 'Floor Matrix' },
                    { id: 'recipes', icon: '📝', label: editingRecipeId ? 'Recalibrate Recipe' : 'Design Blueprint' },
                    { id: 'pantry', icon: '🧺', label: 'Material Silos' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); if(item.id !== 'recipes') resetRecipeForm(); }}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                            activeTab === item.id 
                            ? 'text-gold-400 font-bold bg-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {activeTab === item.id && (
                            <motion.div layoutId="activeTabGlow" className="absolute left-0 w-1 h-6 bg-gold-500 rounded-full" />
                        )}
                        <span className={`text-xl transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110 opacity-60 group-hover:opacity-100'}`}>{item.icon}</span>
                        <span className="text-sm tracking-wide">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-8 border-t border-white/5">
                <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-5 py-3 text-red-500/40 hover:text-red-500 transition-all text-xs font-black uppercase tracking-widest group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Secure Exit
                </button>
            </div>
        </aside>

        {/* Main Operational Area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0604] relative">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-600/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>

            <header className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-0 z-30">
                <div>
                    <h2 className="text-3xl font-serif font-black text-white tracking-tight capitalize">{activeTab.replace('-', ' ')}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] text-green-500/80 font-black tracking-widest uppercase font-sans tracking-[0.2em]">Kitchen Status: Optimal</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Master Chef</span>
                        <span className="text-xs font-bold text-gold-500">Staff #1971</span>
                    </div>
                    <button onClick={fetchData} className="group bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl transition-all active:scale-95">
                        <span className="text-white/60 group-hover:rotate-180 transition-transform duration-700 block">🔄</span>
                    </button>
                </div>
            </header>

            <div className="p-10 max-w-[1700px] mx-auto">
                <AnimatePresence mode="wait">
                    {activeTab === 'kitchen' && (
                        <motion.div 
                            key="kitchen"
                            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                            className="space-y-16"
                        >
                             {/* Tactical Matrix: Active Batches */}
                             <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-px flex-1 bg-white/5"></div>
                                    <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.5em] px-4 whitespace-nowrap">Active Production Matrix</h2>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>
                                
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    {batches.filter(b => b.status !== 'Completed' && b.status !== 'Rejected').length === 0 ? (
                                        <div className="p-20 border border-dashed border-white/5 rounded-[40px] text-center col-span-2 group hover:border-gold-500/20 transition-all bg-white/[0.01]">
                                            <span className="text-4xl opacity-20 group-hover:scale-110 transition-transform block mb-4">💠</span>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white/40 transition-colors">Manifest Queue Empty • Initiate Production Below</p>
                                        </div>
                                    ) : (
                                        batches.filter(b => b.status !== 'Completed' && b.status !== 'Rejected').map(batch => (
                                            <BatchCard key={batch._id} batch={batch} onUpdateStage={updateBatchStage} onQC={submitForQC} />
                                        ))
                                    )}
                                </div>
                             </section>

                            <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-px flex-1 bg-white/5"></div>
                                    <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.5em] px-4 whitespace-nowrap">Formula Blueprint Library</h2>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    {recipes.map(recipe => (
                                        <RecipeCard 
                                            key={recipe._id} 
                                            recipe={recipe} 
                                            onCook={createBatch} 
                                            onEdit={startEdit} 
                                            onDelete={deleteRecipe}
                                            products={products} 
                                        />
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'recipes' && (
                        <motion.div
                            key="recipes"
                            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -40, filter: 'blur(20px)' }}
                            className="max-w-4xl mx-auto bg-black/40 border border-white/5 p-12 rounded-[40px] backdrop-blur-3xl shadow-2xl relative"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-5 select-none text-[120px] font-serif -mr-10 -mt-10 font-black">DESIGN</div>
                            <div className="flex justify-between items-end mb-12 relative z-10">
                                <div>
                                    <h2 className="text-3xl font-serif font-black text-gold-500 italic tracking-tight">{editingRecipeId ? 'Recalibrate Formula' : 'Conceptualize Asset'}</h2>
                                    <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em] mt-2">Operational Manifest Designer</p>
                                </div>
                                {editingRecipeId && <button onClick={resetRecipeForm} className="text-[10px] font-black uppercase text-white/40 border border-white/10 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all">Cancel Adjustment</button>}
                            </div>
                            
                            <div className="space-y-10 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1">Blueprint Designation</label>
                                    <input value={newRecipe.name} onChange={e=>setNewRecipe({...newRecipe, name:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg font-bold text-white focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 outline-none transition-all placeholder:text-white/5" placeholder="Wonka's Midnight Marzipan..." />
                                </div>
                                
                                {/* Material Additions */}
                                <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/5 space-y-8">
                                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] text-center border-b border-white/5 pb-4">Material Calibration (PER BATCH)</h3>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <select value={tempIng.id} onChange={e=>setTempIng({...tempIng, id:e.target.value})} className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold appearance-none">
                                            <option value="">Identify Material...</option>
                                            {ingredients.map(i => <option key={i._id} value={i._id} className="bg-[#0a0604]">{i.name} ({i.unit})</option>)}
                                        </select>
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={tempIng.qty} onChange={e=>setTempIng({...tempIng, qty:e.target.value})} placeholder="0.0" className="w-24 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-mono font-black" />
                                            <span className="text-[10px] font-black text-white/20 w-8 uppercase">{ingredients.find(i=>i._id === tempIng.id)?.unit || ''}</span>
                                        </div>
                                        <button onClick={addIngredientToRecipe} className="bg-gold-500 hover:bg-white text-black px-8 rounded-2xl font-black text-sm h-14 transition-all active:scale-95 shadow-xl shadow-gold-500/20">+</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {newRecipe.ingredients.map((item, idx) => {
                                            const ingredientObj = ingredients.find(i=>i._id === item.ingredient);
                                            return (
                                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx} className="flex justify-between items-center text-xs bg-white/5 p-4 rounded-xl border border-white/5 group">
                                                    <div className="flex flex-col">
                                                        <span className="font-serif italic font-black text-white/80">{ingredientObj?.name}</span>
                                                        <span className="text-[9px] font-mono text-gold-500/60 font-black">{item.quantity} {ingredientObj?.unit}</span>
                                                    </div>
                                                    <button onClick={()=>removeIngredientFromRecipe(item.ingredient)} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">✕</button>
                                                </motion.div>
                                            )
                                        })}
                                        {newRecipe.ingredients.length === 0 && <p className="text-center text-[10px] font-black text-white/10 uppercase tracking-widest py-4 border-2 border-dashed border-white/[0.02] rounded-2xl col-span-2">No Requirements Defined</p>}
                                    </div>
                                </div>

                                {/* Asset Linking */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1">Product Manifest Link (EXPERIMENTAL)</label>
                                    <select value={newRecipe.productLink} onChange={e=>setNewRecipe({...newRecipe, productLink:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none appearance-none cursor-pointer hover:bg-white/10 transition-colors">
                                        <option value="" className="bg-[#0a0604]">Conceptual Stage (No Asset)</option>
                                        {products.map(p => <option key={p._id} value={p._id} className="bg-[#0a0604]">{p.name}</option>)}
                                    </select>
                                </div>

                                <button onClick={saveRecipe} className={`w-full py-6 rounded-3xl font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-95 shadow-2xl ${editingRecipeId ? 'bg-blue-600 shadow-blue-500/20' : 'bg-gold-500 text-black shadow-gold-500/20'}`}>
                                    {editingRecipeId ? 'Recalibrate Formula' : 'Authorize Production Design'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'factory-map' && (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                            className="h-full flex flex-col"
                        >
                            <h2 className="text-3xl font-serif text-gold-500 mb-6 flex items-center gap-3">
                                <span>🏭</span> Live Factory Floor
                                <span className="text-sm bg-green-500 text-black px-2 py-1 rounded font-sans font-bold animate-pulse">LIVE</span>
                            </h2>
                            <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden h-[600px]">
                                {/* Background Grid */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                                
                                {/* Factory Layout */}
                                <div className="relative z-10 grid grid-cols-3 grid-rows-2 h-full gap-8">
                                    {/* Define Zones */}
                                    {[
                                        { id: 'Roasting', label: 'Roasting Zone', icon: '🔥', col: 'col-start-1', row: 'row-start-1' },
                                        { id: 'Refining', label: 'Grinding & Refining', icon: '⚙️', col: 'col-start-2', row: 'row-start-1' },
                                        { id: 'Mixing', label: 'Mixing Tank', icon: '🥣', col: 'col-start-3', row: 'row-start-1' },
                                        { id: 'Molding', label: 'Molding Line', icon: '🍫', col: 'col-start-3', row: 'row-start-2' },
                                        { id: 'Cooling', label: 'Cooling Tunnel', icon: '❄️', col: 'col-start-2', row: 'row-start-2' },
                                        { id: 'Completed', label: 'Packing & QC', icon: '📦', col: 'col-start-1', row: 'row-start-2' },
                                    ].map(zone => {
                                        // Find batches in this zone
                                        const activeBatches = batches.filter(b => {
                                            if (zone.id === 'Completed') return b.status === 'Completed' || b.status === 'QC_Pending'; 
                                            // Find if this is the active stage
                                            const stage = b.stages.find(s => s.status === 'In_Progress');
                                            return stage && stage.name === zone.id;
                                        });

                                        return (
                                            <div key={zone.id} className={`${zone.col} ${zone.row} border-2 border-dashed rounded-xl p-4 relative group transition-all duration-700 bg-black/20 ${activeBatches.length > 0 ? 'border-gold-500/50 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'border-white/10'}`}>
                                                <div className="absolute top-0 left-0 bg-white/5 px-3 py-1 rounded-br-lg text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-gold-500 transition-colors">
                                                    {zone.icon} {zone.label}
                                                </div>
                                                
                                                {/* Machinery Visualization */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
                                                    <div className={`text-6xl grayscale group-hover:grayscale-0 transition-all duration-[2000ms] ${activeBatches.length > 0 ? 'animate-spin-slow grayscale-0' : ''}`}>{zone.icon}</div>
                                                    {activeBatches.length > 0 && (
                                                        <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 to-transparent animate-pulse"></div>
                                                    )}
                                                </div>

                                                {/* Batch Markers */}
                                                <div className="mt-8 grid grid-cols-2 gap-2 h-full overflow-y-auto content-start relative z-10">
                                                    {activeBatches.map(batch => (
                                                        <motion.div 
                                                            layoutId={batch._id}
                                                            key={batch._id}
                                                            className="bg-gold-500 text-black p-2 rounded text-[10px] font-black shadow-lg shadow-gold-500/20 cursor-pointer hover:scale-105 hover:bg-white transition-all flex flex-col items-center text-center ring-4 ring-gold-500/10"
                                                            onClick={()=>alert(`Batch #${batch.batchNumber}\nRecipe: ${batch.recipe.name}\nQuantity: ${batch.quantity}\nStatus: ${batch.status}`)}
                                                            whileHover={{ scale: 1.1, rotate: -2 }}
                                                        >
                                                            <span className="text-[7px] opacity-70 block leading-none">ID-{batch.batchNumber}</span>
                                                            <span className="line-clamp-1 uppercase leading-tight font-black">{batch.recipe?.name}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                {/* Scanline for active zones */}
                                                {activeBatches.length > 0 && (
                                                    <div className="absolute inset-x-0 h-[1px] bg-gold-500/30 top-0 animate-scan"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'pantry' && (
                        <motion.div
                            key="pantry"
                            initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
                            className="space-y-12"
                        >
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <h1 className="text-4xl font-serif font-black text-white italic tracking-tighter">Material Silos</h1>
                                    <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em]">Raw Resource Monitoring & Deduction</p>
                                </div>
                                <div className="bg-black/40 border border-white/5 px-8 py-4 rounded-[32px] ring-1 ring-white/10 flex flex-col items-center">
                                    <span className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-1">Networked Silos</span>
                                    <span className="text-2xl font-mono text-gold-500 font-black leading-none">{ingredients.length}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
                                {ingredients.map(ing => (
                                    <PantryCard key={ing._id} ingredient={ing} refresh={fetchData} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    </div>
  );
}

// --- Batch Card Component ---
const BatchCard = ({ batch, onUpdateStage, onQC }) => {
    const stages = ['Roasting', 'Refining', 'Mixing', 'Molding', 'Cooling'];
    const activeStageIndex = batch.stages.findIndex(s => s.status === 'In_Progress');
    
    const handleNext = () => {
        const activeStage = batch.stages.find(s => s.status === 'In_Progress');
        if (activeStage) {
            onUpdateStage(batch._id, activeStage.name, 'Completed');
            const nextIdx = stages.indexOf(activeStage.name) + 1;
            if(nextIdx < stages.length) {
                onUpdateStage(batch._id, stages[nextIdx], 'In_Progress');
            } else {
                onQC(batch._id);
            }
        } else {
            onUpdateStage(batch._id, 'Roasting', 'In_Progress');
        }
    };

    return (
        <motion.div 
            layout
            className="group bg-black/40 border border-white/5 p-10 rounded-[40px] flex flex-col gap-10 relative overflow-hidden ring-1 ring-white/10 shadow-2xl backdrop-blur-3xl"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-gold-500 tracking-[0.3em] uppercase opacity-70">Manifest #{batch.batchNumber}</span>
                    <h3 className="text-2xl font-serif font-black text-white italic tracking-tighter leading-none">{batch.recipe?.name}</h3>
                    <div className="flex items-center gap-3 mt-4">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{batch.quantity} Production Units</span>
                        <div className="w-1 h-1 rounded-full bg-white/10"></div>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{new Date(batch.createdAt).toLocaleTimeString()} Entry</span>
                    </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${
                    batch.status === 'Initiated' ? 'border-white/10 text-white/30 bg-white/5' : 'border-gold-500/50 text-gold-500 bg-gold-500/10 animate-pulse'
                }`}>
                    {batch.status === 'Initiated' ? 'Awaiting Launch' : `Active: ${batch.status}`}
                </div>
            </div>

            {/* Tactical Process Stepper */}
            <div className="flex justify-between items-center relative py-6">
                <div className="absolute top-[50%] left-0 w-full h-[1px] bg-white/5 -translate-y-1/2"></div>
                {stages.map((stage, idx) => {
                    const stageInfo = batch.stages.find(s => s.name === stage);
                    const isCompleted = stageInfo?.status === 'Completed';
                    const isInProgress = stageInfo?.status === 'In_Progress';
                    
                    return (
                        <div key={idx} className="relative z-10 flex flex-col items-center gap-4">
                             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-700
                                ${isCompleted ? 'bg-green-500 shadow-lg shadow-green-500/20 text-black rotate-12 scale-110' : 
                                  isInProgress ? 'bg-gold-500 shadow-xl shadow-gold-500/30 text-black scale-125' : 
                                  'bg-black/50 border border-white/5 text-white/20'}
                             `}>
                                 {isCompleted ? '✓' : idx + 1}
                             </div>
                             <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isInProgress ? 'text-gold-500' : 'text-white/20'}`}>{stage}</span>
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-white/5 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Efficiency Matrix</span>
                    <span className="text-xs font-bold text-green-400/80">Operational 98.4%</span>
                </div>
                <button 
                    onClick={handleNext}
                    className="group flex items-center gap-4 bg-white text-black font-black text-[10px] px-8 py-4 rounded-2xl shadow-xl hover:bg-gold-500 transition-all active:scale-95 uppercase tracking-widest"
                >
                    {batch.status === 'Cooling' && batch.stages.find(s=>s.name==='Cooling')?.status === 'In_Progress' 
                        ? 'Finalize & Authorize QC 🛡️' 
                        : 'Calibrate Next Stage ➡️'}
                </button>
            </div>
        </motion.div>
    )
}

const RecipeCard = ({ recipe, onCook, onEdit, onDelete }) => {
    const [batchQty, setBatchQty] = useState(1);
    const canCook = recipe.ingredients.every(item => item.ingredient && item.ingredient.quantity >= (item.quantity * batchQty));

    return (
        <motion.div 
            whileHover={{ y: -8 }}
            className={`group bg-black/40 border p-10 rounded-[40px] flex flex-col h-full transition-all duration-700 relative overflow-hidden ring-1 shadow-2xl ${
                !canCook ? 'border-red-500/20 ring-red-500/10' : 'border-white/5 ring-white/5 hover:border-gold-500/30'
            }`}
        >
            <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-serif font-black text-white italic tracking-tighter leading-none">{recipe.name}</h3>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Designation: RF-{(recipe._id || '0000').slice(-4).toUpperCase()}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={()=>onEdit(recipe)} className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-gold-500 hover:bg-gold-500/10 transition-all opacity-0 group-hover:opacity-100">⚙️</button>
                        <button onClick={()=>onDelete(recipe._id)} className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">✕</button>
                    </div>
                </div>

                <div className="flex-1 space-y-4 mb-10">
                    <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Material Health Index</span>
                        {!canCook && <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1"><span className="animate-ping w-1 h-1 rounded-full bg-red-500"></span> Stock Exhausted</span>}
                    </div>
                    <div className="space-y-3">
                        {recipe.ingredients.map((ing, i) => {
                            const available = ing.ingredient?.quantity || 0;
                            const needed = ing.quantity * batchQty;
                            const percentage = Math.min((available / needed) * 100, 100);
                            return (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-white/60 font-serif italic">{ing.ingredient?.name || 'Unknown Log'}</span>
                                        <span className={`font-mono ${available >= needed ? 'text-gold-500' : 'text-red-500'}`}>{needed} {ing.ingredient?.unit}</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className={`h-full ${available >= needed ? 'bg-gold-500' : 'bg-red-500'} opacity-40`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[32px] space-y-4">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">Yield</span>
                            <input 
                                type="number" 
                                min="1" 
                                value={batchQty} 
                                onChange={e=>setBatchQty(Number(e.target.value))} 
                                className="w-12 bg-transparent border-b border-white/20 text-center text-xs font-black text-white focus:border-gold-500 outline-none" 
                            />
                         </div>
                         <button 
                            onClick={() => onCook(recipe, batchQty)}
                            disabled={!canCook}
                            className={`bg-white text-black font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-2xl transition-all active:scale-95 ${!canCook ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:bg-gold-500 shadow-xl shadow-white/5'}`}
                         >
                            Launch Production
                         </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

const PantryCard = ({ ingredient, refresh }) => {
    const [useQty, setUseQty] = useState('');
    const isCritical = ingredient.quantity < (ingredient.minLevel || 10);
    
    const handleUse = async () => {
        if(!useQty || useQty <= 0) return;
        const res = await fetch(`http://localhost:5000/api/ingredients/${ingredient._id}/use`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ quantity: Number(useQty) })
        });
        if(res.ok) {
            alert(`Used ${useQty} ${ingredient.unit} of ${ingredient.name}`);
            setUseQty('');
            refresh();
        }
    };

    return (
        <motion.div 
            whileHover={{ y: -8 }}
            className={`group bg-black/40 border p-10 rounded-[40px] flex flex-col h-full ring-1 shadow-2xl transition-all duration-700 relative overflow-hidden ${
                isCritical ? 'border-red-500/30 ring-red-500/10' : 'border-white/5 ring-white/5 hover:border-gold-500/30'
            }`}
        >
            <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-20 transition-colors duration-1000 ${isCritical ? 'bg-red-500' : 'bg-gold-500/5 group-hover:bg-gold-500'}`}></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-serif font-black text-white italic tracking-tighter leading-none">{ingredient.name}</h3>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Silo: S-{(ingredient._id || '0000').slice(-4).toUpperCase()}</span>
                    </div>
                </div>

                <div className="flex-1 space-y-2 mb-10">
                     <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Live Capacity</span>
                     <div className="flex items-baseline gap-2">
                         <span className={`text-5xl font-mono font-black tracking-tighter ${isCritical ? 'text-red-500 animate-pulse' : 'text-white'}`}>{ingredient.quantity}</span>
                         <span className="text-[10px] font-black text-white/20 uppercase">{ingredient.unit}</span>
                     </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[32px] space-y-4">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] block text-center">Tactical Deduction</span>
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            step="0.01"
                            value={useQty} 
                            onChange={e=>setUseQty(e.target.value)} 
                            placeholder="Qty"
                            className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs font-black text-white focus:border-gold-500 outline-none" 
                        />
                        <button 
                            onClick={handleUse}
                            className="bg-white text-black font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
                        >
                            USE
                        </button>
                    </div>
                </div>
                
                {isCritical && (
                    <div className="mt-6 text-[9px] font-black text-red-500 uppercase tracking-widest p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-center flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                        Resupply Mandatory
                    </div>
                )}
            </div>
        </motion.div>
    );
};
