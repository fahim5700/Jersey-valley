import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Jersey Valley API is active" });
  });

  // Mock API for orders
  app.post("/api/orders", (req, res) => {
    const orderData = req.body;
    console.log("New Order Received:", orderData);
    res.status(201).json({ 
      success: true, 
      orderId: `JV-${Math.floor(Math.random() * 10000)}`,
      message: "Order placed successfully" 
    });
  });

  // Mock API for auth/OTP
  app.post("/api/auth/otp", (req, res) => {
    const { phone } = req.body;
    console.log(`Sending OTP to: ${phone}`);
    res.json({ success: true, message: "OTP sent successfully" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Jersey Valley Server running on http://localhost:${PORT}`);
  });
}

startServer();
