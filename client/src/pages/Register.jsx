import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registration Successful! Please Login.');
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-chocolate-900 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-gold-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-chocolate-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 z-10"
      >
        <h2 className="text-3xl font-bold text-center text-gold-500 mb-2 font-serif">Claim Your Ticket</h2>
        <p className="text-center text-chocolate-200 mb-8 text-sm">Join the waiting list for the tour.</p>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-chocolate-100 mb-2">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder-white/20 transition-colors"
              placeholder="CharlieBucket"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-chocolate-100 mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder-white/20 transition-colors"
              placeholder="charlie@goldenticket.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-chocolate-100 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder-white/20 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold rounded-lg hover:from-gold-500 hover:to-gold-400 transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(218,165,32,0.3)]"
          >
            Create My Account
          </button>
        </form>

        <p className="mt-6 text-center text-chocolate-200 text-sm">
          Already have a ticket?{' '}
          <Link to="/login" className="text-gold-500 hover:underline">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
