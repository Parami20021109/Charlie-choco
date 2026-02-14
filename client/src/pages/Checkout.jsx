import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
    const { cart, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('form'); // form, processing, success
    const [locationType, setLocationType] = useState('manual'); // 'manual' or 'gps'
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsCoords, setGpsCoords] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', address: '', card: '', expiry: '', cvc: ''
    });

    // Auto-fill form if user is logged in
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user) {
            setFormData(prev => ({...prev, name: user.username, email: user.email}));
        }
    }, []);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setGpsCoords({ lat: latitude, lng: longitude });
                
                // Attempt Reverse Geocode for better UX
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    if (data && data.display_name) {
                        setFormData(prev => ({ ...prev, address: data.display_name }));
                    } else {
                        setFormData(prev => ({ ...prev, address: `[GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}]` }));
                    }
                } catch (e) {
                    setFormData(prev => ({ ...prev, address: `[GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}]` }));
                }

                setLocationType('gps');
                setGpsLoading(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert('Unable to retrieve your location. Please enter address manually.');
                setGpsLoading(false);
                setLocationType('manual');
            }
        );
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStep('processing');

        // Simulate Payment Gateway Delay
        setTimeout(async () => {
             // Create Order in Backend
             try {
                const user = JSON.parse(localStorage.getItem('user'));
                const orderData = {
                    userId: user ? user.id : null,
                    customerName: formData.name,
                    email: formData.email,
                    address: formData.address,
                    
                    // Send coordinates if available
                    location: gpsCoords, 
                    
                    items: cart.map(item => ({
                        product: item._id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    totalAmount: total
                };

                const res = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(orderData)
                });

                if(res.ok) {
                    setStep('success');
                    clearCart();
                } else {
                    alert('Order failed!');
                    setStep('form');
                }
             } catch (err) {
                 console.error(err);
                 setStep('form');
             }
             setLoading(false);
        }, 3000);
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-chocolate-900 flex items-center justify-center p-6 text-center">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-black/40 backdrop-blur-xl border border-gold-500/30 p-12 rounded-2xl max-w-lg"
                >
                    <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-3xl font-serif text-gold-500 mb-4">Payment Successful!</h2>
                    <p className="text-white mb-8">Your Golden Ticket has been issued. The Oompa Loompas are packing your order now.</p>
                    <button onClick={() => navigate('/products')} className="px-8 py-3 bg-white text-chocolate-900 font-bold rounded-full hover:bg-gold-500 transition-colors">Continue Shopping</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-chocolate-900 text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
             
             {/* Fake Gateway UI */}
             <div className="w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-2">
                
                {/* Order Summary Side */}
                <div className="p-8 bg-chocolate-800/30 border-r border-white/5 hidden md:block">
                     <h3 className="text-gold-500 font-bold uppercase tracking-widest mb-6">Order Summary</h3>
                     <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {cart.map(item => (
                            <div key={item._id} className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-black/40 rounded overflow-hidden">
                                     <img src={item.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">{item.name}</p>
                                    <p className="text-xs text-white/50">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-mono text-gold-400">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                     </div>
                     <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total Due</span>
                            <span className="text-gold-500">${total.toFixed(2)}</span>
                        </div>
                     </div>
                </div>

                {/* Secure Payment Side */}
                <div className="p-8 relative">
                    {step === 'processing' && (
                        <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gold-500 font-mono animate-pulse">Processing Secure Payment...</p>
                            <p className="text-xs text-white/30 mt-2">Do not close this window</p>
                        </div>
                    )}

                    <h2 className="text-2xl font-serif text-white mb-6">Secure Checkout</h2>
                    
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-white/50">Full Name</label>
                             <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none transition-colors" placeholder="Charlie Bucket" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-white/50">Email Address</label>
                             <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none transition-colors" placeholder="charlie@goldenticket.com" />
                        </div>
                        
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-white/50 mb-2 block">Delivery Location</label>
                             
                             <div className="flex gap-2 mb-2">
                                <button 
                                    type="button" 
                                    onClick={() => setLocationType('manual')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase rounded border ${locationType === 'manual' ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/20 hover:border-white'}`}
                                >
                                    Enter Address manually
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleUseCurrentLocation}
                                    className={`flex-1 py-2 text-xs font-bold uppercase rounded border ${locationType === 'gps' ? 'bg-gold-500 text-black border-gold-500' : 'bg-transparent text-white/50 border-white/20 hover:border-white'}`}
                                >
                                    {gpsLoading ? 'Locating...' : 'Use My Location'}
                                </button>
                             </div>

                             <input 
                                required 
                                value={formData.address} 
                                onChange={e=>setFormData({...formData, address: e.target.value})} 
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none transition-colors" 
                                placeholder={locationType === 'gps' ? "GPS Coordinates (or add details)" : "123 Chocolate Factory Rd"}
                             />
                             {locationType === 'gps' && gpsCoords && (
                                 <p className="text-[10px] text-green-400 mt-1">✓ Location Locked: {gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)}</p>
                             )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-white/10">
                            <label className="text-xs uppercase text-gold-500 mb-4 block">Payment Details (Encrypted)</label>
                            <div className="space-y-4">
                                <input required type="text" value={formData.card} onChange={e=>setFormData({...formData, card: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none font-mono" placeholder="0000 0000 0000 0000" maxLength="19" />
                                <div className="grid grid-cols-2 gap-4">
                                     <input required type="text" value={formData.expiry} onChange={e=>setFormData({...formData, expiry: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none font-mono" placeholder="MM/YY" maxLength="5" />
                                     <input required type="text" value={formData.cvc} onChange={e=>setFormData({...formData, cvc: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none font-mono" placeholder="CVC" maxLength="3" />
                                </div>
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="w-full py-4 mt-6 bg-gold-500 hover:bg-white text-black font-bold uppercase tracking-widest rounded-lg transition-all transform active:scale-95 shadow-lg shadow-gold-500/20">
                            Pay ${total.toFixed(2)}
                        </button>
                         <p className="text-[10px] text-center text-white/30 mt-4"><span className="text-green-500">🔒 256-Bit SSL Encrypted.</span> Powered by WonkaPay.</p>
                    </form>
                </div>
             </div>
        </div>
    );
}
