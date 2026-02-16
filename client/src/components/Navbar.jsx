import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { cart } = useCart();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className={`fixed w-full z-50 p-6 flex justify-between items-center transition-all duration-300 ${isHome ? 'bg-black/10 backdrop-blur-sm' : 'bg-chocolate-900 border-b border-white/10'}`}>
        <Link to="/" className="text-2xl font-bold text-gold-500 font-serif tracking-wider">CHARLIE'S</Link>
        <div className="space-x-8 text-xs font-bold font-sans tracking-[0.2em] hidden md:flex items-center">
          <Link to="/" className="hover:text-gold-500 transition-colors text-white">HOME</Link>
          <Link to="/products" className="hover:text-gold-500 transition-colors text-white">COLLECTION</Link>
          <Link to="/factory-map" className="hover:text-gold-500 transition-colors text-white">LIVE MAP</Link>
          <Link to="/about" className="hover:text-gold-500 transition-colors text-white">STORY</Link>
          <Link to="/locations" className="hover:text-gold-500 transition-colors text-white">LOCATIONS</Link>
          <Link to="/contact" className="hover:text-gold-500 transition-colors text-white">CONCIERGE</Link>
        </div>
        <div className="flex gap-6 items-center">
            {/* Cart Icon */}
            <Link to="/cart" className="relative group">
                <svg className="w-6 h-6 text-white group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {cart.reduce((a,b) => a + b.quantity, 0)}
                    </span>
                )}
            </Link>

            {user ? (
                 <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-gold-500 text-black flex items-center justify-center font-bold text-xs">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden md:block">{user.username}</span>
                </Link>
            ) : (
                <div className="flex gap-4">
                    <Link to="/login">
                        <button className="px-6 py-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-all duration-300 rounded-full text-sm uppercase tracking-wider">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="px-6 py-2 bg-gold-500 text-black hover:bg-white hover:text-chocolate-900 transition-all duration-300 rounded-full text-sm uppercase tracking-wider">
                            Sign Up
                        </button>
                    </Link>
                </div>
            )}
        </div>
    </nav>
  );
}
