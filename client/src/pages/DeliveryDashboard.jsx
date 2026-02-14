import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to auto-center map
const MapUpdater = ({ locations }) => {
    const map = useMap();
    useEffect(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(o => [o.coords.lat, o.coords.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [locations, map]);
    return null;
};

// Helper to geocode address (Nominatim API - Rate limited! Use sparingly)
const geocodeAddress = async (address) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (error) {
    console.warn("Geocoding failed for", address);
  }
  return null;
};

// Custom Hook to geocode list of orders
const useGeocodedOrders = (orders) => {
  const [geocodedOrders, setGeocodedOrders] = useState([]);

  useEffect(() => {
    const fetchCoords = async () => {
      const updatedOrders = await Promise.all(orders.map(async (order) => {
        // Checking if already has coordinates (future proofing) or geocoding
        let coords = order.location; 
        if (!coords || !coords.lat) {
           const realCoords = await geocodeAddress(order.address);
           if (realCoords) {
             coords = realCoords;
           } else {
             // If geocoding fails, do NOT fake London. user should know address is unmapped.
             coords = null; 
           }
        }
        return { ...order, coords };
      }));
      // Filter out orders with no valid coordinates for the map
      setGeocodedOrders(updatedOrders.filter(o => o.coords !== null));
    };

    if (orders.length > 0) {
      fetchCoords();
    }
  }, [orders]);

  return geocodedOrders;
};

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || (storedUser.role !== 'delivery' && storedUser.role !== 'admin' && storedUser.email !== 'admin@gmail.com')) {
      alert('Access Restricted: Delivery Staff Only');
      navigate('/');
      return;
    }
    setUser(storedUser);
    fetchOrders(storedUser);
  }, []);

  const fetchOrders = async (user) => {
    try {
      let url = `http://localhost:5000/api/orders/delivery/${user.id}`;
      if (user.role === 'admin' || user.email === 'admin@gmail.com') {
          url = `http://localhost:5000/api/orders`; 
      }

      const res = await fetch(url);
      if (res.ok) {
        let data = await res.json();
        // Filter logic if needed
        if (user.role === 'admin' || user.email === 'admin@gmail.com') {
             // Optional: Filter logic
        }
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const geocodedOrders = useGeocodedOrders(orders);

  const updateStatus = async (orderId, newStatus) => {
    const note = prompt('Add a note (optional):', '');
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/delivery-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note })
      });
      if (res.ok) {
        alert('Status Updated');
        fetchOrders(user);
      }
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
    <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
            <span>🚚</span> DELIVERY DASHBOARD
        </h1>
        <div className="flex items-center gap-6">
            <div className="flex bg-white/10 rounded-lg p-1">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-1 rounded-md text-sm font-bold transition-colors ${viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white'}`}
                >
                    List View
                </button>
                <button 
                    onClick={() => setViewMode('map')}
                    className={`px-4 py-1 rounded-md text-sm font-bold transition-colors ${viewMode === 'map' ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white'}`}
                >
                    Map View
                </button>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-400 hidden md:inline">Welcome, {user?.username}</span>
                <button onClick={handleLogout} className="text-red-400 hover:text-white text-sm uppercase tracking-wider">Logout</button>
            </div>
        </div>
      </header>

      <main className="flex-1 p-0 relative">
        {viewMode === 'map' ? (
            <div className="h-[calc(100vh-80px)] w-full">
                <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater locations={geocodedOrders} />
                    {geocodedOrders.map(order => (
                        <Marker key={order._id} position={[order.coords.lat, order.coords.lng]}>
                            <Popup>
                                <div className="text-black font-sans min-w-[200px]">
                                    <h3 className="font-bold text-lg mb-1">{order.customerName}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{order.address}</p>
                                    <div className="border-t pt-2 mt-2">
                                        <p className="font-bold flex justify-between">
                                            <span>Status:</span>
                                            <span className={`${
                                                order.deliveryStatus === 'Delivered' ? 'text-green-600' : 'text-amber-600'
                                            }`}>{order.deliveryStatus}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">Order #{order._id.slice(-6)}</p>
                                    </div>
                                    {order.deliveryStatus !== 'Delivered' && (
                                        <button 
                                            onClick={() => updateStatus(order._id, 'Delivered')}
                                            className="mt-3 w-full py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600 transition-colors"
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        ) : (
            <div className="p-8 max-w-6xl mx-auto space-y-8">
                <h2 className="text-xl text-white/50 uppercase tracking-widest pl-2 border-l-4 border-amber-500">My Assignments</h2>

                {orders.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-2xl">No deliveries assigned currently.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map(order => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={order._id} 
                                className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/10 transition-colors"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                            order.deliveryStatus === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                            order.deliveryStatus === 'Out for Delivery' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-amber-500/20 text-amber-400'
                                        }`}>
                                            {order.deliveryStatus}
                                        </span>
                                        <span className="text-white/40 text-xs">#{order._id.slice(-6)}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{order.customerName}</h3>
                                    <p className="text-neutral-400 text-sm mb-4">{order.address}</p>
                                    
                                    <div className="flex flex-col gap-1 text-sm text-neutral-500">
                                        {order.items.map((item, i) => (
                                            <span key={i}>• {item.quantity}x {item.name || 'Product'}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <button 
                                        onClick={() => updateStatus(order._id, 'Out for Delivery')}
                                        disabled={order.deliveryStatus === 'Delivered' || order.deliveryStatus === 'Out for Delivery'}
                                        className="px-4 py-2 bg-blue-600 rounded text-sm font-bold disabled:opacity-30 hover:bg-blue-500 transition-colors"
                                    >
                                        Mark Out for Delivery
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(order._id, 'Delivered')}
                                        disabled={order.deliveryStatus === 'Delivered'}
                                        className="px-4 py-2 bg-green-600 rounded text-sm font-bold disabled:opacity-30 hover:bg-green-500 transition-colors"
                                    >
                                        Mark Delivered
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
}
