/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/src/context/CartContext';
import { AuthProvider } from '@/src/context/AuthContext';
import Home from '@/src/pages/Home';
import Shop from '@/src/pages/Shop';
import ProductDetail from '@/src/pages/ProductDetail';
import Cart from '@/src/pages/Cart';
import Checkout from '@/src/pages/Checkout';
import Dashboard from '@/src/pages/Dashboard';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

import AdminDashboard from '@/src/pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans dark">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" richColors />
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}
