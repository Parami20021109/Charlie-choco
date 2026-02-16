import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BASES = [
    { id: 'milk', name: 'Milk Chocolate', color: '#7B3F00', price: 10 },
    { id: 'dark', name: 'Dark Chocolate', color: '#3D1C02', price: 12 },
    { id: 'white', name: 'White Chocolate', color: '#FDF5E6', price: 10 },
    { id: 'ruby', name: 'Ruby Chocolate', color: '#E0115F', price: 15 }
];

const TOPPINGS = [
    { id: 'nuts', name: 'Roasted Almonds', icon: '🥜', price: 2 },
    { id: 'salt', name: 'Sea Salt', icon: '🧂', price: 1 },
    { id: 'gold', name: 'Golden Flakes', icon: '✨', price: 5 },
    { id: 'marshmallow', name: 'Marshmallows', icon: '☁️', price: 2 },
    { id: 'caramel', name: 'Salted Caramel', icon: '🍯', price: 3 }
];

const WRAPPERS = [
    { id: 'gold', name: 'Golden Ticket', color: '#D4AF37' },
    { id: 'purple', name: 'Wonka Purple', color: '#4B0082' },
    { id: 'red', name: 'Candy Red', color: '#FF0000' }
];

export default function InventingRoom() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [selection, setSelection] = useState({
        base: BASES[0],
        toppings: [],
        wrapper: WRAPPERS[0],
        label: 'My Special Bar'
    });
    const [isSaving, setIsSaving] = useState(false);

    const toggleTopping = (topping) => {
        setSelection(prev => {
            const exists = prev.toppings.find(t => t.id === topping.id);
            if (exists) {
                return { ...prev, toppings: prev.toppings.filter(t => t.id !== topping.id) };
            }
            if (prev.toppings.length >= 3) {
                alert("Maximum 3 toppings per bar!");
                return prev;
            }
            return { ...prev, toppings: [...prev.toppings, topping] };
        });
    };

    const totalPrice = selection.base.price + selection.toppings.reduce((acc, t) => acc + t.price, 0);

    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Please login to save your invention!");
            navigate('/login');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('http://localhost:5000/api/custom-bars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: user.id,
                    base: selection.base.name,
                    toppings: selection.toppings.map(t => t.name),
                    wrapperColor: selection.wrapper.color,
                    labelName: selection.label,
                    price: totalPrice
                })
            });

            if (res.ok) {
                const savedBar = await res.json();
                // Add to cart as a virtual product
                addToCart({
                    _id: `custom-${savedBar._id}`,
                    name: `Custom: ${selection.label}`,
                    price: totalPrice,
                    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553744.png', // Chocolate icon
                    isCustom: true
                });
                alert("The Inventing Room has finished your creation! Added to cart.");
                navigate('/cart');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-serif flex flex-col md:flex-row">
            
            {/* Left: Preview Panel */}
            <div className="flex-1 bg-gradient-to-br from-chocolate-900/50 to-black flex items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
                
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    className="relative w-64 h-96 shadow-2xl preserve-3d"
                >
                    {/* Chocolate Bar Body */}
                    <div 
                        className="absolute inset-0 rounded-lg shadow-inner flex flex-col items-center justify-center border-4 border-black/20"
                        style={{ backgroundColor: selection.base.color }}
                    >
                        {/* Grid Pattern in Chocolate */}
                        <div className="absolute inset-2 grid grid-cols-2 grid-rows-4 gap-1 opacity-40">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="border border-black/30 rounded-sm"></div>
                            ))}
                        </div>

                        {/* Toppings Markers */}
                        <div className="relative z-10 flex flex-wrap gap-2 px-4 justify-center">
                            {selection.toppings.map(t => (
                                <motion.span 
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1.2, opacity: 1 }}
                                    key={t.id} 
                                    className="text-2xl drop-shadow-md"
                                >
                                    {t.icon}
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Wrapper (Partial) */}
                    <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -inset-2 rounded-xl border border-white/20 flex items-center justify-center shadow-2xl opacity-80 pointer-events-none"
                        style={{ backgroundColor: selection.wrapper.color, clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 40%)' }}
                    >
                        <div className="border-2 border-white/30 p-4 transform -rotate-12">
                            <span className="text-black font-bold uppercase tracking-widest text-xl">WONKA</span>
                        </div>
                    </motion.div>

                    {/* Label */}
                    <div className="absolute bottom-10 left-0 right-0 text-center">
                        <span className="bg-white/90 text-black px-3 py-1 text-sm font-bold skew-x-12 shadow-md">
                            {selection.label || 'Untitled Invention'}
                        </span>
                    </div>
                </motion.div>

                {/* Ambient Particles */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                     {[...Array(10)].map((_, i) => (
                         <motion.div 
                            key={i}
                            animate={{ 
                                y: [-20, 1000], 
                                x: [Math.random()*1000, Math.random()*1000],
                                rotate: 360 
                            }}
                            transition={{ repeat: Infinity, duration: 10 + Math.random()*20, ease: 'linear' }}
                            className="absolute text-2xl opacity-20"
                         >
                             ✨
                         </motion.div>
                     ))}
                </div>
            </div>

            {/* Right: Controls Panel */}
            <div className="w-full md:w-[450px] bg-neutral-900 border-l border-white/10 p-8 flex flex-col gap-8 overflow-y-auto">
                <header>
                    <h1 className="text-4xl text-amber-500 mb-2">INVENTING ROOM</h1>
                    <p className="text-white/50 text-sm font-sans italic">Step into the room where chocolate dreams come true. Mix, match, and name your own creation.</p>
                </header>

                {/* Step 1: Base */}
                <section>
                    <h3 className="text-xs uppercase tracking-[.2em] text-white/40 font-bold mb-4 flex items-center gap-2">
                        <span className="bg-amber-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                        Choose Your Base
                    </h3>
                    <div className="grid grid-cols-2 gap-3 font-sans">
                        {BASES.map(b => (
                            <button 
                                key={b.id}
                                onClick={() => setSelection({...selection, base: b})}
                                className={`p-4 rounded-xl border transition-all text-left group
                                    ${selection.base.id === b.id ? 'bg-amber-500 border-amber-500' : 'bg-white/5 border-white/10 hover:border-white/30'}
                                `}
                            >
                                <div className="w-8 h-8 rounded mb-2 shadow-inner border border-black/10" style={{ backgroundColor: b.color }}></div>
                                <p className={`font-bold block text-sm ${selection.base.id === b.id ? 'text-black' : 'text-white'}`}>{b.name}</p>
                                <p className={`text-[10px] ${selection.base.id === b.id ? 'text-black/60' : 'text-white/40'}`}>+ ${b.price}</p>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Step 2: Toppings */}
                <section>
                    <h3 className="text-xs uppercase tracking-[.2em] text-white/40 font-bold mb-4 flex items-center gap-2">
                        <span className="bg-amber-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                        Add Ingredients (Max 3)
                    </h3>
                    <div className="flex flex-wrap gap-2 font-sans">
                        {TOPPINGS.map(t => {
                            const selected = selection.toppings.find(it => it.id === t.id);
                            return (
                                <button 
                                    key={t.id}
                                    onClick={() => toggleTopping(t)}
                                    className={`px-4 py-2 rounded-full border text-sm transition-all flex items-center gap-2
                                        ${selected ? 'bg-amber-500 border-amber-500 text-black font-bold' : 'bg-white/5 border-white/10 text-white/60 hover:border-white'}
                                    `}
                                >
                                    <span>{t.icon}</span> {t.name}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Step 3: Wrapper */}
                <section>
                    <h3 className="text-xs uppercase tracking-[.2em] text-white/40 font-bold mb-4 flex items-center gap-2">
                        <span className="bg-amber-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                        The Wrapper
                    </h3>
                    <div className="flex gap-4">
                        {WRAPPERS.map(w => (
                            <button 
                                key={w.id}
                                onClick={() => setSelection({...selection, wrapper: w})}
                                className={`w-12 h-12 rounded-full border-2 transition-all p-1
                                    ${selection.wrapper.id === w.id ? 'border-amber-500 scale-110 shadow-lg shadow-amber-500/20' : 'border-transparent opacity-60'}
                                `}
                            >
                                <div className="w-full h-full rounded-full" style={{ backgroundColor: w.color }}></div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Step 4: Name */}
                <section>
                    <h3 className="text-xs uppercase tracking-[.2em] text-white/40 font-bold mb-4 flex items-center gap-2">
                        <span className="bg-amber-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px]">4</span>
                        Name Your Invention
                    </h3>
                    <input 
                        value={selection.label}
                        onChange={e => setSelection({...selection, label: e.target.value})}
                        className="w-full bg-white/5 border-b-2 border-white/10 p-2 text-xl outline-none focus:border-amber-500 transition-colors font-serif italic"
                        placeholder="Wonka's Whipple-Scrumptious..."
                    />
                </section>

                <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                        <p className="text-white/40 text-xs uppercase tracking-widest font-bold font-sans">Estimated Cost</p>
                        <p className="text-3xl text-amber-500 font-bold">${totalPrice.toFixed(2)}</p>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        disabled={isSaving}
                        className="w-full py-4 bg-amber-500 hover:bg-white text-black font-bold uppercase tracking-[.3em] rounded transition-all shadow-xl shadow-amber-500/10 disabled:opacity-50"
                    >
                        {isSaving ? 'INVENTING...' : 'FINALIZE INVENTION 🎩'}
                    </button>
                </div>
            </div>
        </div>
    );
}
