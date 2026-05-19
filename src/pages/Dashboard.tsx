import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Package, Heart, Settings, LogOut, ChevronRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/src/context/AuthContext';
import { db } from '@/src/lib/firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Fetch user profile data
    const userRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
    });

    // Fetch user orders
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    });

    return () => {
      unsubUser();
      unsubOrders();
    };
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarLinks = [
    { id: 'orders', name: 'MY ORDERS', icon: Package },
    { id: 'wishlist', name: 'WISHLIST', icon: Heart },
    { id: 'profile', name: 'PROFILE INFO', icon: UserIcon },
    { id: 'settings', name: 'SETTINGS', icon: Settings },
  ];

  if (!user) return null;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex flex-col gap-2">
          <div className="p-8 mb-8 bg-zinc-950 border border-zinc-900 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 border-4 border-zinc-900 shadow-xl overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-primary-foreground" />
              )}
            </div>
            <h2 className="font-black italic tracking-tighter text-xl mb-1 uppercase truncate w-full">
              {user.displayName || 'MEMBER'}
            </h2>
            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-4">
              {userData?.rank || 'Basic'} Member
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[8px] rounded-none border-zinc-800">{orders.length} ORDERS</Badge>
              <Badge variant="outline" className="text-[8px] rounded-none border-zinc-800">{userData?.points || 0} POINTS</Badge>
            </div>
          </div>

          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={cn(
                "flex items-center gap-4 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300",
                activeTab === link.id 
                  ? "bg-primary text-primary-foreground" 
                  : "text-gray-500 hover:text-white hover:bg-zinc-900"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </button>
          ))}

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 mt-auto transition-colors"
          >
            <LogOut className="w-4 h-4" />
            SIGN OUT
          </button>
        </aside>

        {/* Content */}
        <main className="flex-grow">
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl font-black italic tracking-tighter mb-12 uppercase">Recent Orders</h1>
              
              <div className="space-y-6">
                {orders.length > 0 ? orders.map((order) => (
                  <Card key={order.id} className="rounded-none border-zinc-900 bg-zinc-950/50 overflow-hidden hover:border-primary/50 transition-colors">
                    <CardContent className="p-0">
                      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center font-bold text-primary tracking-widest text-[10px]">
                            JV
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Order ID: {order.id}</p>
                            <p className="font-bold text-sm text-white">
                              {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-center md:text-left">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Amount</p>
                            <p className="font-black text-primary">৳{order.totalAmount}</p>
                          </div>
                          <div className="text-center md:text-left">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Status</p>
                            <Badge className={cn(
                              "rounded-none text-[8px] uppercase tracking-widest px-3",
                              order.status === 'Delivered' ? "bg-green-500/20 text-green-500 border-green-500/50" : "bg-primary/20 text-primary border-primary/50"
                            )}>
                              {order.status}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-none text-[10px] font-bold uppercase tracking-widest group border-zinc-800">
                            View Details
                            <ChevronRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="p-20 text-center border border-dashed border-zinc-900">
                    <Package className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">No orders found yet.</p>
                  </div>
                )}
              </div>

              {/* Promo Banner */}
              <div className="mt-16 relative overflow-hidden bg-primary p-12 flex flex-col md:flex-row justify-between items-center gap-8">
                <Trophy className="absolute -left-8 -bottom-8 w-40 h-40 text-black/10 rotate-12" />
                <div className="relative z-10 text-center md:text-left">
                  <h3 className="text-3xl font-black italic tracking-tighter text-black mb-2 uppercase">Earn Elite Points</h3>
                  <p className="text-black/70 text-sm font-bold uppercase tracking-widest">Upgrade your rank to unlock exclusive drops.</p>
                </div>
                <Button className="relative z-10 bg-black text-white rounded-none px-8 font-black tracking-widest text-xs h-12">LOYALTY PROGRAM</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl font-black italic tracking-tighter mb-12 uppercase">Profile Details</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                  <p className="p-4 bg-zinc-950 border border-zinc-900 text-sm font-bold uppercase tracking-widest">
                    {user.displayName || 'N/A'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                  <p className="p-4 bg-zinc-950 border border-zinc-900 text-sm font-bold tracking-wide">
                    {user.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone</label>
                  <p className="p-4 bg-zinc-950 border border-zinc-900 text-sm font-bold">
                    {userData?.phone || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Member Since</label>
                  <p className="p-4 bg-zinc-950 border border-zinc-900 text-sm font-bold uppercase tracking-widest">
                    {userData?.memberSince ? new Date(userData.memberSince).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <Button className="mt-12 rounded-none px-12 uppercase tracking-widest font-bold h-14">Edit Profile</Button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
