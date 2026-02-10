import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role/email
        if (data.user.role === 'admin' || data.user.email === 'admin@gmail.com') {
            navigate('/admin');
        } else if (data.user.role === 'chef' || data.user.email === 'chef@gmail.com') {
            navigate('/chef');
        } else if (data.user.role === 'supplier' || data.user.email === 'supplier@gmail.com') {
            navigate('/suppliers');
        } else {
            navigate('/profile');
        }
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
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-gold-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-chocolate-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 z-10"
      >
        <h2 className="text-3xl font-bold text-center text-gold-500 mb-2 font-serif">Welcome Back</h2>
        <p className="text-center text-chocolate-200 mb-8 text-sm">Enter your credentials to access the factory.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-chocolate-100 mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder-white/20 transition-colors"
              placeholder="willy@wonka.com"
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
            Unlock the Gates
          </button>
        </form>

        <p className="mt-6 text-center text-chocolate-200 text-sm">
          Don't have a Golden Ticket?{' '}
          <Link to="/register" className="text-gold-500 hover:underline">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
