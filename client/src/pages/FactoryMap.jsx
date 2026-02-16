import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const ZONES = [
    { id: 'Roasting', label: 'Roasting Room', icon: '🔥', description: 'Raw cocoa beans are roasted to unlock deep aromas.', x: 10, y: 10, color: '#FF4500' },
    { id: 'Refining', label: 'Grinding Mills', icon: '⚙️', description: 'Roasted nibs are ground into smooth chocolate liquor.', x: 40, y: 10, color: '#A0522D' },
    { id: 'Mixing', label: 'Mixing Vats', icon: '🥣', description: 'Sugar, milk, and magic are blended into the base.', x: 70, y: 10, color: '#DEB887' },
    { id: 'Molding', label: 'Molding Line', icon: '🍫', description: 'Liquid chocolate is poured into signature bar shapes.', x: 70, y: 60, color: '#8B4513' },
    { id: 'Cooling', label: 'Cooling Tunnel', icon: '❄️', description: 'Bars are chilled perfectly for that signature snap.', x: 40, y: 60, color: '#00CED1' },
    { id: 'Completed', label: 'Packing & QC', icon: '📦', description: 'Final inspection and wrapping in golden foil.', x: 10, y: 60, color: '#32CD32' },
];

const LOOMPA_MESSAGES = {
    Roasting: ["Checking bean temperature...", "Stirring the fire...", "Adjusting the roast level...", "Singing a roasting song..."],
    Refining: ["Calibrating the mills...", "Scanning for silkiness...", "Lubricating the gears...", "Removing tiny lumps..."],
    Mixing: ["Adding secret magic...", "Churning the chocolate...", "Testing the sweetness...", "Whisking up bubbles..."],
    Molding: ["Perfecting the bar shape...", "Cleaning the molds...", "Inspecting for cracks...", "Leveling the surface..."],
    Cooling: ["Monitoring the snap...", "Adjusting fan speed...", "Checking the chill factor...", "Guarding the tunnel..."],
    Completed: ["Wrapping in gold foil...", "Quality check passed!", "Ready for delivery!", "Counting the batches..."]
};

export default function FactoryMap() {
    const [batches, setBatches] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [highlightedBatch, setHighlightedBatch] = useState(null);
    const [loompaStatuses, setLoompaStatuses] = useState({
        Roasting: "Ready", Refining: "Ready", Mixing: "Ready", Molding: "Ready", Cooling: "Ready", Completed: "Ready"
    });

    useEffect(() => {
        fetchBatches();
        const batchInterval = setInterval(fetchBatches, 5000);
        
        const loompaInterval = setInterval(() => {
            const newStatuses = {};
            ZONES.forEach(z => {
                const messages = LOOMPA_MESSAGES[z.id];
                newStatuses[z.id] = messages[Math.floor(Math.random() * messages.length)];
            });
            setLoompaStatuses(newStatuses);
        }, 8000);

        return () => {
            clearInterval(batchInterval);
            clearInterval(loompaInterval);
        };
    }, []);

    const fetchBatches = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/batches');
            if (res.ok) {
                const data = await res.json();
                setBatches(data);
            }
        } catch (err) { console.error(err); }
    };

    const handleSearch = () => {
        const found = batches.find(b => b.batchNumber.includes(searchId) || b._id.includes(searchId));
        if (found) {
            setHighlightedBatch(found._id);
            setTimeout(() => setHighlightedBatch(null), 3000);
        } else {
            alert("Batch not found in active production.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-serif overflow-hidden flex flex-col">
            <Navbar />
            
            <main className="flex-1 mt-20 p-8 relative flex flex-col items-center">
                {/* Header Section */}
                <header className="z-20 text-center mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl text-gold-500 mb-2 drop-shadow-[0_0_15px_rgba(218,165,32,0.5)]"
                    >
                        LIVE FACTORY FLOOR
                    </motion.h1>
                    <p className="text-white/40 text-xs tracking-[0.5em] uppercase">Real-Time Production Monitoring</p>
                    
                    {/* Search Bar */}
                    <div className="mt-8 flex gap-2 justify-center">
                        <input 
                            type="text" 
                            placeholder="Enter Batch/Order ID..." 
                            className="bg-white/5 border border-white/10 px-4 py-2 rounded-l-full outline-none focus:border-gold-500 transition-colors font-sans text-sm w-64"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <button 
                            onClick={handleSearch}
                            className="bg-gold-500 text-black px-6 py-2 rounded-r-full font-bold text-xs uppercase hover:bg-white transition-colors"
                        >
                            Track
                        </button>
                    </div>
                </header>

                {/* The Map Canvas */}
                <div className="relative w-full max-w-6xl aspect-[16/9] bg-neutral-900/50 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    {/* Background Grid & Decorative Elements */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(218,165,32,0.2),transparent_70%)]"></div>

                    {/* Zone Cards */}
                    {ZONES.map(zone => {
                         const activeInZone = batches.filter(b => {
                             if (zone.id === 'Completed') return b.status === 'Completed' || b.status === 'QC_Pending';
                             const activeStage = b.stages.find(s => s.status === 'In_Progress');
                             return activeStage && activeStage.name === zone.id;
                         });

                         return (
                             <motion.div
                                key={zone.id}
                                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                                className={`absolute w-[25%] h-[35%] rounded-2xl border-2 border-dashed transition-all duration-500 p-4 cursor-help
                                    ${selectedZone === zone.id ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 bg-black/40 hover:border-white/30'}
                                `}
                                onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                             >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{zone.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-sm text-white/80 group-hover:text-gold-500 transition-colors">{zone.label}</h3>
                                        <p className="text-[10px] text-gold-500 font-mono italic">{activeInZone.length} Active</p>
                                    </div>
                                </div>

                                {/* Batch Markers inside Zone */}
                                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[60%] pr-2 scrollbar-hide">
                                    {activeInZone.map(batch => (
                                        <motion.div
                                            key={batch._id}
                                            layoutId={batch._id}
                                            initial={{ scale: 0.8 }}
                                            animate={{ 
                                                scale: highlightedBatch === batch._id ? 1.2 : 1,
                                                backgroundColor: highlightedBatch === batch._id ? '#DAA520' : '#333'
                                            }}
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold border border-white/10 shadow-lg relative"
                                            title={`Batch: ${batch.batchNumber}`}
                                        >
                                            {batch.recipe?.name?.charAt(0) || 'C'}
                                            {highlightedBatch === batch._id && (
                                                <motion.div 
                                                    layoutId="highlight"
                                                    className="absolute -inset-1 border-2 border-gold-500 rounded-lg animate-ping"
                                                />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {activeInZone.length > 0 && (
                                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 rounded p-1.5 border border-white/5 flex items-center gap-2 overflow-hidden">
                                         <div className="w-5 h-5 flex-shrink-0 bg-blue-500/20 rounded-full flex items-center justify-center text-[10px]">👷</div>
                                         <motion.p 
                                             key={loompaStatuses[zone.id]}
                                             initial={{ x: 20, opacity: 0 }}
                                             animate={{ x: 0, opacity: 1 }}
                                             className="text-[9px] text-blue-400 font-mono italic truncate"
                                         >
                                             {loompaStatuses[zone.id]}
                                         </motion.p>
                                    </div>
                                )}

                                {/* Flow Arrows */}
                                {zone.id === 'Roasting' && <div className="absolute right-0 top-1/2 translate-x-full text-white/5 animate-pulse text-4xl mt-[-20px] ml-4">➜</div>}
                                {zone.id === 'Refining' && <div className="absolute right-0 top-1/2 translate-x-full text-white/5 animate-pulse text-4xl mt-[-20px] ml-4">➜</div>}
                                {zone.id === 'Mixing' && <div className="absolute bottom-0 left-1/2 translate-y-full text-white/5 animate-pulse text-4xl ml-[-20px] mt-4 rotate-90">➜</div>}
                                {zone.id === 'Molding' && <div className="absolute left-0 top-1/2 -translate-x-full text-white/5 animate-pulse text-4xl mt-[-20px] mr-4 rotate-180">➜</div>}
                                {zone.id === 'Cooling' && <div className="absolute left-0 top-1/2 -translate-x-full text-white/5 animate-pulse text-4xl mt-[-20px] mr-4 rotate-180">➜</div>}
                             </motion.div>
                         );
                    })}

                    {/* Machine Aesthetics (Decorative Lines) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-5">
                        <path d="M 25 25 L 40 25 M 65 25 L 70 25 M 82.5 45 L 82.5 60 M 70 77.5 L 65 77.5 M 40 77.5 L 25 77.5" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>
                </div>

                {/* Selection Information Section */}
                <AnimatePresence>
                    {selectedZone ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed bottom-12 bg-neutral-900 border border-gold-500/30 p-8 rounded-3xl max-w-2xl w-full shadow-2xl backdrop-blur-xl z-50 flex gap-8 items-center"
                        >
                            <div className="text-6xl">{ZONES.find(z => z.id === selectedZone).icon}</div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gold-500 mb-2">{ZONES.find(z => z.id === selectedZone).label}</h2>
                                <p className="text-white/60 text-sm italic font-sans">{ZONES.find(z => z.id === selectedZone).description}</p>
                                <div className="mt-4 flex gap-4 text-xs font-mono">
                                    <div className="bg-white/5 px-3 py-1 rounded border border-white/10">Temp: 45°C</div>
                                    <div className="bg-white/5 px-3 py-1 rounded border border-white/10">Humidity: 12%</div>
                                    <div className="bg-white/5 px-3 py-1 rounded border border-white/10">Active Shifts: 2</div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedZone(null)} className="text-white/40 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-12 text-white/30 text-sm font-sans"
                        >
                            Click on a zone to learn about the process and view active machinery data.
                        </motion.p>
                    )}
                </AnimatePresence>
            </main>

            {/* Live Indicator Overlay */}
            <div className="fixed bottom-8 right-8 flex items-center gap-3 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest font-sans">System Online</span>
            </div>
        </div>
    );
}
