import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChefDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('kitchen'); // kitchen, recipes
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  
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
      
      if(resRecipes.ok) setRecipes(await resRecipes.json());
      if(resIng.ok) setIngredients(await resIng.json());
      if(resProd.ok) setProducts(await resProd.json());
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
  const cookBatch = async (recipe, batches) => {
      if(batches <= 0) return;
      const res = await fetch('http://localhost:5000/api/cook', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ recipeId: recipe._id, batches: Number(batches) })
      });
      
      const data = await res.json();
      if(res.ok) {
          alert(`Success! Produced ${batches} batches of ${recipe.name}. Stock updated.`);
          fetchData(); // Refresh stock
      } else {
          alert('Error: ' + data.msg);
      }
  };

  return (
    <div className="min-h-screen bg-chocolate-900 text-white font-sans flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
            <h1 className="text-2xl font-serif text-white mb-8">👨‍🍳 CHEF'S <span className="text-gold-500">KITCHEN</span></h1>
            <nav className="space-y-2 flex-1">
                <button onClick={()=>{setActiveTab('kitchen'); resetRecipeForm();}} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab==='kitchen' ? 'bg-gold-500 text-black font-bold' : 'hover:bg-white/5'}`}>
                    <span>🍳</span> Production
                </button>
                <button onClick={()=>setActiveTab('recipes')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab==='recipes' ? 'bg-gold-500 text-black font-bold' : 'hover:bg-white/5'}`}>
                    <span>📝</span> {editingRecipeId ? 'Edit Recipe' : 'New Recipe'}
                </button>
            </nav>
            <button onClick={handleLogout} className="mt-8 text-red-400 hover:text-white text-sm">Sign Out</button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <AnimatePresence mode="wait">
                {activeTab === 'kitchen' ? (
                    <motion.div 
                        key="kitchen"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-serif text-gold-500 mb-6">Production Line</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recipes.map(recipe => (
                                <RecipeCard 
                                    key={recipe._id} 
                                    recipe={recipe} 
                                    onCook={cookBatch} 
                                    onEdit={startEdit} 
                                    onDelete={deleteRecipe}
                                    products={products} 
                                />
                            ))}
                             {recipes.length === 0 && <p className="text-white/50">No recipes found. Go to "New Recipe" to create one.</p>}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="recipes"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl mx-auto bg-black/40 border border-white/10 p-8 rounded-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif text-gold-500">{editingRecipeId ? 'Modify Recipe' : 'Create New Recipe'}</h2>
                            {editingRecipeId && <button onClick={resetRecipeForm} className="text-xs text-white/50 hover:text-white underline">Cancel Edit</button>}
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-chocolate-200 mb-1">Recipe Name</label>
                                <input value={newRecipe.name} onChange={e=>setNewRecipe({...newRecipe, name:e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-2 text-white" placeholder="Wonka's Whipple-Scrumptious Fudgemallow Delight" />
                            </div>
                            
                            {/* Ingredient Adder */}
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <h3 className="text-sm font-bold text-gold-500 mb-4">Required Ingredients (per batch)</h3>
                                <div className="flex gap-2 mb-4">
                                    <select value={tempIng.id} onChange={e=>setTempIng({...tempIng, id:e.target.value})} className="flex-1 bg-black border border-white/10 rounded p-2 text-sm">
                                        <option value="">Select Ingredient</option>
                                        {ingredients.map(i => <option key={i._id} value={i._id}>{i.name} ({i.unit})</option>)}
                                    </select>
                                    <div className="flex items-center gap-1">
                                        <input type="number" value={tempIng.qty} onChange={e=>setTempIng({...tempIng, qty:e.target.value})} placeholder="Qty" className="w-20 bg-black border border-white/10 rounded p-2 text-sm" />
                                        <span className="text-xs text-white/50 w-8">{ingredients.find(i=>i._id === tempIng.id)?.unit || ''}</span>
                                    </div>
                                    <button onClick={addIngredientToRecipe} className="bg-gold-500 text-black px-4 rounded font-bold">+</button>
                                </div>
                                <div className="space-y-2">
                                    {newRecipe.ingredients.map((item, idx) => {
                                        const ingredientObj = ingredients.find(i=>i._id === item.ingredient);
                                        const ingName = ingredientObj?.name;
                                        const ingUnit = ingredientObj?.unit;
                                        return (
                                            <div key={idx} className="flex justify-between items-center text-sm bg-black/40 p-2 rounded">
                                                <span>{ingName}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-mono text-gold-500">{item.quantity} {ingUnit}</span>
                                                    <button onClick={()=>removeIngredientFromRecipe(item.ingredient)} className="text-red-500 hover:text-red-400">✕</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {newRecipe.ingredients.length === 0 && <p className="text-center text-xs text-white/20 italic">No ingredients added yet</p>}
                                </div>
                            </div>

                            {/* Link to Product */}
                            <div>
                                <label className="block text-sm text-chocolate-200 mb-1">Link to Store Product (Optional)</label>
                                <p className="text-xs text-white/40 mb-2">If linked, cooking this recipe will automatically increase the product stock.</p>
                                <select value={newRecipe.productLink} onChange={e=>setNewRecipe({...newRecipe, productLink:e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-2 text-white">
                                    <option value="">No Link (Experimental Recipe)</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>

                            <button onClick={saveRecipe} className={`w-full py-4 ${editingRecipeId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'} text-white font-bold rounded-lg mt-6 shadow-lg shadow-black/50 transition-all`}>
                                {editingRecipeId ? 'Update Recipe' : 'Save Recipe to Book'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    </div>
  );
}

const RecipeCard = ({ recipe, onCook, onEdit, onDelete, ingredients }) => {
    const [batchQty, setBatchQty] = useState(1);

    // Calculate if we can cook this many batches
    const canCook = recipe.ingredients.every(item => {
        const ing = item.ingredient; // This is the populated ingredient object
        if (!ing) return false;
        return ing.quantity >= (item.quantity * batchQty);
    });

    return (
        <div className={`bg-black/30 border ${canCook ? 'border-white/10' : 'border-red-500/30'} p-6 rounded-2xl flex flex-col h-full hover:border-gold-500/30 transition-colors group`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{recipe.name}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>onEdit(recipe)} className="text-blue-400 hover:text-blue-300 text-xs bg-blue-400/10 px-2 py-1 rounded">Edit</button>
                    <button onClick={()=>onDelete(recipe._id)} className="text-red-400 hover:text-red-300 text-xs bg-red-400/10 px-2 py-1 rounded">Del</button>
                </div>
            </div>
            {recipe.productLink && <span className="text-xs bg-gold-500/20 text-gold-500 px-2 py-1 rounded w-fit mb-4 border border-gold-500/30">Linked: {recipe.productLink.name}</span>}
            
            <div className="flex-1 space-y-2 mb-6">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs uppercase text-white/40 font-bold tracking-wider">Requirements:</h4>
                    {recipe.ingredients.length === 0 ? (
                        <span className="text-[10px] text-red-500 font-bold animate-bounce">⚠️ No Ingredients Added!</span>
                    ) : (
                        !canCook && <span className="text-[10px] text-red-500 font-bold animate-pulse">Insufficient Ingredients</span>
                    )}
                </div>
                <ul className="text-sm text-chocolate-100 space-y-2">
                    {recipe.ingredients.map((ing, i) => {
                        const hasEnough = ing.ingredient && ing.ingredient.quantity >= (ing.quantity * batchQty);
                        return (
                            <li key={i} className={`flex justify-between border-b border-white/5 pb-1 ${!hasEnough ? 'text-red-400' : ''}`}>
                                <span className="text-white/80">{ing.ingredient ? ing.ingredient.name : 'Unknown'}</span>
                                <span className="font-mono text-gold-500 font-bold">
                                    {ing.quantity * batchQty} <span className="text-white/40 text-[10px]">{ing.ingredient?.unit}</span>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col gap-2 ${canCook && recipe.ingredients.length > 0 ? 'bg-white/5 border-white/5' : 'bg-red-500/5 border-red-500/10'}`}>
                <label className="text-xs uppercase text-center block text-white/50 tracking-widest font-bold">Production Quantity</label>
                <div className="flex gap-2">
                    <input 
                        type="number" 
                        min="1" 
                        value={batchQty} 
                        onChange={e=>setBatchQty(Number(e.target.value))} 
                        className="w-16 bg-black/50 border border-white/10 rounded text-center text-white focus:border-gold-500 outline-none" 
                    />
                    <button 
                        onClick={() => onCook(recipe, batchQty)}
                        disabled={!canCook || recipe.ingredients.length === 0}
                        className={`flex-1 font-bold text-xs py-2 rounded transition-all transform active:scale-95 shadow-md ${canCook && recipe.ingredients.length > 0 ? 'bg-gold-500 text-black hover:bg-white shadow-gold-500/20' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}
                    >
                        {recipe.ingredients.length === 0 ? 'NO RECIPE' : (canCook ? 'START PRODUCTION' : 'STOCK NEEDED')}
                    </button>
                </div>
            </div>
        </div>
    )
}
