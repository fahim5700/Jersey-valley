import { useState, useEffect } from 'react';
import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Plus, 
  Search, 
  MoreVertical, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useAuth } from '@/src/context/AuthContext';
import { db } from '@/src/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  totalAmount?: number;
  status?: string;
  shippingInfo?: {
    name?: string;
    phone?: string;
  };
  createdAt?: any;
}

const SALES_DATA = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
      return;
    }

    if (!isAdmin) return;

    // Fetch Recent Orders
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
      setOrders(ordersData);
      
      const totalRev = ordersData.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
      setStats(prev => ({ ...prev, orders: ordersData.length, revenue: totalRev }));
    });

    // Fetch Customers
    const customersQuery = query(collection(db, 'users'), limit(50));
    const unsubCustomers = onSnapshot(customersQuery, (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setStats(prev => ({ ...prev, customers: snapshot.docs.length }));
    });

    return () => {
      unsubOrders();
      unsubCustomers();
    };
  }, [isAdmin, authLoading, navigate]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (error) {
      console.error("Status Update Error:", error);
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center text-primary font-black italic tracking-widest uppercase">Initializing...</div>;
  if (!isAdmin) return null;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">ADMIN CENTRAL</h1>
          <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] font-bold">Jersey Valley Operations</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-none border-zinc-800 uppercase text-[10px] tracking-widest font-bold h-12 px-8">
            Export Report
          </Button>
          <Button className="rounded-none uppercase text-[10px] tracking-widest font-bold h-12 px-8">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Revenue" value={`৳${stats.revenue.toLocaleString()}`} change="+12.5%" icon={DollarSign} />
        <StatCard title="Total Orders" value={stats.orders.toString()} change="+5.2%" icon={ShoppingBag} />
        <StatCard title="Active Users" value={stats.customers.toString()} change="+18.7%" icon={Users} />
        <StatCard title="Inventory" value="1,850" change="-2.4%" icon={Package} />
      </div>

      <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveView}>
        <TabsList className="bg-zinc-950 border border-zinc-900 h-auto p-1 rounded-none inline-flex">
          <TabsTrigger value="overview" className="rounded-none px-8 py-3 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="products" className="rounded-none px-8 py-3 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Products</TabsTrigger>
          <TabsTrigger value="orders" className="rounded-none px-8 py-3 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Orders</TabsTrigger>
          <TabsTrigger value="customers" className="rounded-none px-8 py-3 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="rounded-none border-zinc-900 bg-zinc-950 px-6 py-8">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-black uppercase tracking-widest">Revenue Analytics</h3>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SALES_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                    <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '0' }}
                      itemStyle={{ color: '#d4af37', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="sales" fill="#d4af37" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="rounded-none border-zinc-900 bg-zinc-950 px-6 py-8">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-black uppercase tracking-widest">Growth Forecast</h3>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SALES_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                    <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '0' }}
                      itemStyle={{ color: '#d4af37', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#d4af37" strokeWidth={3} dot={{ fill: '#d4af37' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="rounded-none border-zinc-900 bg-zinc-950 p-8">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8">Recent Activity</h3>
            <div className="space-y-6">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-4 border-b border-zinc-900 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-0.5">Order Received</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Order {order.id} • {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleTimeString() : 'Recent'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-primary italic">৳{order.totalAmount}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="rounded-none border-zinc-900 bg-zinc-950 p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-zinc-900">
                  <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <th className="pb-6 px-4">Order ID</th>
                    <th className="pb-6 px-4">Customer</th>
                    <th className="pb-6 px-4">Total</th>
                    <th className="pb-6 px-4">Status</th>
                    <th className="pb-6 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-zinc-900/30 transition-colors">
                      <td className="py-6 px-4 font-bold text-xs text-white uppercase tracking-widest">{order.id}</td>
                      <td className="py-6 px-4">
                        <p className="text-xs font-bold text-white uppercase truncate max-w-[150px]">{order.shippingInfo?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{order.shippingInfo?.phone}</p>
                      </td>
                      <td className="py-6 px-4 font-bold text-xs text-primary italic">৳{order.totalAmount}</td>
                      <td className="py-6 px-4 font-bold text-xs">
                        <Badge className={cn(
                          "rounded-none text-[8px] uppercase tracking-widest",
                          order.status === 'Delivered' ? "bg-green-500/20 text-green-500 border-green-500/50" : "bg-primary/20 text-primary border-primary/50"
                        )}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-6 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:text-primary text-[8px] uppercase tracking-widest font-bold"
                          onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                        >
                          Mark Delivered
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon }: any) {
  return (
    <Card className="rounded-none border-zinc-900 bg-zinc-950 p-6 flex flex-col justify-between overflow-hidden relative group">
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-24 h-24 stroke-[1px]" />
      </div>
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{title}</span>
        <div className="w-8 h-8 rounded-none bg-primary flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      <div>
        <h4 className="text-3xl font-black italic tracking-tighter text-white mb-2">{value}</h4>
        <p className="text-[10px] font-bold uppercase tracking-widest">
          <span className={change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{change}</span>
          <span className="text-gray-500 ml-2">from last month</span>
        </p>
      </div>
    </Card>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
